import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import { Prisma } from "../../../generated/prisma/client";
import config from "../config";

type IssueLike = { path?: Array<string | number | symbol>; message?: string };

interface HandledError extends Error {
	issues?: IssueLike[];
}

const toErrorsArray = (err: HandledError, fallbackMessage: string) => {
	if (Array.isArray(err.issues) && err.issues.length > 0) {
		return err.issues.map((issue) => ({
			path: issue.path?.length ? issue.path.map(String).join(".") : undefined,
			message: issue.message ?? fallbackMessage,
		}));
	}
	return [{ message: fallbackMessage }];
};

export const globalErrorHandler = async (
	err: HandledError,
	_req: Request,
	res: Response,
	_next: NextFunction,
) => {
	if (config.node_env === "development") {
		console.log("Error from Global Error Handler", err);
	}

	let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
	let errorMessage = err.message || "Internal Server Error";
	const errorName = err.name || "Internal Server Error";

	if (err instanceof Prisma.PrismaClientValidationError) {
		statusCode = httpStatus.BAD_REQUEST;
		errorMessage = "You have provided incorrect field type or missing fields";
	} else if (err instanceof Prisma.PrismaClientKnownRequestError) {
		if (err.code === "P2002") {
			statusCode = httpStatus.BAD_REQUEST;
			errorMessage = "Duplicate Key Error";
		} else if (err.code === "P2003") {
			statusCode = httpStatus.BAD_REQUEST;
			errorMessage = "Foreign key constraint failed";
		} else if (err.code === "P2025") {
			statusCode = httpStatus.BAD_REQUEST;
			errorMessage =
				"An operation failed because it depends on one or more records that were required but not found.";
		}
	} else if (err instanceof Prisma.PrismaClientInitializationError) {
		if (err.errorCode === "P1000") {
			statusCode = httpStatus.UNAUTHORIZED;
			errorMessage =
				"Authentication failed against database server. Please Check Your Credentials";
		} else if (err.errorCode === "P1001") {
			statusCode = httpStatus.BAD_REQUEST;
			errorMessage = "Can't reach database server";
		}
	} else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
		statusCode = httpStatus.INTERNAL_SERVER_ERROR;
		errorMessage = "Error occurred during query execution";
	} else if (err instanceof Error) {
		errorMessage = err.message;
	}

	// Structured error envelope:
	// development → real message + detailed errors array
	// production  → generic message + empty errors array
	const isDev = config.node_env === "development";
	const safeMessage = isDev ? errorMessage : "Internal Server Error";

	res.status(statusCode).json({
		success: false,
		statusCode,
		message: safeMessage,
		errors: isDev ? toErrorsArray(err, safeMessage) : [],
		...(isDev && { name: errorName, error: err, stack: err.stack }),
	});
};
