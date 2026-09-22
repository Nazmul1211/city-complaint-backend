import { prisma } from "../../lib/prisma";
import { UserStatus, UserRole } from "../../../../generated/prisma/enums";
import type { IUpdateMyProfile, IUserFilterParams } from "./user.interface";
import { cloudinary } from "../../lib/cloudinary";
import type { UploadApiResponse } from "cloudinary";
import type { Prisma } from "../../../../generated/prisma/client";

// Admin user listing with filters: role/status for scoped lists (e.g. staff
// pickers for service-request assignment), departmentId to resolve memberships,
// and a searchTerm across name/email/phone. Always excludes soft-deleted users
// and passwords.
const getAllUsers = async (filters: IUserFilterParams) => {
	const {
		searchTerm,
		role,
		status,
		departmentId,
		page = 1,
		limit = 10,
		sortBy = "createdAt",
		sortOrder = "desc",
	} = filters;

	const whereConditions: Prisma.UserWhereInput = {
		isDeleted: false,
	};

	if (role) {
		whereConditions.role = role.toUpperCase() as UserRole;
	}

	if (status) {
		whereConditions.status = status.toUpperCase() as UserStatus;
	}

	if (searchTerm) {
		whereConditions.OR = [
			{ name: { contains: searchTerm, mode: "insensitive" } },
			{ email: { contains: searchTerm, mode: "insensitive" } },
			{ phone: { contains: searchTerm } },
		];
	}

	if (departmentId) {
		whereConditions.departmentMemberships = {
			some: {
				departmentId,
				isActive: true,
			},
		};
	}

	const pageNumber = Math.max(Number(page) || 1, 1);
	const limitNumber = Math.min(Math.max(Number(limit) || 10, 1), 100);

	const [result, total] = await prisma.$transaction([
		prisma.user.findMany({
			where: whereConditions,
			orderBy: {
				[sortBy]: sortOrder,
			},
			skip: (pageNumber - 1) * limitNumber,
			take: limitNumber,
			include: {
				departmentMemberships: {
					where: { isActive: true },
					select: {
						id: true,
						position: true,
						isActive: true,
						department: {
							select: {
								id: true,
								name: true,
								code: true,
							},
						},
					},
				},
			},
			omit: { password: true },
		}),
		prisma.user.count({ where: whereConditions }),
	]);

	return {
		data: result,
		meta: {
			page: pageNumber,
			limit: limitNumber,
			total,
			totalPages: Math.ceil(total / limitNumber),
		},
	};
};

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
	getAllUsers,
	getMe,
	updateMyProfile,
	uploadProfileImage,
	deleteUser: deleteMe,
};
