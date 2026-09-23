import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { paymentService } from "./payment.service";

const issuePayment = catchAsync(async (req: Request, res: Response) => {
	const result = await paymentService.issuePayment(req.body, req.user);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Payment invoice issued successfully",
		data: result,
	});
});

const initiateCheckout = catchAsync(async (req: Request, res: Response) => {
	const result = await paymentService.initiateCheckout(
		String(req.params.id),
		req.user,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "bKash checkout session initiated successfully",
		data: result,
	});
});

const handleCallback = catchAsync(async (req: Request, res: Response) => {
	const result = await paymentService.handleCallback(req.query as any);

	if (
		req.headers.accept?.includes("application/json") ||
		!result.redirectUrl
	) {
		sendResponse(res, {
			statusCode: httpStatus.OK,
			success: result.status === "success",
			message: result.message,
			data: result,
		});
	} else {
		res.redirect(result.redirectUrl);
	}
});

const getPaymentById = catchAsync(async (req: Request, res: Response) => {
	const result = await paymentService.getPaymentById(
		String(req.params.id),
		req.user,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Payment details fetched successfully",
		data: result,
	});
});

const getMyPayments = catchAsync(async (req: Request, res: Response) => {
	const result = await paymentService.getMyPayments(req.user, req.query);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Citizen payments fetched successfully",
		data: result.data,
		meta: result.meta,
	});
});

const getAllPayments = catchAsync(async (req: Request, res: Response) => {
	const result = await paymentService.getAllPayments(req.query);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "All payments fetched successfully",
		data: result.data,
		meta: result.meta,
	});
});

const refundPayment = catchAsync(async (req: Request, res: Response) => {
	const result = await paymentService.refundPayment(
		String(req.params.id),
		req.body,
		req.user,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Payment refunded successfully via bKash",
		data: result,
	});
});

export const paymentController = {
	issuePayment,
	initiateCheckout,
	handleCallback,
	getPaymentById,
	getMyPayments,
	getAllPayments,
	refundPayment,
};
