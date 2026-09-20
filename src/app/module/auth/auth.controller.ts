import { Request, Response } from "express";
import { sendResponse } from "../../../utils/sendResponse";
import httpStatus from "http-status";
import { authService } from "./auth.service";

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

const loginUser = async() => {

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
