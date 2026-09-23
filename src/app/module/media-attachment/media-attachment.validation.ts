import { z } from "zod";
import { AttachmentPurpose } from "../../../../generated/prisma/enums";

const uploadAttachmentSchema = z.object({
	params: z.object({
		id: z.string().uuid("Invalid request ID"),
	}),
	body: z.object({
		purpose: z.nativeEnum(AttachmentPurpose).default(AttachmentPurpose.OTHER),
	}),
});

const listAttachmentsSchema = z.object({
	params: z.object({
		id: z.string().uuid("Invalid request ID"),
	}),
	query: z.object({
		page: z.coerce.number().int().positive().default(1),
		limit: z.coerce.number().int().positive().max(100).default(20),
	}),
});

const deleteAttachmentSchema = z.object({
	params: z.object({
		id: z.string().uuid("Invalid request ID"),
		attachmentId: z.string().uuid("Invalid attachment ID"),
	}),
});

export const mediaAttachmentValidation = {
	uploadAttachmentSchema,
	listAttachmentsSchema,
	deleteAttachmentSchema,
};
