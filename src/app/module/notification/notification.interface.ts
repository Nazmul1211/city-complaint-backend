import type {
	NotificationType,
	RequestStatus,
} from "../../../../generated/prisma/enums";
import type { Prisma } from "../../../../generated/prisma/client";

export type INotificationPayload = Prisma.InputJsonValue;

export interface INotificationResponse {
	id: string;
	userId: string;
	requestId: string;
	type: NotificationType;
	payload: Prisma.JsonValue;
	readAt: Date | null;
	createdAt: Date;
}

export interface INotificationFilters {
	unreadOnly?: boolean;
	page?: number;
	limit?: number;
}

export interface IMarkReadResult {
	id: string;
	userId: string;
	readAt: Date;
}

export interface IMarkAllReadResult {
	count: number;
}

export interface INotifyOptions {
	tx?: Parameters<
		Parameters<typeof import("../../lib/prisma").prisma.$transaction>[0]
	>[0];
}

export interface IRequestSnapshot {
	id: string;
	requestNo: string;
	title: string;
	status: RequestStatus;
	currentDepartmentId: string;
	citizenId: string;
}

export interface INotificationCreateInput {
	userId: string;
	requestId: string;
	type: NotificationType;
	payload: INotificationPayload;
}
