import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { auditLogService } from "./audit-log.service";
import type { IAuditLogFilters } from "./audit-log.interface";

const getAuditLogs = catchAsync(async (req: Request, res: Response) => {
	const filters: IAuditLogFilters = {
		action: req.query.action as string | undefined,
		entityType: req.query.entityType as string | undefined,
		entityId: req.query.entityId as string | undefined,
		actorId: req.query.actorId as string | undefined,
		page: req.query.page ? Number(req.query.page) : undefined,
		limit: req.query.limit ? Number(req.query.limit) : undefined,
		sortBy: req.query.sortBy as string | undefined,
		sortOrder: req.query.sortOrder as "asc" | "desc" | undefined,
	};

	const result = await auditLogService.getAuditLogs(filters);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Audit logs fetched successfully",
		data: result.data,
		meta: result.meta,
	});
});

const getAuditLogActions = catchAsync(async (_req: Request, res: Response) => {
	const actions = await auditLogService.getAuditLogActions();

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Audit log actions fetched successfully",
		data: actions,
	});
});

export const auditLogController = {
	getAuditLogs,
	getAuditLogActions,
};
