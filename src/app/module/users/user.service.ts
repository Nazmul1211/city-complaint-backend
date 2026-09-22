import { prisma } from "../../lib/prisma";
import { UserStatus } from "../../../../generated/prisma/enums";
import type { IUpdateMyProfile } from "./user.interface";
import { cloudinary } from "../../lib/cloudinary";
import type { UploadApiResponse } from "cloudinary";

const getMe = async (userId: string) => {
	const user = await prisma.user.findUnique({
		where: {
			id: userId,
		},
		include: {
			citizen: true,
		},
		omit: { password: true },
	});

	if (!user) {
		throw new Error("User not found!");
	}

	return user;
};

const updateMyProfile = async (userId: string, payload: IUpdateMyProfile) => {
	const user = await prisma.user.findUnique({
		where: {
			id: userId,
		},
	});

	if (!user) {
		throw new Error("User not found!");
	}

	if (user.isDeleted || user.status === UserStatus.DELETED) {
		throw new Error("User is deleted!");
	}

	if (user.status === UserStatus.BLOCKED) {
		throw new Error("User is Blocked!");
	}

	const { citizen: citizenData, ...userData } = payload;

	const updatedUser = await prisma.user.update({
		where: {
			id: userId,
		},
		data: {
			...userData,
			...(citizenData && {
				citizen: {
					update: {
						contactNumber: citizenData.contactNumber,
						address: citizenData.address,
					},
				},
			}),
		},
		include: {
			citizen: true,
		},
		omit: { password: true },
	});

	return updatedUser;
};

const uploadProfileImage = async (
	userId: string,
	file: Express.Multer.File,
) => {
	const user = await prisma.user.findUnique({
		where: {
			id: userId,
		},
	});

	if (!user) {
		throw new Error("User not found!");
	}

	if (user.isDeleted || user.status === UserStatus.DELETED) {
		throw new Error("User is deleted!");
	}

	if (user.status === UserStatus.BLOCKED) {
		throw new Error("User is Blocked!");
	}

	// Delete the old image from Cloudinary before uploading a new one,
	// so orphaned files don't pile up in the Cloudinary account.
	if (user.avatarPublicId) {
		await cloudinary.uploader.destroy(user.avatarPublicId);
	}

	// Wrap the upload_stream callback API into a promise so errors and
	// completion propagate properly to the caller.
	const result = await new Promise<UploadApiResponse>((resolve, reject) => {
		const stream = cloudinary.uploader.upload_stream(
			{
				folder: "city-complaint/profile-images",
				resource_type: "image",
			},
			(error, uploadResult) => {
				if (error) {
					reject(new Error(error.message));
				} else if (!uploadResult) {
					reject(new Error("Cloudinary upload failed!"));
				} else {
					resolve(uploadResult);
				}
			},
		);

		stream.end(file.buffer);
	});

	const updatedUser = await prisma.user.update({
		where: {
			id: userId,
		},
		data: {
			avatarUrl: result.secure_url,
			avatarPublicId: result.public_id,
		},
		include: {
			citizen: true,
		},
		omit: { password: true },
	});

	return updatedUser;
};

const deleteMe = async (userId: string) => {
	const user = await prisma.user.findUnique({
		where: {
			id: userId,
		},
	});

	if (!user) {
		throw new Error("User not found!");
	}

	if (user.isDeleted || user.status === UserStatus.DELETED) {
		throw new Error("User is already deleted!");
	}

	// Self soft delete: same flagging logic as the admin-initiated delete,
	// so the account is deactivated while related records stay intact.
	const deletedUser = await prisma.user.update({
		where: {
			id: userId,
		},
		data: {
			isDeleted: true,
			deletedAt: new Date(),
			status: UserStatus.DELETED,
		},
		omit: { password: true },
	});

	return deletedUser;
};

export const userService = {
	getMe,
	updateMyProfile,
	uploadProfileImage,
	deleteUser: deleteMe,
};
