import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { departmentMemberService } from "./departmentMember.service";

const addMember = catchAsync(async (req: Request, res: Response) => {
	const result = await departmentMemberService.addMember(
		req.params.id as string,
		req.body,
	);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Member added to department successfully",
		data: result,
	});
});

const getMembers = catchAsync(async (req: Request, res: Response) => {
	const result = await departmentMemberService.getMembers(
		req.params.id as string,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Department members fetched successfully",
		data: result,
	});
});

const updateMember = catchAsync(async (req: Request, res: Response) => {
	const result = await departmentMemberService.updateMember(
		req.params.id as string,
		req.params.memberId as string,
		req.body,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Department member updated successfully",
		data: result,
	});
});

const removeMember = catchAsync(async (req: Request, res: Response) => {
	await departmentMemberService.removeMember(
		req.params.id as string,
		req.params.memberId as string,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Department member removed successfully",
		data: null,
	});
});

export const departmentMemberController = {
	addMember,
	getMembers,
	updateMember,
	removeMember,
};
