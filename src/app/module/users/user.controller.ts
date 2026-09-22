import type { Request } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { userService } from "./user.service";

const deleteUser = catchAsync(async (req: Request<{ id: string }>, res) => {
	const userId = req.params.id;

	await userService.deleteUser(userId);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "User deleted successfully",
		data: null,
	});
});

export const userController = {
	deleteUser,
};
