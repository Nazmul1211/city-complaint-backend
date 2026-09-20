import { Request, Response } from "express";
import { sendResponse } from "../../../utils/sendResponse";
import httpStatus from "http-status";
import { authService } from "./auth.service";
import { PassThrough } from "stream";

const registerCitizen = async (req: Request, res: Response) => {
    console.log("User register api hits!");

    const payload = req.body;
    const result = await authService.registerCitizen(payload);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Verification OTP Sent",
		data: result,
	});
}

const verifyCitizenEmail = async() => {

}

const loginUser = async(req: Request, res: Response) => {

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

const deleteUser = async() => {

}


const refreshToken = async() => {

}


const googleLogin = async() => {
    
}

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
