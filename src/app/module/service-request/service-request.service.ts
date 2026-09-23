import { prisma } from "../../lib/prisma";
import { notificationService } from "../notification/notification.service";
import {
	RequestPriority,
	RequestStatus,
} from "../../../../generated/prisma/enums";
import type {
	ICreateServiceRequest,
	IServiceRequestFilters,
	IServiceRequestResponse,
	ITimelineEvent,
} from "./service-request.interface";

const serviceRequestInclude = {
	citizen: {
		select: { id: true, name: true, email: true, contactNumber: true },
	},
	category: {
		include: {
			department: { select: { id: true, name: true, code: true } },
		},
	},
	currentDepartment: {
		select: { id: true, name: true, code: true },
	},
	reportedLocation: {
		include: {
			ward: { select: { id: true, name: true, code: true, city: true } },
		},
	},
} as const;

const generateRequestNo = async (): Promise<string> => {
	const year = new Date().getFullYear();
	const prefix = `REQ-${year}-`;

	const lastRequest = await prisma.serviceRequest.findFirst({
		where: { requestNo: { startsWith: prefix } },
		orderBy: { requestNo: "desc" },
		select: { requestNo: true },
	});

	const lastSequence = lastRequest
		? parseInt(lastRequest.requestNo.split("-")[2], 10)
		: 0;
	const nextSequence = isNaN(lastSequence) ? 1 : lastSequence + 1;

	return `${prefix}${nextSequence.toString().padStart(5, "0")}`;
};

const calculateDueDates = (
	slaPolicy: {
		responseWithinHours: number;
		resolutionWithinHours: number;
	} | null,
) => {
	if (!slaPolicy) return { responseDueAt: null, resolutionDueAt: null };

	const now = Date.now();
	return {
		responseDueAt: new Date(now + slaPolicy.responseWithinHours * 3_600_000),
		resolutionDueAt: new Date(
			now + slaPolicy.resolutionWithinHours * 3_600_000,
		),
	};
};

const createServiceRequest = async (
	userId: string,
	payload: ICreateServiceRequest,
): Promise<IServiceRequestResponse> => {
	const citizen = await prisma.citizen.findUnique({ where: { userId } });
	if (!citizen)
		throw new Error(
			"Citizen profile not found. Please complete your profile first.",
		);

	const category = await prisma.category.findFirst({
		where: { id: payload.categoryId, isActive: true, deletedAt: null },
		include: { department: true, slaPolicy: true },
	});
	if (!category) throw new Error("Category not found or inactive.");

	const ward = await prisma.ward.findFirst({
		where: { id: payload.wardId, isActive: true },
	});
	if (!ward) throw new Error("Ward not found or inactive.");

	const requestNo = await generateRequestNo();
	const { responseDueAt, resolutionDueAt } = calculateDueDates(
		category.slaPolicy,
	);

	const serviceRequest = await prisma.$transaction(async (tx) => {
		const created = await tx.serviceRequest.create({
			data: {
				requestNo,
				citizenId: citizen.id,
				categoryId: category.id,
				currentDepartmentId: category.departmentId,
				type: payload.type,
				title: payload.title,
				description: payload.description,
				priority: payload.priority ?? RequestPriority.MEDIUM,
				status: RequestStatus.SUBMITTED,
				responseDueAt,
				resolutionDueAt,
			},
			include: serviceRequestInclude,
		});

		await tx.reportedLocation.create({
			data: {
				requestId: created.id,
				wardId: payload.wardId,
				addressLine: payload.addressLine,
				landmark: payload.landmark,
				latitude: payload.latitude ?? null,
				longitude: payload.longitude ?? null,
			},
		});

		await tx.requestDepartmentRoute.create({
			data: {
				requestId: created.id,
				departmentId: category.departmentId,
				routedById: userId,
				reason: "Initial submission",
			},
		});

		return created;
	});

	await notificationService.notifyRequestCreated(serviceRequest, userId);

	return serviceRequest as IServiceRequestResponse;
};

// CITIZEN sees only their own requests; STAFF sees their departments; ADMIN/SUPER_ADMIN see all.
const getAllServiceRequests = async (
	filters: IServiceRequestFilters,
	userId: string,
	userRole: string,
) => {
	const {
		searchTerm,
		status,
		priority,
		categoryId,
		departmentId,
		wardId,
		citizenId,
		page = 1,
		limit = 20,
		sortBy = "createdAt",
		sortOrder = "desc",
	} = filters;

	const pageNumber = Math.max(Number(page) || 1, 1);
	const limitNumber = Math.min(Math.max(Number(limit) || 20, 1), 100);

	const where: Record<string, unknown> = {};

	if (citizenId) {
		where.citizenId = citizenId;
	} else if (userRole === "CITIZEN") {
		const citizen = await prisma.citizen.findUnique({ where: { userId } });
		if (!citizen) throw new Error("Citizen profile not found.");
		where.citizenId = citizen.id;
	} else if (userRole === "STAFF") {
		const memberships = await prisma.departmentMember.findMany({
			where: { userId, isActive: true },
			select: { departmentId: true },
		});
		const deptIds = memberships.map((m) => m.departmentId);
		where.currentDepartmentId =
			deptIds.length > 0 ? { in: deptIds } : "no-access";
	}

	if (searchTerm) {
		where.OR = [
			{ requestNo: { contains: searchTerm, mode: "insensitive" } },
			{ title: { contains: searchTerm, mode: "insensitive" } },
			{ description: { contains: searchTerm, mode: "insensitive" } },
		];
	}
	if (status) where.status = status;
	if (priority) where.priority = priority;
	if (categoryId) where.categoryId = categoryId;
	if (departmentId) where.currentDepartmentId = departmentId;
	if (wardId) where.reportedLocation = { wardId };

	const [data, total] = await prisma.$transaction([
		prisma.serviceRequest.findMany({
			where,
			orderBy: { [sortBy]: sortOrder },
			skip: (pageNumber - 1) * limitNumber,
			take: limitNumber,
			include: serviceRequestInclude,
		}),
		prisma.serviceRequest.count({ where }),
	]);

	return {
		data: data as IServiceRequestResponse[],
		meta: {
			page: pageNumber,
			limit: limitNumber,
			total,
			totalPages: Math.ceil(total / limitNumber),
		},
	};
};

