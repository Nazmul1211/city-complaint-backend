import { NotificationType } from "../../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import type {
	INotificationCreateInput,
	INotificationFilters,
	INotificationPayload,
	INotifyOptions,
	INotificationResponse,
	IMarkAllReadResult,
	IMarkReadResult,
	IRequestSnapshot,
} from "./notification.interface";

type TxClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

const notificationInclude = {
	request: { select: { id: true, requestNo: true, title: true, status: true } },
} as const;

type DbClient = typeof prisma | TxClient;

// Notifications are advisory: a failed insert must never abort the business
// operation that triggered it.
const safeCreate = async (
	input: INotificationCreateInput,
	client: DbClient = prisma,
): Promise<void> => {
	try {
		await client.notification.create({
			data: {
				userId: input.userId,
				requestId: input.requestId,
				type: input.type,
				payload: input.payload,
			},
		});
	} catch (error) {
		console.error("[notification] failed to create notification:", error);
	}
};

const buildRequestPayload = (
	request: IRequestSnapshot,
	extra?: Record<string, string | number | boolean | null>,
): INotificationPayload => ({
	requestId: request.id,
	requestNo: request.requestNo,
	title: request.title,
	status: request.status,
	...(extra ?? {}),
});

const notifyRequestCreated = async (
	request: IRequestSnapshot,
	citizenUserId: string,
	options?: INotifyOptions,
): Promise<void> => {
	await safeCreate(
		{
			userId: citizenUserId,
			requestId: request.id,
			type: NotificationType.REQUEST_CREATED,
			payload: buildRequestPayload(request, {
				message: `Your request ${request.requestNo} has been submitted successfully`,
			}),
		},
		options?.tx,
	);
};

const notifyRequestAssigned = async (
	request: IRequestSnapshot,
	assigneeUserId: string,
	assigneeName: string | null,
	options?: INotifyOptions,
): Promise<void> => {
	await safeCreate(
		{
			userId: assigneeUserId,
			requestId: request.id,
			type: NotificationType.REQUEST_ASSIGNED,
			payload: buildRequestPayload(request, {
				assigneeUserId,
				assigneeName,
				message: `Request ${request.requestNo} has been assigned to ${assigneeName ?? "you"}`,
			}),
		},
		options?.tx,
	);
};

const notifyStatusChanged = async (
	request: IRequestSnapshot,
	fromStatus: string | null,
	recipientRole: "CITIZEN" | "STAFF",
	recipientUserId: string,
	options?: INotifyOptions,
): Promise<void> => {
	await safeCreate(
		{
			userId: recipientUserId,
			requestId: request.id,
			type: NotificationType.STATUS_CHANGED,
			payload: buildRequestPayload(request, {
				fromStatus,
				toStatus: request.status,
				audience: recipientRole,
				message: `Request ${request.requestNo} status changed from ${fromStatus ?? "—"} to ${request.status}`,
			}),
		},
		options?.tx,
	);
};

const notifyPaymentRequired = async (
	request: IRequestSnapshot,
	citizenUserId: string,
	amount: number | string,
	currency: string,
	options?: INotifyOptions,
): Promise<void> => {
	await safeCreate(
		{
			userId: citizenUserId,
			requestId: request.id,
			type: NotificationType.PAYMENT_REQUIRED,
			payload: buildRequestPayload(request, {
				amount,
				currency,
				message: `Payment of ${amount} ${currency} is required for request ${request.requestNo}`,
			}),
		},
		options?.tx,
	);
};

const notifyPaymentSuccessful = async (
	request: IRequestSnapshot,
	citizenUserId: string,
	amount: number | string,
	currency: string,
	options?: INotifyOptions,
): Promise<void> => {
	await safeCreate(
		{
			userId: citizenUserId,
			requestId: request.id,
			type: NotificationType.PAYMENT_SUCCESSFUL,
			payload: buildRequestPayload(request, {
				amount,
				currency,
				message: `Payment of ${amount} ${currency} received for request ${request.requestNo}`,
			}),
		},
		options?.tx,
	);
};

const getMyNotifications = async (
	userId: string,
	filters: INotificationFilters,
): Promise<{
	data: INotificationResponse[];
	meta: { page: number; limit: number; total: number; totalPages: number };
}> => {
	const page = Math.max(Number(filters.page) || 1, 1);
	const limit = Math.min(Math.max(Number(filters.limit) || 20, 1), 100);

	const where: Record<string, unknown> = { userId };
	if (filters.unreadOnly) where.readAt = null;

	const [data, total] = await prisma.$transaction([
		prisma.notification.findMany({
			where,
			orderBy: { createdAt: "desc" },
			skip: (page - 1) * limit,
			take: limit,
			include: notificationInclude,
		}),
		prisma.notification.count({ where }),
	]);

	return {
		data: data as unknown as INotificationResponse[],
		meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
	};
};

const markAsRead = async (
	notificationId: string,
	userId: string,
): Promise<IMarkReadResult> => {
	const notification = await prisma.notification.findFirst({
		where: { id: notificationId, userId },
		select: { id: true, userId: true, readAt: true },
	});
	if (!notification) throw new Error("Notification not found.");
	if (notification.readAt)
		throw new Error("Notification already marked as read.");

	const updated = await prisma.notification.update({
		where: { id: notificationId },
		data: { readAt: new Date() },
		select: { id: true, userId: true, readAt: true },
	});

	return updated as IMarkReadResult;
};

const markAllAsRead = async (userId: string): Promise<IMarkAllReadResult> => {
	const result = await prisma.notification.updateMany({
		where: { userId, readAt: null },
		data: { readAt: new Date() },
	});

	return { count: result.count };
};

export const notificationService = {
	notifyRequestCreated,
	notifyRequestAssigned,
	notifyStatusChanged,
	notifyPaymentRequired,
	notifyPaymentSuccessful,
	getMyNotifications,
	markAsRead,
	markAllAsRead,
};
