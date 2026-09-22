import { NextFunction, Request, Response } from "express";
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

const logoutUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await authService.logoutUser();

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User logged out successfully",
      data: result,
    });
  },
);

const refreshToken = catchAsync(async (req: Request, res: Response) => {
	if (!req.cookies.refreshToken) {
		throw new Error("Refresh token is missing");
	}

	console.log(req.cookies.refreshToken);
	const result = await authService.refreshToken(req.cookies.refreshToken);
	const { accessToken, refreshToken: newRefreshToken } = result;

	res.cookie("accessToken", accessToken, {
		httpOnly: true,
		secure: false,
		sameSite: "none",
		maxAge: 1000 * 60 * 60 * 24, // 24 hour or 1 day
	});
	res.cookie("refreshToken", newRefreshToken, {
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
			refreshToken: newRefreshToken,
		},
	});
});


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


const forgotPassword = catchAsync(async (req: Request, res: Response) => {
	const payload = req.body;

	await authService.forgotPassword(payload);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: `OTP sent to email : ${payload.email}`,
		data: null,
	});
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
	const payload = req.body;

	await authService.resetPassword(payload);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Password Changed successfully",
		data: null,
	});
});


export const authController = {
    registerCitizen,
	verifyCitizenEmail,
	loginUser,
	logoutUser,
	refreshToken,
	googleLogin,
    githubLogin,
	forgotPassword,
	resetPassword,
}
