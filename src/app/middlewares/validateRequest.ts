import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";
import { catchAsync } from "../../utils/catchAsync";

export const validateRequest = (zodSchema: ZodType) => {
	return catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
		const result = await zodSchema.safeParseAsync(req.body ?? {});

		if (!result.success) {
			// One readable line per issue, e.g. "password: Password must contain at least one number"
			const errorMessages = result.error.issues
				.map((issue) => {
					const fieldPath = issue.path.join(".");
					return fieldPath
						? `${fieldPath}: ${issue.message}`
						: issue.message;
				})
				.join("; ");

			throw new Error(errorMessages);
		}

		req.body = result.data;
		next();
	});
};
