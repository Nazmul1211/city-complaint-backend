import type { RequestStatus } from "../../../../generated/prisma/enums";

export interface IChangeStatusPayload {
	toStatus: RequestStatus;
	note?: string;
}

export interface IStatusHistoryResponse {
	id: string;
	requestId: string;
	changedById: string;
	fromStatus: RequestStatus | null;
	toStatus: RequestStatus;
	note: string | null;
	createdAt: Date;
	changedBy: {
		id: string;
		name: string;
		email: string;
	};
}

export interface IStatusHistoryFilters {
	page?: number;
	limit?: number;
}
