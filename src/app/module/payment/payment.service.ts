import httpStatus from "http-status";
import {
	PaymentGateway,
	PaymentMethod,
	PaymentStatus,
	PaymentTransactionStatus,
	UserRole,
} from "../../../../generated/prisma/enums";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { getBkashIdToken } from "../../lib/bkash";
import { AppError } from "../../../utils/AppError";
import { auditLogService } from "../audit-log/audit-log.service";
import { notificationService } from "../notification/notification.service";
import type {
	IBkashCallbackQuery,
	IBkashCreateResponse,
	IBkashExecuteResponse,
	IBkashRefundResponse,
	IIssuePaymentPayload,
	IPaymentQuery,
	IRefundPaymentPayload,
	IReqUser,
} from "./payment.interface";

const parseBkashDate = (timeStr?: string | null): Date => {
	if (!timeStr) return new Date();
	const direct = new Date(timeStr);
	if (!isNaN(direct.getTime())) return direct;

	// bKash format: "2026-09-23T21:50:42:720 GMT+0600"
	// Replace millisecond colon delimiter with dot and strip " GMT"
	const normalized = timeStr
		.replace(/(\d{2}:\d{2}:\d{2}):(\d{3})/, "$1.$2")
		.replace(" GMT", "");
	const parsed = new Date(normalized);
	if (!isNaN(parsed.getTime())) return parsed;

	return new Date();
};

const issuePayment = async (
	payload: IIssuePaymentPayload,
	issuedByUser: IReqUser,
) => {
	const { requestId, purpose, amount, currency = "BDT", expiresAt } = payload;

	const request = await prisma.serviceRequest.findUnique({
		where: { id: requestId },
		include: { citizen: true },
	});

	if (!request) {
		throw new AppError(httpStatus.NOT_FOUND, "Service request not found");
	}

	const payment = await prisma.payment.create({
		data: {
			requestId,
			issuedById: issuedByUser.id,
			purpose,
			amount,
			currency,
			status: PaymentStatus.PENDING,
			expiresAt: expiresAt ? new Date(expiresAt) : null,
		},
		include: {
			request: {
				select: { id: true, requestNo: true, title: true, status: true },
			},
		},
	});

	// Notify the citizen that payment is required
	await notificationService.notifyPaymentRequired(
		request,
		request.citizen.userId,
		amount,
		currency,
	);

	// Record audit log
	await auditLogService.recordAuditLog({
		action: "PAYMENT_ISSUED",
		entityType: "PAYMENT",
		entityId: payment.id,
		actorId: issuedByUser.id,
		newValues: {
			requestId: payment.requestId,
			purpose: payment.purpose,
			amount: payment.amount,
			currency: payment.currency,
		},
	});

	return payment;
};

const initiateCheckout = async (paymentId: string, user: IReqUser) => {
	const payment = await prisma.payment.findUnique({
		where: { id: paymentId },
		include: {
			request: {
				include: {
					citizen: true,
				},
			},
		},
	});

	if (!payment) {
		throw new AppError(httpStatus.NOT_FOUND, "Payment invoice not found");
	}

	if (payment.status === PaymentStatus.PAID) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"Payment has already been completed",
		);
	}

	if (payment.status !== PaymentStatus.PENDING) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			`Payment cannot be initiated for invoice in ${payment.status} status`,
		);
	}

	if (payment.expiresAt && new Date() > payment.expiresAt) {
		await prisma.payment.update({
			where: { id: paymentId },
			data: { status: PaymentStatus.EXPIRED },
		});
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"Payment invoice has expired. Please contact support.",
		);
	}

	// Citizen can only pay their own request invoices
	if (
		user.role === UserRole.CITIZEN &&
		payment.request.citizen.userId !== user.id
	) {
		throw new AppError(
			httpStatus.FORBIDDEN,
			"You are not authorized to pay this invoice",
		);
	}

	const bkashIdToken = await getBkashIdToken();

	if (!bkashIdToken) {
		throw new AppError(httpStatus.BAD_GATEWAY, "No bKash access token found");
	}

	const callbackURL = `${config.bkash_callback_url}/payments/callback`;

	const createPaymentResponse = await fetch(
		`${config.bkash_base_url}/tokenized/checkout/create`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: bkashIdToken,
				"X-App-Key": config.bkash_app_key,
			},
			body: JSON.stringify({
				mode: "0011",
				payerReference: user.email,
				callbackURL,
				amount: Number(payment.amount).toFixed(2),
				currency: payment.currency,
				intent: "sale",
				merchantInvoiceNumber: payment.id,
			}),
		},
	);

	if (!createPaymentResponse.ok) {
		throw new AppError(
			httpStatus.BAD_GATEWAY,
			"Failed to connect to bKash payment gateway",
		);
	}

	const result = (await createPaymentResponse.json()) as IBkashCreateResponse;

	if (result.statusCode !== "0000") {
		throw new AppError(
			httpStatus.BAD_GATEWAY,
			result.statusMessage || "bKash checkout creation failed",
		);
	}

	// Record transaction and event
	const idempotencyKey = `${payment.id}_${Date.now()}`;

	const transaction = await prisma.$transaction(async (tx) => {
		const createdTx = await tx.paymentTransaction.create({
			data: {
				paymentId: payment.id,
				gateway: PaymentGateway.BKASH,
				method: PaymentMethod.BKASH,
				amount: payment.amount,
				currency: payment.currency,
				idempotencyKey,
				gatewaySessionId: result.paymentID,
				checkoutUrl: result.bkashURL,
				status: PaymentTransactionStatus.INITIATED,
				gatewayMetadata: result as any,
			},
		});

		await tx.paymentEvent.create({
			data: {
				transactionId: createdTx.id,
				gateway: PaymentGateway.BKASH,
				gatewayEventId: result.paymentID,
				payload: result as any,
				signatureVerified: false,
			},
		});

		return createdTx;
	}, {
		maxWait: 10000,
		timeout: 20000,
	});

	return {
		paymentId: payment.id,
		transactionId: transaction.id,
		gatewaySessionId: result.paymentID,
		checkoutUrl: result.bkashURL,
		amount: payment.amount,
		currency: payment.currency,
	};
};

