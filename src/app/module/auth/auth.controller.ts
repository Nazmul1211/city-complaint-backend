import { Request, Response } from "express";
import { sendResponse } from "../../../utils/sendResponse";
import httpStatus from "http-status";
import { authService } from "./auth.service";
import { PassThrough } from "stream";
import { catchAsync } from "../../../utils/catchAsync";

const registerCitizen = catchAsync(
	async (req: Request, res: Response) => {
    console.log("User register api hits!");

    const payload = req.body;
    await authService.registerCitizen(payload);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Verification OTP Sent",
		data: null,
	});
}
)

const verifyCitizenEmail = catchAsync(
	async(req: Request, res: Response) => {

			const payload = req.body;

	const result =  await authService.verifyCitizenEmail(payload);

	const { accessToken, refreshToken, user, citizen } = result;

	res.cookie("accessToken", accessToken, {
		httpOnly: true,
		secure: false,
		sameSite: "none",
		maxAge: 1000 * 60 * 60 * 24, // 24 hour or 1 day
	});
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		secure: false,
		sameSite: "none",
		maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
	});

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Verification OTP sent",
		data: {
			accessToken,
			refreshToken,
			user,
			citizen
		},
	});
}
)

const loginUser = catchAsync(
	async(req: Request, res: Response) => {

    const payload = req.body;

    const result = await authService.loginUser(payload);

     const { accessToken, refreshToken } = result;

	res.cookie("accessToken", accessToken, {
		httpOnly: true,
		secure: false,
		sameSite: "none",
		maxAge: 1000 * 60 * 60 * 24, // 24 hour or 1 day
	});
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		secure: false,
		sameSite: "none",
		maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
	});


    sendResponse(res, {
        statusCode: httpStatus.OK,
		success: true,
		message: "Verification OTP Sent",
		data: {
			accessToken,
			refreshToken
		},
    })
}
)

const deleteUser = async() => {

}


const refreshToken = async() => {

}


const googleLogin = catchAsync (
	async (req: Request, res: Response) => {
	const payload = req.body;

	const result = await authService.googleLogin(payload);
	const { accessToken, refreshToken } = result;

	res.cookie("accessToken", accessToken, {
		httpOnly: true,
		secure: false,
		sameSite: "none",
		maxAge: 1000 * 60 * 60 * 24, // 24 hour or 1 day
	});
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		secure: false,
		sameSite: "none",
		maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
	});

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "New tokens generated successfully",
		data: {
			accessToken,
			refreshToken,
		},
	});
}
);

const githubLogin = async() => {
    
}


const forgotPassword = async() => {
    
}

const resetPassword = async() => {
    
}


export const authController = {
    registerCitizen,
	verifyCitizenEmail,
	loginUser,
    deleteUser,
	refreshToken,
	googleLogin,
    githubLogin,
	forgotPassword,
	resetPassword,
}
