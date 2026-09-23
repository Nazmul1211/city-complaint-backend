import type { Request } from "express";
import httpStatus from "http-status";
import config from "../config/index.js";
import type { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { UserRole } from "../../../generated/prisma/enums.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { jwtUtils } from "../../utils/jwt.js";
import { AppError } from "../../utils/AppError.js";

declare global {
	namespace Express {
		interface User {
			id: string;
			name: string;
			email: string;
			role: UserRole;
			status: string;
		}

		interface Request {
			user: User;
		}
	}
}

export const auth = (...requiredRoles: string[]) => {
	return catchAsync(async (req: Request, res, next) => {
		const token = req.cookies?.accessToken
			? req.cookies.accessToken
			: req.headers.authorization?.startsWith("Bearer")
				? req.headers.authorization.split(" ")[1]
				: req.headers.authorization;

		if (!token) {
			throw new AppError(
				httpStatus.UNAUTHORIZED,
				"You are not logged in. Please login to access this resource.",
			);
		}

		const verifiedToken = jwtUtils.verifyToken(
			token,
			config.jwt_access_secret as string,
		);

		if (!verifiedToken.success) {
			throw new AppError(httpStatus.UNAUTHORIZED, verifiedToken.error);
		}

		const { userId, role } = verifiedToken.data as JwtPayload;

		if (requiredRoles.length > 0 && !requiredRoles.includes(role as UserRole)) {
			throw new AppError(
				httpStatus.FORBIDDEN,
				"Forbidden. You don't have permission to access this resource.",
			);
		}

		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
		});

		if (!user) {
			throw new AppError(
				httpStatus.UNAUTHORIZED,
				"User not found. Please login again to access this resource.",
			);
		} else if (user.isDeleted || user.status === "DELETED") {
			throw new AppError(
				httpStatus.FORBIDDEN,
				"Your account has been deleted. Please contact support for assistance.",
			);
		} else if (user.status === "PENDING_VERIFICATION") {
			throw new AppError(
				httpStatus.FORBIDDEN,
				"Your account is on verification. Please wait until verification completed.",
			);
		} else if (user.status === "SUSPENDED") {
			throw new AppError(
				httpStatus.FORBIDDEN,
				"Your account is suspended. Please contact support for assistance.",
			);
		}

		req.user = {
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role,
			status: user.status,
		};

		next();
	});
};
