import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import type { ZodType } from "zod";
import { catchAsync } from "../../utils/catchAsync";
import { AppError } from "../../utils/AppError";

type RecordOfUnknown = Record<string, unknown>;

// Envelope-style schemas declare params/query/body as top-level keys,
// flat (legacy) schemas declare request body fields directly.
const isEnvelopeSchema = (schema: ZodType): boolean => {
	const shape = (schema as unknown as { shape?: RecordOfUnknown }).shape;
	if (!shape) return false;
	return "params" in shape || "query" in shape || "body" in shape;
};

export const validateRequest = (zodSchema: ZodType) => {
	return catchAsync(
		async (req: Request, _res: Response, next: NextFunction) => {
			const envelope = isEnvelopeSchema(zodSchema);

			const result = await zodSchema.safeParseAsync(
				envelope
					? {
							params: req.params ?? {},
							query: req.query ?? {},
							body: req.body ?? {},
						}
					: (req.body ?? {}),
			);

			if (!result.success) {
				// One readable line per issue, e.g. "params.id: Invalid request ID"
				const errorMessages = result.error.issues
					.map((issue) => {
						const fieldPath = issue.path.join(".");
						return fieldPath ? `${fieldPath}: ${issue.message}` : issue.message;
					})
					.join("; ");

				throw new AppError(httpStatus.BAD_REQUEST, errorMessages);
			}

			const data = result.data as RecordOfUnknown;

			if (envelope) {
				if (data.params) req.params = data.params as typeof req.params;
				if (data.body) req.body = data.body;
				// req.query is a getter-only property in Express 5, so parsed query
				// values are validated but never written back.
			} else {
				req.body = result.data;
			}

			next();
		},
	);
};
