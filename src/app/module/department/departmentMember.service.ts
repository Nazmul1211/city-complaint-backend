import { prisma } from "../../lib/prisma";
import { UserStatus } from "../../../../generated/prisma/enums";
import type {
	IAddDepartmentMember,
	IUpdateDepartmentMember,
} from "./departmentMember.interface";

// The parent department must exist and not be soft deleted before any member
// operation touches it. Reused by every member service function.
const getActiveDepartment = async (departmentId: string) => {
	const department = await prisma.department.findFirst({
		where: {
			id: departmentId,
			deletedAt: null,
		},
	});

	if (!department) {
		throw new Error("Department not found!");
	}

	return department;
};

const addMember = async (departmentId: string, payload: IAddDepartmentMember) => {
	await getActiveDepartment(departmentId);

	const user = await prisma.user.findFirst({
		where: {
			id: payload.userId,
			isDeleted: false,
		},
	});

	if (!user) {
		throw new Error("User not found!");
	}

	if (user.status === UserStatus.DELETED || user.status === UserStatus.BLOCKED) {
		throw new Error(
			`User is ${user.status.toLowerCase()}. Cannot be added to a department!`,
		);
	}

	return prisma.departmentMember.create({
		data: {
			departmentId,
			userId: payload.userId,
			position: payload.position,
		},
		include: {
			user: {
				select: {
					id: true,
					name: true,
					email: true,
					avatarUrl: true,
				},
			},
		},
	});
};

const getMembers = async (departmentId: string) => {
	await getActiveDepartment(departmentId);

	return prisma.departmentMember.findMany({
		where: { departmentId },
		orderBy: { joinedAt: "desc" },
		include: {
			user: {
				select: {
					id: true,
					name: true,
					email: true,
					avatarUrl: true,
					role: true,
					status: true,
				},
			},
		},
	});
};

const updateMember = async (
	departmentId: string,
	memberId: string,
	payload: IUpdateDepartmentMember,
) => {
	await getActiveDepartment(departmentId);

	// Both the department and member ids must line up, so a memberId belonging
	// to another department can never be updated through this endpoint.
	const existingMember = await prisma.departmentMember.findFirst({
		where: {
			id: memberId,
			departmentId,
		},
	});

	if (!existingMember) {
		throw new Error("Department member not found!");
	}

	return prisma.departmentMember.update({
		where: { id: memberId },
		data: payload,
		include: {
			user: {
				select: {
					id: true,
					name: true,
					email: true,
					avatarUrl: true,
				},
			},
		},
	});
};

// Hard delete the membership row: unlike departments, memberships have no
// soft-delete flag, and the user/department records stay untouched.
const removeMember = async (departmentId: string, memberId: string) => {
	await getActiveDepartment(departmentId);

	const existingMember = await prisma.departmentMember.findFirst({
		where: {
			id: memberId,
			departmentId,
		},
	});

	if (!existingMember) {
		throw new Error("Department member not found!");
	}

	await prisma.departmentMember.delete({
		where: { id: memberId },
	});

	return null;
};

export const departmentMemberService = {
	addMember,
	getMembers,
	updateMember,
	removeMember,
};
