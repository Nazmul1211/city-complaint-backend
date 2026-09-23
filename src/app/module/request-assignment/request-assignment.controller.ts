import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { requestAssignmentService } from "./request-assignment.service";

const assignRequest = catchAsync(async (req: Request, res: Response) => {
	const result = await requestAssignmentService.assignRequest(
		String(req.params.id),
		req.user.id,
		req.user.role,
		req.body,
	);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Request assigned to staff successfully",
		data: result,
	});
});

const getAssignments = catchAsync(async (req: Request, res: Response) => {
	const result = await requestAssignmentService.getAssignments(
		String(req.params.id),
		req.query as Record<string, string>,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Assignments fetched successfully",
		data: result.data,
		meta: result.meta,
	});
});

const releaseAssignment = catchAsync(async (req: Request, res: Response) => {
	const result = await requestAssignmentService.releaseAssignment(
		String(req.params.id),
		String(req.params.assignmentId),
		req.user.id,
		req.user.role,
		req.body,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Assignment released successfully",
		data: result,
	});
});

export const requestAssignmentController = {
	assignRequest,
	getAssignments,
	releaseAssignment,
};