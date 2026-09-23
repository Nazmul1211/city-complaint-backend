import { prisma } from "../../lib/prisma";
import type {
	IAuditLogFilters,
	IAuditLogList,
	IAuditLogResponse,
} from "./audit-log.interface";

type AuditLogTxClient = Parameters<
	Parameters<typeof prisma.$transaction>[0]
>[0];

export interface IRecordAuditLog {
	action: string;
	entityType: string;
	entityId: string;
	actorId?: string | null;
	oldValues?: unknown;
	newValues?: unknown;
	ipAddress?: string | null;
	userAgent?: string | null;
	tx?: AuditLogTxClient;
}

// Single source of truth for writing audit entries. Pass `tx` when the action
// runs inside a transaction so the log commits or rolls back with it.
const recordAuditLog = async (payload: IRecordAuditLog): Promise<void> => {
	const client = payload.tx ?? prisma;

	await client.auditLog.create({
		data: {
			action: payload.action,
			entityType: payload.entityType,
			entityId: payload.entityId,
			actorId: payload.actorId ?? null,
			oldValues: payload.oldValues === undefined ? undefined : (payload.oldValues as object),
			newValues: payload.newValues === undefined ? undefined : (payload.newValues as object),
			ipAddress: payload.ipAddress ?? null,
			userAgent: payload.userAgent ?? null,
		},
	});
};

const getAuditLogs = async (filters: IAuditLogFilters): Promise<IAuditLogList> => {
	const {
		action,
		entityType,
		entityId,
		actorId,
		page = 1,
		limit = 20,
		sortBy = "createdAt",
		sortOrder = "desc",
	} = filters;

	const pageNumber = Math.max(Number(page) || 1, 1);
	const limitNumber = Math.min(Math.max(Number(limit) || 20, 1), 100);

	const where: Record<string, unknown> = {};

	if (action) where.action = action.toUpperCase();
	if (entityType) where.entityType = entityType.toUpperCase();
	if (entityId) where.entityId = entityId;
	if (actorId) where.actorId = actorId;

	const [data, total] = await prisma.$transaction([
		prisma.auditLog.findMany({
			where,
			orderBy: { [sortBy]: sortOrder },
			skip: (pageNumber - 1) * limitNumber,
			take: limitNumber,
			include: {
				actor: {
					select: { id: true, name: true, email: true, role: true },
				},
			},
		}),
		prisma.auditLog.count({ where }),
	]);

	return {
		data: data as unknown as IAuditLogResponse[],
		meta: {
			page: pageNumber,
			limit: limitNumber,
			total,
			totalPages: Math.ceil(total / limitNumber),
		},
	};
};

// Distinct action verbs for filter dropdowns in admin dashboards
const getAuditLogActions = async (): Promise<string[]> => {
	const rows = await prisma.auditLog.findMany({
		distinct: ["action"],
		orderBy: { action: "asc" },
		select: { action: true },
	});
	return rows.map((r) => r.action);
};

export const auditLogService = {
	recordAuditLog,
	getAuditLogs,
	getAuditLogActions,
};
