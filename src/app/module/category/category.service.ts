import { prisma } from "../../lib/prisma";
import type { ICreateCategory, IUpdateCategory } from "./category.interface";

// Categories are soft deleted (deletedAt flag), so every read/write must
// scope itself to the non-deleted rows to keep deleted data invisible.
const notDeleted = { deletedAt: null };

const createCategory = async (payload: ICreateCategory) => {
	const department = await prisma.department.findFirst({
		where: {
			id: payload.departmentId,
			...notDeleted,
		},
	});

	if (!department) {
		throw new Error("Department not found!");
	}

	return prisma.category.create({
		data: {
			departmentId: payload.departmentId,
			name: payload.name,
			description: payload.description,
			paymentRequired: payload.paymentRequired,
			defaultFeeAmount: payload.defaultFeeAmount,
			currency: payload.currency,
			isActive: payload.isActive,
		},
		include: {
			department: {
				select: {
					id: true,
					name: true,
					code: true,
				},
			},
		},
	});
};

const getAllCategories = async (departmentId?: string) => {
	return prisma.category.findMany({
		where: {
			...notDeleted,
			...(departmentId && { departmentId }),
		},
		orderBy: { createdAt: "desc" },
		include: {
			department: {
				select: {
					id: true,
					name: true,
					code: true,
				},
			},
		},
	});
};

const getCategoryById = async (id: string) => {
	const category = await prisma.category.findFirst({
		where: {
			id,
			...notDeleted,
		},
		include: {
			department: {
				select: {
					id: true,
					name: true,
					code: true,
				},
			},
			slaPolicy: true,
		},
	});

	if (!category) {
		throw new Error("Category not found!");
	}

	return category;
};

const updateCategory = async (id: string, payload: IUpdateCategory) => {
	const category = await prisma.category.findFirst({
		where: {
			id,
			...notDeleted,
		},
	});

	if (!category) {
		throw new Error("Category not found!");
	}

	return prisma.category.update({
		where: { id },
		data: payload,
		include: {
			department: {
				select: {
					id: true,
					name: true,
					code: true,
				},
			},
		},
	});
};


// Soft delete: flag the row instead of removing it, so complaint records that
// reference the category keep their history intact.
const deleteCategory = async (id: string) => {
	const category = await prisma.category.findFirst({
		where: {
			id,
			...notDeleted,
		},
	});

	if (!category) {
		throw new Error("Category not found!");
	}

	await prisma.category.update({
		where: { id },
		data: {
			isActive: false,
			deletedAt: new Date(),
		},
	});

	return null;
};


export const categoryService = {
	createCategory,
	getAllCategories,
	getCategoryById,
	updateCategory,
	deleteCategory,
};
