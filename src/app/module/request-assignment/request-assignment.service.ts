import { prisma } from "../../lib/prisma";
import { UserRole } from "../../../../generated/prisma/enums";
import type { IAssignRequest, IReleaseAssignment, IAssignmentResponse, IAssignmentFilters } from "./request-assignment.interface";
import { requestStatusService } from "../request-status/request-status.service";

const assignmentInclude = {
	assignee: {
		select: {
			id: true,
			name: true,
			email: true,
			phone: true,
			departmentMemberships: {
				where: { isActive: true },
				select: {
					departmentId: true,
					position: true,
					isActive: true,
				},
			},
		},
	},
	assignedBy: {
		select: { id: true, name: true, email: true },
	},
	request: {
		select: {
			id: true,
			requestNo: true,
			title: true,
			status: true,
			currentDepartmentId: true,
		},
	},
} as const;

const assignRequest = async (
	requestId: string,
	userId: string,
	userRole: string,
	payload: IAssignRequest,
): Promise<IAssignmentResponse> => {
	const request = await prisma.serviceRequest.findFirst({
		where: { id: requestId },
	});
	if (!request) throw new Error("Service request not found.");

	if (userRole === "STAFF") {
		const memberships = await prisma.departmentMember.findMany({
			where: { userId, isActive: true },
			select: { departmentId: true },
		});
		const deptIds = memberships.map((m: { departmentId: string }) => m.departmentId);
		if (!deptIds.includes(request.currentDepartmentId)) {
			throw new Error("You can only assign requests that belong to your department.");
		}
	}

	const assignee = await prisma.user.findFirst({
		where: {
			id: payload.assigneeId,
			role: UserRole.STAFF,
			isDeleted: false,
		},
		include: {
			departmentMemberships: {
				where: { isActive: true },
				select: { departmentId: true, position: true, isActive: true },
			},
		},
	});
	if (!assignee) throw new Error("Assignee not found or not a staff member.");

	const isMemberOfDept = assignee.departmentMemberships.some(
		(m: { departmentId: string; isActive: boolean }) => m.departmentId === request.currentDepartmentId && m.isActive,
	);
	if (!isMemberOfDept) {
		throw new Error("Assignee must be an active member of the request's current department.");
	}

	const existingActive = await prisma.requestAssignment.findFirst({
		where: { requestId, releasedAt: null },
	});
	if (existingActive) {
		throw new Error("Request already has an active assignment. Release it first.");
	}

	const assignment = await prisma.$transaction(async (tx) => {
		const created = await tx.requestAssignment.create({
			data: {
				requestId,
				assigneeId: payload.assigneeId,
				assignedById: userId,
				note: payload.note ?? null,
			},
			include: assignmentInclude,
		});

		// Delegate status transition to the centralized service (runs inside this tx)
		await requestStatusService.changeStatus(
			requestId,
			userId,
			{ toStatus: "ASSIGNED", note: `Assigned to staff member` },
			tx,
		);

		return created;
	});

	return assignment as unknown as IAssignmentResponse;
};

const getAssignments = async (
	requestId: string,
	filters: IAssignmentFilters,
): Promise<{ data: IAssignmentResponse[]; meta: { page: number; limit: number; total: number; totalPages: number } }> => {
	const request = await prisma.serviceRequest.findFirst({ where: { id: requestId } });
	if (!request) throw new Error("Service request not found.");

	const page = Math.max(Number(filters.page) || 1, 1);
	const limit = Math.min(Math.max(Number(filters.limit) || 20, 1), 100);
	const sortBy = filters.sortBy ?? "assignedAt";
	const sortOrder = filters.sortOrder ?? "desc";

	const [data, total] = await prisma.$transaction([
		prisma.requestAssignment.findMany({
			where: { requestId },
			orderBy: { [sortBy]: sortOrder },
			skip: (page - 1) * limit,
			take: limit,
			include: assignmentInclude,
		}),
		prisma.requestAssignment.count({ where: { requestId } }),
	]);

	return {
		data: data as unknown as IAssignmentResponse[],
		meta: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
		},
	};
};

const releaseAssignment = async (
	requestId: string,
	assignmentId: string,
	userId: string,
	userRole: string,
	payload: IReleaseAssignment,
): Promise<IAssignmentResponse> => {
	const request = await prisma.serviceRequest.findFirst({ where: { id: requestId } });
	if (!request) throw new Error("Service request not found.");

	if (userRole === "STAFF") {
		const memberships = await prisma.departmentMember.findMany({
			where: { userId, isActive: true },
			select: { departmentId: true },
		});
		const deptIds = memberships.map((m: { departmentId: string }) => m.departmentId);
		if (!deptIds.includes(request.currentDepartmentId)) {
			throw new Error("You can only release assignments for requests in your department.");
		}
	}

	const assignment = await prisma.requestAssignment.findFirst({
		where: { id: assignmentId, requestId },
	});
	if (!assignment) throw new Error("Assignment not found.");
	if (assignment.releasedAt) throw new Error("Assignment already released.");

	const updated = await prisma.$transaction(async (tx) => {
		const released = await tx.requestAssignment.update({
			where: { id: assignmentId },
			data: {
				releasedAt: new Date(),
				note: payload.note ? `${assignment.note ? assignment.note + " | " : ""}${payload.note}` : assignment.note,
			},
			include: assignmentInclude,
		});

		const activeCount = await tx.requestAssignment.count({
			where: { requestId, releasedAt: null },
		});

		// When no active assignments remain, revert status to UNDER_REVIEW via the centralized service
		if (activeCount === 0) {
			await requestStatusService.changeStatus(
				requestId,
				userId,
				{ toStatus: "UNDER_REVIEW", note: "Assignment released — returned to review queue" },
				tx,
			);
		}

		return released;
	});

	return updated as unknown as IAssignmentResponse;
};

export const requestAssignmentService = {
	assignRequest,
	getAssignments,
	releaseAssignment,
};