import { z } from "zod";

const getAuditLogsSchema = z.object({
	query: z.object({
		action: z.string().optional(),
		entityType: z.string().optional(),
		entityId: z.uuid().optional(),
		actorId: z.uuid().optional(),
		page: z.coerce.number().int().min(1).optional(),
		limit: z.coerce.number().int().min(1).max(100).optional(),
		sortBy: z.enum(["createdAt", "action", "entityType"]).optional(),
		sortOrder: z.enum(["asc", "desc"]).optional(),
	}),
});

export const auditLogValidation = {
	getAuditLogsSchema,
};
