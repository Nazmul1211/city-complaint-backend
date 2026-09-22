import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { userService } from "./user.service";

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
	// TODO: implement profile image upload (needs multer + cloudinary —
	// the User model already has avatarUrl and avatarPublicId fields)
	throw new Error("Profile image upload is not implemented yet");
});

const deleteMe = catchAsync(async (req: Request, res: Response) => {
	const userId = req.user.id;

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

	if(!userId){
		throw new Error("User ID Required!");
	}

	await userService.deleteUser(userId as string);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "User deleted successfully",
		data: null,
	});
});

export const userController = {
	getMe,
	updateMyProfile,
	uploadProfileImage,
	deleteMe,
	deleteUser,
};
