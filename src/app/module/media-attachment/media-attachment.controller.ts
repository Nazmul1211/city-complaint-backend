import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { mediaAttachmentService } from "./media-attachment.service";
import { AttachmentPurpose } from "../../../../generated/prisma/enums";

const uploadAttachment = catchAsync(async (req: Request, res: Response) => {
	if (!req.file) {
		throw new Error("File is required. Send it as multipart/form-data with the key 'file'.");
	}

	const purpose = (req.body.purpose as AttachmentPurpose) ?? AttachmentPurpose.OTHER;

	const result = await mediaAttachmentService.uploadAttachment(
		String(req.params.id),
		req.user.id,
		req.user.role,
		req.file,
		purpose,
	);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Attachment uploaded successfully",
		data: result,
	});
});

const getAttachments = catchAsync(async (req: Request, res: Response) => {
	const result = await mediaAttachmentService.getAttachments(
		String(req.params.id),
		req.user.id,
		req.user.role,
		req.query as Record<string, string>,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Attachments fetched successfully",
		data: result.data,
		meta: result.meta,
	});
});

const deleteAttachment = catchAsync(async (req: Request, res: Response) => {
	await mediaAttachmentService.deleteAttachment(
		String(req.params.id),
		String(req.params.attachmentId),
		req.user.id,
		req.user.role,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Attachment deleted successfully",
		data: null,
	});
});

export const mediaAttachmentController = {
	uploadAttachment,
	getAttachments,
	deleteAttachment,
};
