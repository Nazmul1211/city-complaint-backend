import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { userService } from "./user.service";
import type { IUserFilterParams } from "./user.interface";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
	const filters: IUserFilterParams = {
		searchTerm: req.query.searchTerm as string | undefined,
		role: req.query.role as string | undefined,
		status: req.query.status as string | undefined,
		departmentId: req.query.departmentId as string | undefined,
		page: req.query.page ? Number(req.query.page) : undefined,
		limit: req.query.limit ? Number(req.query.limit) : undefined,
		sortBy: req.query.sortBy as string | undefined,
		sortOrder: req.query.sortOrder as "asc" | "desc" | undefined,
	};

	const result = await userService.getAllUsers(filters);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Users fetched successfully",
		data: result.data,
		meta: result.meta,
	});
});

const getMe = catchAsync(async (req: Request, res: Response) => {
	const userId = req.user.id;

	const result = await userService.getMe(userId);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "My profile fetched successfully",
		data: result,
	});
});

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
	const userId = req.user.id;

	const result = await userService.updateMyProfile(userId, req.body);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Profile updated successfully",
		data: result,
	});
});

const uploadProfileImage = catchAsync(async (req: Request, res: Response) => {
	if (!req.file) {
		throw new Error(
			"Profile image file is required! Send it as form-data with the key 'profileImage'.",
		);
	}

	const result = await userService.uploadProfileImage(req.user.id, req.file);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Profile image uploaded successfully",
		data: result,
	});
});

const deleteMe = catchAsync(async (req: Request, res: Response) => {
	const userId = req.user.id;

	// Self-delete: actorId defaults to the target user inside the service
	await userService.deleteUser(userId);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Your account has been deleted successfully",
		data: null,
	});
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
	const userId = req.params.id;

	if (!userId) {
		throw new Error("User ID Required!");
	}

	// Admin-initiated delete — audited with the acting admin as the actor
	await userService.deleteUser(userId as string, req.user.id);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "User deleted successfully",
		data: null,
	});
});

export const userController = {
	getAllUsers,
	getMe,
	updateMyProfile,
	uploadProfileImage,
	deleteMe,
	deleteUser,
};
