import type {
	PaymentPurpose,
	PaymentStatus,
	PaymentGateway,
	PaymentMethod,
	PaymentTransactionStatus,
	UserRole,
} from "../../../../generated/prisma/enums";

export interface IReqUser {
	id: string;
	name: string;
	email: string;
	role: UserRole;
	status: string;
}

export interface IIssuePaymentPayload {
	requestId: string;
	purpose: PaymentPurpose;
	amount: number;
	currency?: string;
	expiresAt?: string;
}

export interface IPaymentQuery {
	page?: number | string;
	limit?: number | string;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
	status?: PaymentStatus;
	requestId?: string;
	purpose?: PaymentPurpose;
}

export interface IBkashCallbackQuery {
	paymentID: string;
	status: "success" | "cancel" | "failure";
}

export interface IRefundPaymentPayload {
	amount?: number;
	reason: string;
	sku?: string;
}

export interface IBkashCreateResponse {
	statusCode: string;
	statusMessage: string;
	paymentID: string;
	bkashURL: string;
	customerMsisdn?: string;
	amount: string;
	intent: string;
	merchantInvoiceNumber: string;
	currency: string;
	paymentCreateTime: string;
	transactionStatus: string;
}

export interface IBkashExecuteResponse {
	statusCode: string;
	statusMessage: string;
	paymentID: string;
	payerReference?: string;
	customerMsisdn?: string;
	trxID: string;
	amount: string;
	transactionStatus: string;
	paymentExecuteTime: string;
	currency: string;
	intent: string;
	merchantInvoiceNumber: string;
}

export interface IBkashRefundResponse {
	statusCode: string;
	statusMessage: string;
	originalTrxID: string;
	refundTrxID: string;
	transactionStatus: string;
	amount: string;
	currency: string;
	completedTime: string;
}
