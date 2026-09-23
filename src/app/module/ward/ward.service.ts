import { prisma } from "../../lib/prisma";
import type {
	ICreateWard,
	IUpdateWard,
	IWardFilterParams,
} from "./ward.interface";
import { auditLogService } from "../audit-log/audit-log.service";

const getAllWards = async (filters: IWardFilterParams = {}) => {
	const { city, isActive } = filters;

	return prisma.ward.findMany({
		where: {
			...(city && { city: { equals: city, mode: "insensitive" } }),
			...(isActive !== undefined && { isActive }),
		},
		orderBy: [{ city: "asc" }, { name: "asc" }],
	});
};

const getWardById = async (id: string) => {
	const ward = await prisma.ward.findUnique({
		where: { id },
	});

	if (!ward) {
		throw new Error("Ward not found!");
	}

	return ward;
};

const createWard = async (payload: ICreateWard) => {
	return prisma.ward.create({
		data: payload,
	});
};

const updateWard = async (id: string, payload: IUpdateWard) => {
	const ward = await prisma.ward.findUnique({
		where: { id },
	});

	if (!ward) {
		throw new Error("Ward not found!");
	}

	return prisma.ward.update({
		where: { id },
		data: payload,
	});
};


const deleteWard = async (id: string, actorId?: string) => {
	const ward = await prisma.ward.findUnique({
		where: { id },
	});

	if (!ward) {
		throw new Error("Ward not found!");
	}

	await prisma.ward.delete({
		where: { id },
	});

	await auditLogService.recordAuditLog({
		action: "WARD_DELETED",
		entityType: "WARD",
		entityId: ward.id,
		actorId: actorId ?? null,
		oldValues: { name: ward.name, city: ward.city },
		newValues: null,
	});

	return null;
};

export const wardService = {
	getAllWards,
	getWardById,
	createWard,
	updateWard,
	deleteWard,
};
