import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { slaPolicyService } from "./slaPolicy.service";


// POST /categories/:categoryId/sla
const createSla = catchAsync(async (req: Request, res: Response) => {
	const result = await slaPolicyService.createSlaForCategory(
		req.params.categoryId as string,
		req.body,
	);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "SLA policy created successfully",
		data: result,
	});
});

// GET /categories/:categoryId/sla
const getSla = catchAsync(async (req: Request, res: Response) => {
	const result = await slaPolicyService.getSlaByCategory(
		req.params.categoryId as string,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "SLA policy fetched successfully",
		data: result, // null when the category has no SLA configured yet
	});
});

// PATCH /categories/:categoryId/sla
const updateSla = catchAsync(async (req: Request, res: Response) => {
	const result = await slaPolicyService.updateSlaForCategory(
		req.params.categoryId as string,
		req.body,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "SLA policy updated successfully",
		data: result,
	});
});

export const slaPolicyController = {
	createSla,
	getSla,
	updateSla,
};