const handleCallback = async (query: IBkashCallbackQuery) => {
	const { paymentID, status } = query;

	if (!paymentID || !status) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"bKash callback missing paymentID or status",
		);
	}

	const transaction = await prisma.paymentTransaction.findUnique({
		where: { gatewaySessionId: paymentID },
		include: {
			payment: {
				include: {
					request: {
						include: {
							citizen: true,
						},
					},
				},
			},
		},
	});

	if (!transaction) {
		throw new AppError(
			httpStatus.NOT_FOUND,
			"Payment transaction not found for this bKash session",
		);
	}

	// If transaction already succeeded (e.g. repeated callback / page refresh)
	if (transaction.status === PaymentTransactionStatus.SUCCESS) {
		return {
			status: "success",
			message: "Payment already completed successfully",
			paymentId: transaction.paymentId,
			trxId: transaction.gatewayTransactionId || "",
			amount: transaction.amount,
			currency: transaction.currency,
			paidAt: transaction.verifiedAt || new Date(),
			redirectUrl: `${config.frontend_url}/dashboard/payments?status=success&trxId=${transaction.gatewayTransactionId}`,
		};
	}

	// If user cancelled
	if (status === "cancel") {
		await prisma.$transaction(async (tx) => {
			await tx.paymentTransaction.update({
				where: { id: transaction.id },
				data: { status: PaymentTransactionStatus.CANCELLED },
			});
			await tx.paymentEvent.create({
				data: {
					transactionId: transaction.id,
					gateway: PaymentGateway.BKASH,
					gatewayEventId: paymentID,
					payload: { status: "cancel", paymentID } as any,
				},
			});
		});

		return {
			status: "cancelled",
			message: "Payment was cancelled by the user",
			paymentId: transaction.paymentId,
			redirectUrl: `${config.frontend_url}/dashboard/payments?status=cancel`,
		};
	}

	// If payment failed
	if (status === "failure") {
		await prisma.$transaction(async (tx) => {
			await tx.paymentTransaction.update({
				where: { id: transaction.id },
				data: { status: PaymentTransactionStatus.FAILED },
			});
			await tx.paymentEvent.create({
				data: {
					transactionId: transaction.id,
					gateway: PaymentGateway.BKASH,
					gatewayEventId: paymentID,
					payload: { status: "failure", paymentID } as any,
				},
			});
		});

		return {
			status: "failed",
			message: "Payment processing failed on bKash",
			paymentId: transaction.paymentId,
			redirectUrl: `${config.frontend_url}/dashboard/payments?status=failure`,
		};
	}

	// On status === "success", execute payment
	const bkashIdToken = await getBkashIdToken();

	if (!bkashIdToken) {
		throw new AppError(httpStatus.BAD_GATEWAY, "No bKash access token found");
	}

	const executeResponse = await fetch(
		`${config.bkash_base_url}/tokenized/checkout/execute`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: bkashIdToken,
				"X-App-Key": config.bkash_app_key,
			},
			body: JSON.stringify({ paymentID }),
		},
	);

	if (!executeResponse.ok) {
		throw new AppError(
			httpStatus.BAD_GATEWAY,
			"Failed to execute payment with bKash",
		);
	}

	let result = (await executeResponse.json()) as IBkashExecuteResponse;

	// If bKash reports that the payment was already completed (e.g. status 2062)
	if (
		result.statusCode === "2062" ||
		result.statusMessage?.toLowerCase().includes("already been completed")
	) {
		const queryResponse = await fetch(
			`${config.bkash_base_url}/tokenized/checkout/payment/status`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: bkashIdToken,
					"X-App-Key": config.bkash_app_key,
				},
				body: JSON.stringify({ paymentID }),
			},
		);
		if (queryResponse.ok) {
			const queryData = (await queryResponse.json()) as IBkashExecuteResponse;
			if (
				queryData.transactionStatus === "Completed" &&
				queryData.statusCode === "0000"
			) {
				result = queryData;
			}
		}
	}

	if (
		result.statusCode !== "0000" ||
		result.transactionStatus !== "Completed"
	) {
		await prisma.$transaction(async (tx) => {
			await tx.paymentTransaction.update({
				where: { id: transaction.id },
				data: {
					status: PaymentTransactionStatus.FAILED,
					gatewayMetadata: result as any,
				},
			});
			await tx.paymentEvent.create({
				data: {
					transactionId: transaction.id,
					gateway: PaymentGateway.BKASH,
					gatewayEventId: paymentID,
					payload: result as any,
				},
			});
		}, { maxWait: 10000, timeout: 20000 });

		throw new AppError(
			httpStatus.BAD_REQUEST,
			result.statusMessage || "bKash payment execution was not completed",
		);
	}

	// Successful execution: safely parse executed date
	const executedAt = parseBkashDate(result.paymentExecuteTime);

	await prisma.$transaction(async (tx) => {
		await tx.paymentTransaction.update({
			where: { id: transaction.id },
			data: {
				status: PaymentTransactionStatus.SUCCESS,
				gatewayTransactionId: result.trxID,
				verifiedAt: executedAt,
				gatewayMetadata: result as any,
			},
		});

		await tx.payment.update({
			where: { id: transaction.paymentId },
			data: {
				status: PaymentStatus.PAID,
				paidAt: executedAt,
			},
		});

		await tx.paymentEvent.create({
			data: {
				transactionId: transaction.id,
				gateway: PaymentGateway.BKASH,
				gatewayEventId: result.trxID || paymentID,
				payload: result as any,
				signatureVerified: true,
				processedAt: new Date(),
			},
		});
	}, { maxWait: 10000, timeout: 20000 });

	// Send payment success notification to citizen
	await notificationService.notifyPaymentSuccessful(
		transaction.payment.request,
		transaction.payment.request.citizen.userId,
		Number(transaction.amount).toFixed(2),
		transaction.currency,
	);

	// Record audit log
	await auditLogService.recordAuditLog({
		action: "PAYMENT_COMPLETED",
		entityType: "PAYMENT",
		entityId: transaction.paymentId,
		actorId: transaction.payment.request.citizen.userId,
		newValues: {
			trxID: result.trxID,
			amount: result.amount,
			currency: result.currency,
			paymentID: result.paymentID,
		},
	});

	return {
		status: "success",
		message: "Payment completed successfully",
		paymentId: transaction.paymentId,
		trxId: result.trxID,
		amount: result.amount,
		currency: result.currency,
		paidAt: executedAt,
		redirectUrl: `${config.frontend_url}/dashboard/payments?status=success&trxId=${result.trxID}`,
	};
};

