import { RequestStatus } from "../../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { notificationService } from "../notification/notification.service";
import { auditLogService } from "../audit-log/audit-log.service";
import { STATUS_TRANSITIONS, TIMESTAMP_MAP } from "./request-status.constants";
import type {
	IChangeStatusPayload,
	IStatusHistoryFilters,
	IStatusHistoryResponse,
} from "./request-status.interface";

type TxClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

const statusHistoryInclude = {
	changedBy: { select: { id: true, name: true, email: true } },
} as const;

const validateTransition = (from: RequestStatus, to: RequestStatus): void => {
	const allowed = STATUS_TRANSITIONS[from];
	if (!allowed.includes(to)) {
		throw new Error(
			`Invalid status transition: ${from} → ${to}. ` +
				`Allowed transitions from ${from}: [${allowed.join(", ") || "none — this is a terminal status"}]`,
		);
	}
};

const buildTimestampUpdate = (
	toStatus: RequestStatus,
	existing: {
		firstRespondedAt: Date | null;
		resolvedAt: Date | null;
		closedAt: Date | null;
	},
): Partial<{ firstRespondedAt: Date; resolvedAt: Date; closedAt: Date }> => {
	const field = TIMESTAMP_MAP[toStatus];
	if (!field) return {};
	if (existing[field] !== null) return {};
	return { [field]: new Date() };
};

const changeStatus = async (
	requestId: string,
	changedById: string,
	payload: IChangeStatusPayload,
	tx?: TxClient,
): Promise<IStatusHistoryResponse> => {
	const run = async (client: TxClient): Promise<IStatusHistoryResponse> => {
		const request = await client.serviceRequest.findFirst({
			where: { id: requestId },
			select: {
				id: true,
				requestNo: true,
				title: true,
				status: true,
				currentDepartmentId: true,
				citizenId: true,
				firstRespondedAt: true,
				resolvedAt: true,
				closedAt: true,
				citizen: { select: { user: { select: { id: true } } } },
			},
		});

		if (!request) throw new Error("Service request not found.");

		const fromStatus = request.status;
		const { toStatus, note } = payload;

		validateTransition(fromStatus, toStatus);

		const timestampUpdate = buildTimestampUpdate(toStatus, {
			firstRespondedAt: request.firstRespondedAt,
			resolvedAt: request.resolvedAt,
			closedAt: request.closedAt,
		});

		await client.serviceRequest.update({
			where: { id: requestId },
			data: { status: toStatus, ...timestampUpdate },
		});

		const history = await client.requestStatusHistory.create({
			data: {
				requestId,
				changedById,
				fromStatus,
				toStatus,
				note: note ?? null,
			},
			include: statusHistoryInclude,
		});

		await auditLogService.recordAuditLog({
			action: "REQUEST_STATUS_CHANGED",
			entityType: "SERVICE_REQUEST",
			entityId: requestId,
			actorId: changedById,
			oldValues: { status: fromStatus },
			newValues: { status: toStatus, note: note ?? null },
			tx: client,
		});

		const requestSnapshot = {
			id: request.id,
			requestNo: request.requestNo,
			title: request.title,
			status: toStatus,
			currentDepartmentId: request.currentDepartmentId,
			citizenId: request.citizenId,
		};

		const citizenUserId = request.citizen?.user.id ?? null;
		if (citizenUserId && citizenUserId !== changedById) {
			await notificationService.notifyStatusChanged(
				requestSnapshot,
				fromStatus,
				"CITIZEN",
				citizenUserId,
				{ tx: client },
			);
		}

		// When running inside an outer transaction (assignment flows) the
		// assignee is notified by the assignment service, so only the citizen
		// gets a notification here. Direct status changes also fan out to the
		// current department's active staff.
		if (!tx) {
			const members = await client.departmentMember.findMany({
				where: { departmentId: request.currentDepartmentId, isActive: true },
				select: { userId: true },
			});
			for (const member of members) {
				if (member.userId === changedById) continue;
				await notificationService.notifyStatusChanged(
					requestSnapshot,
					fromStatus,
					"STAFF",
					member.userId,
					{ tx: client },
				);
			}
		}

		return history as unknown as IStatusHistoryResponse;
	};

	return tx ? run(tx) : prisma.$transaction(run);
};

const getStatusHistory = async (
	requestId: string,
	userId: string,
	userRole: string,
	filters: IStatusHistoryFilters,
): Promise<{
	data: IStatusHistoryResponse[];
	meta: { page: number; limit: number; total: number; totalPages: number };
}> => {
	const request = await prisma.serviceRequest.findFirst({
		where: { id: requestId },
	});
	if (!request) throw new Error("Service request not found.");

	if (userRole === "CITIZEN") {
		const citizen = await prisma.citizen.findUnique({ where: { userId } });
		if (!citizen || request.citizenId !== citizen.id) {
			throw new Error(
				"You don't have permission to view this request's status history.",
			);
		}
	}

	if (userRole === "STAFF") {
		const memberships = await prisma.departmentMember.findMany({
			where: { userId, isActive: true },
			select: { departmentId: true },
		});
		const deptIds = memberships.map(
			(m: { departmentId: string }) => m.departmentId,
		);
		if (!deptIds.includes(request.currentDepartmentId)) {
			throw new Error(
				"You don't have permission to view this request's status history.",
			);
		}
	}

	const page = Math.max(Number(filters.page) || 1, 1);
	const limit = Math.min(Math.max(Number(filters.limit) || 20, 1), 100);

	const [data, total] = await prisma.$transaction([
		prisma.requestStatusHistory.findMany({
			where: { requestId },
			orderBy: { createdAt: "asc" },
			skip: (page - 1) * limit,
			take: limit,
			include: statusHistoryInclude,
		}),
		prisma.requestStatusHistory.count({ where: { requestId } }),
	]);

	return {
		data: data as unknown as IStatusHistoryResponse[],
		meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
	};
};

export const requestStatusService = {
	changeStatus,
	getStatusHistory,
};
