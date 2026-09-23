import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { feedbackService } from "./feedback.service";

const createFeedback = catchAsync(async (req: Request, res: Response) => {
	const result = await feedbackService.createFeedback(
		String(req.params.id),
		req.user.id,
		req.body,
	);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Feedback submitted successfully",
		data: result,
	});
});

const getFeedback = catchAsync(async (req: Request, res: Response) => {
	const result = await feedbackService.getFeedback(
		String(req.params.id),
		req.user.id,
		req.user.role,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Feedback fetched successfully",
		data: result,
	});
});

export const feedbackController = {
	createFeedback,
	getFeedback,
};