const getPaymentById = async (paymentId: string, user: IReqUser) => {
	const payment = await prisma.payment.findUnique({
		where: { id: paymentId },
		include: {
			request: {
				select: {
					id: true,
					requestNo: true,
					title: true,
					status: true,
					citizen: {
						select: {
							id: true,
							userId: true,
							contactNumber: true,
						},
					},
				},
			},
			issuedBy: {
				select: {
					id: true,
					name: true,
					email: true,
				},
			},
			transactions: {
				orderBy: { createdAt: "desc" },
				include: {
					events: {
						orderBy: { createdAt: "desc" },
					},
				},
			},
		},
	});

	if (!payment) {
		throw new AppError(httpStatus.NOT_FOUND, "Payment invoice not found");
	}

	if (
		user.role === UserRole.CITIZEN &&
		payment.request.citizen.userId !== user.id
	) {
		throw new AppError(
			httpStatus.FORBIDDEN,
			"You are not allowed to view this payment",
		);
	}

	return payment;
};

const getMyPayments = async (user: IReqUser, query: IPaymentQuery) => {
	const citizen = await prisma.citizen.findUnique({
		where: { userId: user.id },
	});

	if (!citizen) {
		throw new AppError(httpStatus.NOT_FOUND, "Citizen profile not found");
	}

	const page = Math.max(Number(query.page) || 1, 1);
	const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
	const skip = (page - 1) * limit;
	const sortBy = query.sortBy || "createdAt";
	const sortOrder = query.sortOrder || "desc";

	const where: any = {
		request: {
			citizenId: citizen.id,
		},
	};

	if (query.status) where.status = query.status;
	if (query.requestId) where.requestId = query.requestId;
	if (query.purpose) where.purpose = query.purpose;

	const [data, total] = await prisma.$transaction([
		prisma.payment.findMany({
			where,
			take: limit,
			skip,
			orderBy: { [sortBy]: sortOrder },
			include: {
				request: {
					select: { id: true, requestNo: true, title: true, status: true },
				},
				transactions: {
					orderBy: { createdAt: "desc" },
					take: 1,
				},
			},
		}),
		prisma.payment.count({ where }),
	]);

	return {
		data,
		meta: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
		},
	};
};