// CITIZEN may only view their own request; STAFF may only view requests in their departments.
const getServiceRequestById = async (
	id: string,
	userId: string,
	userRole: string,
): Promise<IServiceRequestResponse | null> => {
	const serviceRequest = await prisma.serviceRequest.findFirst({
		where: { id },
		include: serviceRequestInclude,
	});

	if (!serviceRequest) return null;

	if (userRole === "CITIZEN") {
		const citizen = await prisma.citizen.findUnique({ where: { userId } });
		if (!citizen || serviceRequest.citizenId !== citizen.id) {
			throw new Error("You don't have permission to view this request.");
		}
	} else if (userRole === "STAFF") {
		const memberships = await prisma.departmentMember.findMany({
			where: { userId, isActive: true },
			select: { departmentId: true },
		});
		const deptIds = memberships.map((m) => m.departmentId);
		if (!deptIds.includes(serviceRequest.currentDepartmentId)) {
			throw new Error("You don't have permission to view this request.");
		}
	}

	return serviceRequest as IServiceRequestResponse;
};

const getMyServiceRequests = async (
	userId: string,
	filters: IServiceRequestFilters,
) => {
	const citizen = await prisma.citizen.findUnique({ where: { userId } });
	if (!citizen) throw new Error("Citizen profile not found.");

	return getAllServiceRequests(
		{ ...filters, citizenId: citizen.id },
		userId,
		"CITIZEN",
	);
};

const getRequestTimeline = async (
	id: string,
	userId: string,
	userRole: string,
): Promise<ITimelineEvent[]> => {
	// Re-use the existing single-request getter — it handles auth checks for us
	const serviceRequest = await getServiceRequestById(id, userId, userRole);
	if (!serviceRequest) throw new Error("Service request not found.");

	// Load routing history
	const routes = await prisma.requestDepartmentRoute.findMany({
		where: { requestId: id },
		orderBy: { routedAt: "asc" },
		include: {
			department: { select: { id: true, name: true, code: true } },
			routedBy: { select: { id: true, name: true, email: true } },
		},
	});

	// Load status history
	const statusHistory = await prisma.requestStatusHistory.findMany({
		where: { requestId: id },
		orderBy: { createdAt: "asc" },
		include: {
			changedBy: { select: { id: true, name: true, email: true } },
		},
	});

	// Load assignments
	const assignments = await prisma.requestAssignment.findMany({
		where: { requestId: id },
		orderBy: { assignedAt: "asc" },
		include: {
			assignee: { select: { id: true, name: true, email: true } },
			assignedBy: { select: { id: true, name: true, email: true } },
		},
	});

	// Build the timeline — start with the original submission event
	const timeline: ITimelineEvent[] = [
		{
			type: "SUBMITTED",
			timestamp: serviceRequest.createdAt,
			note: `Request ${serviceRequest.requestNo} submitted`,
		},
	];

	// Department routing events
	for (const route of routes) {
		timeline.push({
			type: "ROUTED",
			timestamp: route.routedAt,
			note: route.reason ?? `Routed to ${route.department.name}`,
			actor: route.routedBy,
			department: route.department,
		});
	}

	// Status change events
	for (const entry of statusHistory) {
		timeline.push({
			type: "STATUS_CHANGED",
			timestamp: entry.createdAt,
			note:
				entry.note ??
				`Status changed from ${entry.fromStatus ?? "—"} to ${entry.toStatus}`,
			actor: entry.changedBy,
			meta: { fromStatus: entry.fromStatus, toStatus: entry.toStatus },
		});
	}

	// Assignment events
	for (const a of assignments) {
		timeline.push({
			type: "ASSIGNED",
			timestamp: a.assignedAt,
			note: a.note ?? `Assigned to ${a.assignee.name}`,
			actor: a.assignedBy,
			meta: { assigneeId: a.assignee.id, assigneeName: a.assignee.name },
		});

		if (a.releasedAt) {
			timeline.push({
				type: "RELEASED",
				timestamp: a.releasedAt,
				note: `Assignment for ${a.assignee.name} released`,
				actor: a.assignedBy,
				meta: { assigneeId: a.assignee.id, assigneeName: a.assignee.name },
			});
		}
	}

	// Sort by timestamp so the order is always correct regardless of DB insertion order
	return timeline.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
};

export const serviceRequestService = {
	createServiceRequest,
	getAllServiceRequests,
	getServiceRequestById,
	getMyServiceRequests,
	getRequestTimeline,
};
