import { prisma } from "../../lib/prisma";
import { UserStatus } from "../../../../generated/prisma/enums";

const deleteUser = async (userId: string) => {
	const user = await prisma.user.findUnique({
		where: { id: userId },
	});

	if (!user) {
		throw new Error("User does not exist!");
	}

	if (user.isDeleted || user.status === UserStatus.DELETED) {
		throw new Error("User is already deleted!");
	}

	if (user.status === UserStatus.BLOCKED) {
		throw new Error("User is Blocked!");
	}

	// Soft delete: flag the user instead of hard-deleting, preserving data
	// integrity for complaints and other related records.
	const deletedUser = await prisma.user.update({
		where: { id: userId },
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
	deleteUser,
};
