import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { requestStatusService } from "./request-status.service";

const changeStatus = catchAsync(async (req: Request, res: Response) => {
	const result = await requestStatusService.changeStatus(
		String(req.params.id),
		req.user.id,
		req.body,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: `Request status changed to ${result.toStatus} successfully`,
		data: result,
	});
});

const getStatusHistory = catchAsync(async (req: Request, res: Response) => {
	const result = await requestStatusService.getStatusHistory(
		String(req.params.id),
		req.user.id,
		req.user.role,
		req.query as Record<string, string>,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Status history fetched successfully",
		data: result.data,
		meta: result.meta,
	});
});

export const requestStatusController = {
	changeStatus,
	getStatusHistory,
};
