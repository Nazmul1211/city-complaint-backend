import type { UploadApiResponse } from "cloudinary";
import { cloudinary } from "../../lib/cloudinary";
import { prisma } from "../../lib/prisma";
import type { AttachmentPurpose } from "../../../../generated/prisma/enums";
import type { IAttachmentResponse } from "./media-attachment.interface";

const attachmentInclude = {
	uploadedBy: { select: { id: true, name: true, email: true } },
} as const;

const uploadToCloudinary = (file: Express.Multer.File, requestId: string): Promise<UploadApiResponse> =>
	new Promise((resolve, reject) => {
		const stream = cloudinary.uploader.upload_stream(
			{ folder: `city-complaint/requests/${requestId}`, resource_type: "auto" },
			(error, result) => {
				if (error) reject(new Error(error.message));
				else if (!result) reject(new Error("Cloudinary upload failed."));
				else resolve(result);
			},
		);
		stream.end(file.buffer);
	});

const uploadAttachment = async (
	requestId: string,
	uploadedById: string,
	userRole: string,
	file: Express.Multer.File,
	purpose: AttachmentPurpose,
): Promise<IAttachmentResponse> => {
	const request = await prisma.serviceRequest.findFirst({ where: { id: requestId } });
	if (!request) throw new Error("Service request not found.");

	if (userRole === "CITIZEN") {
		const citizen = await prisma.citizen.findUnique({ where: { userId: uploadedById } });
		if (!citizen || request.citizenId !== citizen.id) {
			throw new Error("You can only upload attachments for your own requests.");
		}
	}

	if (userRole === "STAFF") {
		const memberships = await prisma.departmentMember.findMany({
			where: { userId: uploadedById, isActive: true },
			select: { departmentId: true },
		});
		const deptIds = memberships.map((m: { departmentId: string }) => m.departmentId);
		if (!deptIds.includes(request.currentDepartmentId)) {
			throw new Error("You can only upload attachments for requests in your department.");
		}
	}

	const uploaded = await uploadToCloudinary(file, requestId);

	const attachment = await prisma.mediaAttachment.create({
		data: {
			requestId,
			uploadedById,
			purpose,
			publicId: uploaded.public_id,
			secureUrl: uploaded.secure_url,
			mimeType: file.mimetype,
			sizeBytes: file.size,
		},
		include: attachmentInclude,
	});

	return attachment as unknown as IAttachmentResponse;
};

const getAttachments = async (
	requestId: string,
	userId: string,
	userRole: string,
	filters: { page?: number; limit?: number },
): Promise<{
	data: IAttachmentResponse[];
	meta: { page: number; limit: number; total: number; totalPages: number };
}> => {
	const request = await prisma.serviceRequest.findFirst({ where: { id: requestId } });
	if (!request) throw new Error("Service request not found.");

	if (userRole === "CITIZEN") {
		const citizen = await prisma.citizen.findUnique({ where: { userId } });
		if (!citizen || request.citizenId !== citizen.id) {
			throw new Error("You don't have permission to view attachments for this request.");
		}
	}

	if (userRole === "STAFF") {
		const memberships = await prisma.departmentMember.findMany({
			where: { userId, isActive: true },
			select: { departmentId: true },
		});
		const deptIds = memberships.map((m: { departmentId: string }) => m.departmentId);
		if (!deptIds.includes(request.currentDepartmentId)) {
			throw new Error("You don't have permission to view attachments for this request.");
		}
	}

	const page = Math.max(Number(filters.page) || 1, 1);
	const limit = Math.min(Math.max(Number(filters.limit) || 20, 1), 100);

	const [data, total] = await prisma.$transaction([
		prisma.mediaAttachment.findMany({
			where: { requestId },
			orderBy: { createdAt: "desc" },
			skip: (page - 1) * limit,
			take: limit,
			include: attachmentInclude,
		}),
		prisma.mediaAttachment.count({ where: { requestId } }),
	]);

	return {
		data: data as unknown as IAttachmentResponse[],
		meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
	};
};

const deleteAttachment = async (
	requestId: string,
	attachmentId: string,
	userId: string,
	userRole: string,
): Promise<void> => {
	const attachment = await prisma.mediaAttachment.findFirst({
		where: { id: attachmentId, requestId },
	});
	if (!attachment) throw new Error("Attachment not found.");

	if (userRole === "CITIZEN") {
		const citizen = await prisma.citizen.findUnique({ where: { userId } });
		if (!citizen || attachment.uploadedById !== userId) {
			throw new Error("You can only delete your own attachments.");
		}
	}

	await cloudinary.uploader.destroy(attachment.publicId, { resource_type: "auto" });
	await prisma.mediaAttachment.delete({ where: { id: attachmentId } });
};

export const mediaAttachmentService = {
	uploadAttachment,
	getAttachments,
	deleteAttachment,
};
