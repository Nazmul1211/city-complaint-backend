import { z } from "zod";

const createWorkUpdateSchema = z.object({
	params: z.object({
		id: z.string().uuid("Invalid request ID"),
	}),
	body: z.object({
		note: z.string().min(1, "Note is required").max(2000, "Note cannot exceed 2000 characters"),
		visibleToCitizen: z.boolean().default(false),
	}),
});

const listWorkUpdatesSchema = z.object({
	params: z.object({
		id: z.string().uuid("Invalid request ID"),
	}),
	query: z.object({
		page: z.coerce.number().int().positive().default(1),
		limit: z.coerce.number().int().positive().max(100).default(20),
	}),
});

export const workUpdateValidation = {
	createWorkUpdateSchema,
	listWorkUpdatesSchema,
};
