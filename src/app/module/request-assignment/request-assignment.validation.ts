import { z } from "zod";

const assignRequestSchema = z.object({
	params: z.object({
		id: z.string().uuid("Invalid request ID"),
	}),
	body: z.object({
		assigneeId: z.string().uuid("Invalid assignee ID"),
		note: z.string().max(500, "Note cannot exceed 500 characters").optional(),
	}),
});

const releaseAssignmentSchema = z.object({
	params: z.object({
		id: z.string().uuid("Invalid request ID"),
		assignmentId: z.string().uuid("Invalid assignment ID"),
	}),
	body: z.object({
		note: z.string().max(500, "Note cannot exceed 500 characters").optional(),
	}),
});

const listAssignmentsSchema = z.object({
	params: z.object({
		id: z.string().uuid("Invalid request ID"),
	}),
	query: z.object({
		page: z.coerce.number().int().positive().default(1),
		limit: z.coerce.number().int().positive().max(100).default(20),
		sortBy: z.string().default("assignedAt"),
		sortOrder: z.enum(["asc", "desc"]).default("desc"),
	}),
});

export const requestAssignmentValidation = {
	assignRequestSchema,
	releaseAssignmentSchema,
	listAssignmentsSchema,
};