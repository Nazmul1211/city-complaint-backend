import { prisma } from "../../lib/prisma";
import type {
	ICreateDepartment,
	IUpdateDepartment,
} from "./department.interface";

// Departments are soft deleted (deletedAt flag), so every read/write must
// scope itself to the non-deleted rows to keep deleted data invisible.
const notDeleted = { deletedAt: null };

const createDepartment = async (payload: ICreateDepartment) => {
	return prisma.department.create({
		data: payload,
	});
};

const getAllDepartments = async () => {
	return prisma.department.findMany({
		where: notDeleted,
		orderBy: { createdAt: "desc" },
		include: {
			_count: {
				select: { members: true },
			},
		},
	});
};

const getDepartmentById = async (id: string) => {
	const department = await prisma.department.findFirst({
		where: {
			id,
			...notDeleted,
		},
		include: {
			members: {
				where: { isActive: true },
				select: {
					id: true,
					position: true,
					isActive: true,
					joinedAt: true,
					user: {
						select: {
							id: true,
							name: true,
							email: true,
							avatarUrl: true,
						},
					},
				},
			},
			_count: {
				select: { members: true },
			},
		},
	});

	if (!department) {
		throw new Error("Department not found!");
	}

	return department;
};

const updateDepartment = async (id: string, payload: IUpdateDepartment) => {
	const department = await prisma.department.findFirst({
		where: {
			id,
			...notDeleted,
		},
	});

	if (!department) {
		throw new Error("Department not found!");
	}

	return prisma.department.update({
		where: { id },
		data: payload,
	});
};

// Soft delete: flag the row instead of removing it, so complaint records that
// reference the department keep their history intact.
const deleteDepartment = async (id: string) => {
	const department = await prisma.department.findFirst({
		where: {
			id,
			...notDeleted,
		},
	});

	if (!department) {
		throw new Error("Department not found!");
	}

	await prisma.department.update({
		where: { id },
		data: {
			isActive: false,
			deletedAt: new Date(),
		},
	});

	return null;
};

export const departmentService = {
	createDepartment,
	getAllDepartments,
	getDepartmentById,
	updateDepartment,
	deleteDepartment,
};
