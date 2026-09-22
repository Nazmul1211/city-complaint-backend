import type { ParamsDictionary, Query } from "express-serve-static-core";
import type { NextFunction, Request, RequestHandler, Response } from "express";

export const catchAsync = <
	P = ParamsDictionary,
	ResBody = any,
	ReqBody = any,
	ReqQuery = Query,
	LocalsObj extends Record<string, any> = Record<string, any>,
>(
	fn: RequestHandler<P, ResBody, ReqBody, ReqQuery, LocalsObj>,
) => {
	return async (
		req: Request<P, ResBody, ReqBody, ReqQuery, LocalsObj>,
		res: Response<ResBody, LocalsObj>,
		next: NextFunction,
	) => {
		try {
			await fn(req, res, next);
		} catch (error) {
			// console.log(error);

			// res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
			//     success: false,
			//     statusCode: httpStatus.INTERNAL_SERVER_ERROR,
			//     message: "Failed to register user",
			//     error: (error as Error).message
			// })

			next(error);
		}
	};
};

