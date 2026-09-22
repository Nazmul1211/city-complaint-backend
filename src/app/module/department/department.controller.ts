import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { departmentService } from "./department.service";

const createDepartment = catchAsync(async (req: Request, res: Response) => {
	const result = await departmentService.createDepartment(req.body);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Department created successfully",
		data: result,
	});
});

const getAllDepartments = catchAsync(async (_req: Request, res: Response) => {
	const result = await departmentService.getAllDepartments();

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Departments fetched successfully",
		data: result,
	});
});

const getDepartmentById = catchAsync(async (req: Request, res: Response) => {
	const result = await departmentService.getDepartmentById(
		req.params.id as string,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Department fetched successfully",
		data: result,
	});
});

const updateDepartment = catchAsync(async (req: Request, res: Response) => {
	const result = await departmentService.updateDepartment(
		req.params.id as string,
		req.body,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Department updated successfully",
		data: result,
	});
});

const deleteDepartment = catchAsync(async (req: Request, res: Response) => {
	await departmentService.deleteDepartment(req.params.id as string);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Department deleted successfully",
		data: null,
	});
});

export const departmentController = {
	createDepartment,
	getAllDepartments,
	getDepartmentById,
	updateDepartment,
	deleteDepartment,
};
