import { prisma } from "../../lib/prisma";
import type { ICreateSlaPolicy, IUpdateSlaPolicy } from "./slaPolicy.interface";

/**
 * SLA policies are category-centric: Category 1 ─── 0..1 SlaPolicy.
 * Every operation resolves the category from the URL param and never
 * trusts a categoryId from the request body.
 */

const categoryScoped = (categoryId: string) => ({
	id: categoryId,
	deletedAt: null, // categories are soft deleted — never expose SLAs of deleted ones
});



//  GET /categories/:categoryId/sla
const getSlaByCategory = async (categoryId: string) => {
	const category = await prisma.category.findFirst({
		where: categoryScoped(categoryId),
		select: { id: true },
	});

	if (!category) {
		throw new Error("Category not found!");
	}

	return prisma.slaPolicy.findUnique({
		where: { categoryId },
	});
};



//  POST /categories/:categoryId/sla
const createSlaForCategory = async (
	categoryId: string,
	payload: ICreateSlaPolicy,
) => {
	const category = await prisma.category.findFirst({
		where: categoryScoped(categoryId),
		select: { id: true },
	});

	if (!category) {
		throw new Error("Category not found!");
	}

	const existing = await prisma.slaPolicy.findUnique({
		where: { categoryId },
		select: { id: true },
	});

	if (existing) {
		throw new Error("SLA policy already exists for this category");
	}

	return prisma.slaPolicy.create({
		data: {
			categoryId,
			responseWithinHours: payload.responseWithinHours,
			resolutionWithinHours: payload.resolutionWithinHours,
			reopenWindowHours: payload.reopenWindowHours,
			isActive: payload.isActive,
		},
	});
};



// PATCH /categories/:categoryId/sla
const updateSlaForCategory = async (
	categoryId: string,
	payload: IUpdateSlaPolicy,
) => {
	const category = await prisma.category.findFirst({
		where: categoryScoped(categoryId),
		select: { id: true },
	});

	if (!category) {
		throw new Error("Category not found!");
	}

	const existing = await prisma.slaPolicy.findUnique({
		where: { categoryId },
	});

	// No SLA yet? Create it — but then nothing may be missing.
	if (!existing) {
		if (
			payload.responseWithinHours === undefined ||
			payload.resolutionWithinHours === undefined ||
			payload.reopenWindowHours === undefined
		) {
			throw new Error(
				"No SLA exists for this category yet — responseWithinHours, resolutionWithinHours and reopenWindowHours are all required to create one",
			);
		}

		return prisma.slaPolicy.create({
			data: {
				categoryId,
				responseWithinHours: payload.responseWithinHours,
				resolutionWithinHours: payload.resolutionWithinHours,
				reopenWindowHours: payload.reopenWindowHours,
				isActive: payload.isActive,
			},
		});
	}

	// SLA exists — apply only the fields that were actually sent.
	return prisma.slaPolicy.update({
		where: { categoryId },
		data: {
			...(payload.responseWithinHours !== undefined && {
				responseWithinHours: payload.responseWithinHours,
			}),
			...(payload.resolutionWithinHours !== undefined && {
				resolutionWithinHours: payload.resolutionWithinHours,
			}),
			...(payload.reopenWindowHours !== undefined && {
				reopenWindowHours: payload.reopenWindowHours,
			}),
			...(payload.isActive !== undefined && { isActive: payload.isActive }),
		},
	});
};

export const slaPolicyService = {
	getSlaByCategory,
	createSlaForCategory,
	updateSlaForCategory,
};
