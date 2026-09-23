import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { workUpdateService } from "./work-update.service";

const createWorkUpdate = catchAsync(async (req: Request, res: Response) => {
	const result = await workUpdateService.createWorkUpdate(
		String(req.params.id),
		req.user.id,
		req.user.role,
		req.body,
	);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Work update added successfully",
		data: result,
	});
});

const getWorkUpdates = catchAsync(async (req: Request, res: Response) => {
	const result = await workUpdateService.getWorkUpdates(
		String(req.params.id),
		req.user.id,
		req.user.role,
		req.query as Record<string, string>,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Work updates fetched successfully",
		data: result.data,
		meta: result.meta,
	});
});

export const workUpdateController = {
	createWorkUpdate,
	getWorkUpdates,
};
