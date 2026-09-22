import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { wardService } from "./ward.service";
import type { IWardFilterParams } from "./ward.interface";

const createWard = catchAsync(async (req: Request, res: Response) => {
	const result = await wardService.createWard(req.body);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Ward created successfully",
		data: result,
	});
});

const getAllWards = catchAsync(async (req: Request, res: Response) => {
	const filters: IWardFilterParams = {
		city: req.query.city as string | undefined,
		isActive: req.query.isActive
			? req.query.isActive === "true"
			: undefined,
	};

	const result = await wardService.getAllWards(filters);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Wards fetched successfully",
		data: result,
	});
});

const getWardById = catchAsync(async (req: Request, res: Response) => {
	const result = await wardService.getWardById(req.params.id as string);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Ward fetched successfully",
		data: result,
	});
});

const updateWard = catchAsync(async (req: Request, res: Response) => {
	const result = await wardService.updateWard(
		req.params.id as string,
		req.body,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Ward updated successfully",
		data: result,
	});
});

const deleteWard = catchAsync(async (req: Request, res: Response) => {
	await wardService.deleteWard(req.params.id as string);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Ward deleted successfully",
		data: null,
	});
});

export const wardController = {
	createWard,
	getAllWards,
	getWardById,
	updateWard,
	deleteWard,
};
