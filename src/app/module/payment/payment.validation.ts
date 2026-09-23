import { z } from "zod";
import {
	PaymentPurpose,
	PaymentStatus,
} from "../../../../generated/prisma/enums";

const issuePaymentSchema = z.object({
	body: z.object({
		requestId: z.string().uuid("Invalid Service Request ID"),
		purpose: z.nativeEnum(PaymentPurpose, {
			message: `Purpose must be one of: ${Object.values(PaymentPurpose).join(", ")}`,
		}),
		amount: z
			.number({ message: "Amount must be a number" })
			.positive("Amount must be greater than zero"),
		currency: z.string().default("BDT").optional(),
		expiresAt: z.string().datetime("Invalid expiration datetime").optional(),
	}),
});

const initiateCheckoutSchema = z.object({
	params: z.object({
		id: z.string().uuid("Invalid Payment ID"),
	}),
});

const callbackQuerySchema = z.object({
	query: z.object({
		paymentID: z.string({ message: "bKash paymentID is required" }),
		status: z.enum(["success", "cancel", "failure"] as const, {
			message: "Status must be success, cancel, or failure",
		}),
	}),
});

const queryPaymentSchema = z.object({
	query: z
		.object({
			page: z.string().optional(),
			limit: z.string().optional(),
			sortBy: z.string().optional(),
			sortOrder: z.enum(["asc", "desc"] as const).optional(),
			status: z.nativeEnum(PaymentStatus).optional(),
			requestId: z.string().uuid().optional(),
			purpose: z.nativeEnum(PaymentPurpose).optional(),
		})
		.optional(),
});

const refundPaymentSchema = z.object({
	params: z.object({
		id: z.string().uuid("Invalid Payment ID"),
	}),
	body: z.object({
		amount: z.number().positive().optional(),
		reason: z.string().min(3, "Reason must be at least 3 characters"),
		sku: z.string().optional(),
	}),
});

export const paymentValidation = {
	issuePaymentSchema,
	initiateCheckoutSchema,
	callbackQuerySchema,
	queryPaymentSchema,
	refundPaymentSchema,
};
