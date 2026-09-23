import { prisma } from "../../lib/prisma";
import type { ICreateWorkUpdate, IWorkUpdateFilters, IWorkUpdateResponse } from "./work-update.interface";

const workUpdateInclude = {
	author: { select: { id: true, name: true, email: true } },
} as const;

const createWorkUpdate = async (
	requestId: string,
	authorId: string,
	userRole: string,
	payload: ICreateWorkUpdate,
): Promise<IWorkUpdateResponse> => {
	const request = await prisma.serviceRequest.findFirst({ where: { id: requestId } });
	if (!request) throw new Error("Service request not found.");

	if (userRole === "STAFF") {
		const memberships = await prisma.departmentMember.findMany({
			where: { userId: authorId, isActive: true },
			select: { departmentId: true },
		});
		const deptIds = memberships.map((m: { departmentId: string }) => m.departmentId);
		if (!deptIds.includes(request.currentDepartmentId)) {
			throw new Error("You can only add updates to requests in your department.");
		}
	}

	const update = await prisma.workUpdate.create({
		data: {
			requestId,
			authorId,
			note: payload.note,
			visibleToCitizen: payload.visibleToCitizen ?? false,
		},
		include: workUpdateInclude,
	});

	return update as unknown as IWorkUpdateResponse;
};

const getWorkUpdates = async (
	requestId: string,
	userId: string,
	userRole: string,
	filters: IWorkUpdateFilters,
): Promise<{
	data: IWorkUpdateResponse[];
	meta: { page: number; limit: number; total: number; totalPages: number };
}> => {
	const request = await prisma.serviceRequest.findFirst({ where: { id: requestId } });
	if (!request) throw new Error("Service request not found.");

	const page = Math.max(Number(filters.page) || 1, 1);
	const limit = Math.min(Math.max(Number(filters.limit) || 20, 1), 100);

	const where: Record<string, unknown> = { requestId };

	if (userRole === "CITIZEN") {
		const citizen = await prisma.citizen.findUnique({ where: { userId } });
		if (!citizen || request.citizenId !== citizen.id) {
			throw new Error("You don't have permission to view updates for this request.");
		}
		where.visibleToCitizen = true;
	}

	if (userRole === "STAFF") {
		const memberships = await prisma.departmentMember.findMany({
			where: { userId, isActive: true },
			select: { departmentId: true },
		});
		const deptIds = memberships.map((m: { departmentId: string }) => m.departmentId);
		if (!deptIds.includes(request.currentDepartmentId)) {
			throw new Error("You don't have permission to view updates for this request.");
		}
	}

	const [data, total] = await prisma.$transaction([
		prisma.workUpdate.findMany({
			where,
			orderBy: { createdAt: "desc" },
			skip: (page - 1) * limit,
			take: limit,
			include: workUpdateInclude,
		}),
		prisma.workUpdate.count({ where }),
	]);

	return {
		data: data as unknown as IWorkUpdateResponse[],
		meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
	};
};

export const workUpdateService = {
	createWorkUpdate,
	getWorkUpdates,
};
