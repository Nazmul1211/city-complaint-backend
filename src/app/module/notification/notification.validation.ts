import { z } from "zod";

const getNotificationsSchema = z.object({
	query: z.object({
		unreadOnly: z
			.enum(["true", "false"])
			.optional()
			.transform((value) => value === "true"),
		page: z.coerce.number().int().positive().default(1),
		limit: z.coerce.number().int().positive().max(100).default(20),
	}),
});

const markNotificationReadSchema = z.object({
	params: z.object({
		id: z.string().uuid("Invalid notification ID"),
	}),
});

export const notificationValidation = {
	getNotificationsSchema,
	markNotificationReadSchema,
};
