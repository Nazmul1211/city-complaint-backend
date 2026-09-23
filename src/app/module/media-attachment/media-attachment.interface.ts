import type { AttachmentPurpose } from "../../../../generated/prisma/enums";

export interface IAttachmentResponse {
	id: string;
	requestId: string;
	uploadedById: string;
	purpose: AttachmentPurpose;
	publicId: string;
	secureUrl: string;
	mimeType: string;
	sizeBytes: number;
	createdAt: Date;
	uploadedBy: {
		id: string;
		name: string;
		email: string;
	};
}
