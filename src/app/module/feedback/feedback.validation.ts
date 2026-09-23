import { z } from "zod";

const createFeedbackSchema = z.object({
	params: z.object({
		id: z.string().uuid("Invalid request ID"),
	}),
	body: z.object({
		rating: z
			.number({ message: "Rating must be a number" })
			.int("Rating must be a whole number")
			.min(1, "Rating must be at least 1")
			.max(5, "Rating cannot exceed 5"),
		comment: z
			.string()
			.max(1000, "Comment cannot exceed 1000 characters")
			.optional(),
	}),
});

const getFeedbackSchema = z.object({
	params: z.object({
		id: z.string().uuid("Invalid request ID"),
	}),
});

export const feedbackValidation = {
	createFeedbackSchema,
	getFeedbackSchema,
};
