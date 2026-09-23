import { z } from "zod";
import { RequestStatus } from "../../../../generated/prisma/enums";

const changeStatusSchema = z.object({
	params: z.object({
		id: z.string().uuid("Invalid request ID"),
	}),
	body: z.object({
		toStatus: z.nativeEnum(RequestStatus, {
			message: `toStatus must be one of: ${Object.values(RequestStatus).join(", ")}`,
		}),
		note: z.string().max(1000, "Note cannot exceed 1000 characters").optional(),
	}),
});

const listStatusHistorySchema = z.object({
	params: z.object({
		id: z.string().uuid("Invalid request ID"),
	}),
	query: z.object({
		page: z.coerce.number().int().positive().default(1),
		limit: z.coerce.number().int().positive().max(100).default(20),
	}),
});

export const requestStatusValidation = {
	changeStatusSchema,
	listStatusHistorySchema,
};