const getAllPayments = async (query: IPaymentQuery) => {
	const page = Math.max(Number(query.page) || 1, 1);
	const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
	const skip = (page - 1) * limit;
	const sortBy = query.sortBy || "createdAt";
	const sortOrder = query.sortOrder || "desc";

	const where: any = {};

	if (query.status) where.status = query.status;
	if (query.requestId) where.requestId = query.requestId;
	if (query.purpose) where.purpose = query.purpose;

	const [data, total] = await prisma.$transaction([
		prisma.payment.findMany({
			where,
			take: limit,
			skip,
			orderBy: { [sortBy]: sortOrder },
			include: {
				request: {
					select: {
						id: true,
						requestNo: true,
						title: true,
						status: true,
						citizen: {
							select: {
								id: true,
								userId: true,
								user: { select: { name: true, email: true } },
							},
						},
					},
				},
				issuedBy: {
					select: { id: true, name: true, email: true },
				},
				transactions: {
					orderBy: { createdAt: "desc" },
					take: 1,
				},
			},
		}),
		prisma.payment.count({ where }),
	]);

	return {
		data,
		meta: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
		},
	};
};

const refundPayment = async (
	paymentId: string,
	payload: IRefundPaymentPayload,
	actor: IReqUser,
) => {
	const payment = await prisma.payment.findUnique({
		where: { id: paymentId },
		include: {
			transactions: {
				where: { status: PaymentTransactionStatus.SUCCESS },
				orderBy: { createdAt: "desc" },
				take: 1,
			},
		},
	});

	if (!payment) {
		throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
	}

	if (payment.status !== PaymentStatus.PAID) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"Only successfully paid invoices can be refunded",
		);
	}

	const successfulTx = payment.transactions[0];
	if (!successfulTx || !successfulTx.gatewayTransactionId) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"No valid gateway transaction found to refund",
		);
	}

	const bkashIdToken = await getBkashIdToken();

	const refundAmount = payload.amount || Number(payment.amount);

	const bkashRefundResponse = await fetch(
		`${config.bkash_base_url}/tokenized/checkout/payment/refund`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: bkashIdToken,
				"X-App-Key": config.bkash_app_key,
			},
			body: JSON.stringify({
				paymentID: successfulTx.gatewaySessionId,
				trxID: successfulTx.gatewayTransactionId,
				amount: refundAmount.toFixed(2),
				sku: payload.sku || "Complaint Service Fee Refund",
				reason: payload.reason,
			}),
		},
	);

	if (!bkashRefundResponse.ok) {
		throw new AppError(
			httpStatus.BAD_GATEWAY,
			"bKash refund endpoint request failed",
		);
	}

	const refundResult =
		(await bkashRefundResponse.json()) as IBkashRefundResponse;

	if (refundResult.statusCode !== "0000") {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			refundResult.statusMessage || "bKash refund failed",
		);
	}

	await prisma.$transaction(async (tx) => {
		await tx.payment.update({
			where: { id: paymentId },
			data: { status: PaymentStatus.REFUNDED },
		});

		await tx.paymentEvent.create({
			data: {
				transactionId: successfulTx.id,
				gateway: PaymentGateway.BKASH,
				gatewayEventId: refundResult.refundTrxID || successfulTx.gatewaySessionId || "",
				payload: refundResult as any,
				signatureVerified: true,
				processedAt: new Date(),
			},
		});
	});

	await auditLogService.recordAuditLog({
		action: "PAYMENT_REFUNDED",
		entityType: "PAYMENT",
		entityId: paymentId,
		actorId: actor.id,
		newValues: {
			refundTrxId: refundResult.refundTrxID,
			amount: refundResult.amount,
			reason: payload.reason,
		},
	});

	return {
		success: true,
		message: "Payment refunded successfully",
		refundTrxId: refundResult.refundTrxID,
		amount: refundResult.amount,
	};
};

export const paymentService = {
	issuePayment,
	initiateCheckout,
	handleCallback,
	getPaymentById,
	getMyPayments,
	getAllPayments,
	refundPayment,
};
