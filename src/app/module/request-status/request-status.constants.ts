import { RequestStatus } from "../../../../generated/prisma/enums";

export const STATUS_TRANSITIONS: Record<RequestStatus, RequestStatus[]> = {
	[RequestStatus.SUBMITTED]: [
		RequestStatus.UNDER_REVIEW,
		RequestStatus.ASSIGNED,
		RequestStatus.REJECTED,
	],

	[RequestStatus.UNDER_REVIEW]: [
		RequestStatus.ASSIGNED,
		RequestStatus.PENDING,
		RequestStatus.REJECTED,
	],

	[RequestStatus.ASSIGNED]: [
		RequestStatus.IN_PROGRESS,
		RequestStatus.UNDER_REVIEW,
	],

	[RequestStatus.IN_PROGRESS]: [
		RequestStatus.RESOLVED,
		RequestStatus.PENDING,
		RequestStatus.UNDER_REVIEW,
	],

	[RequestStatus.PENDING]: [
		RequestStatus.IN_PROGRESS,
		RequestStatus.UNDER_REVIEW,
		RequestStatus.REJECTED,
	],

	[RequestStatus.RESOLVED]: [
		RequestStatus.CLOSED,
		RequestStatus.REOPENED,
	],

	[RequestStatus.REOPENED]: [
		RequestStatus.UNDER_REVIEW,
		RequestStatus.ASSIGNED,
		RequestStatus.IN_PROGRESS,
	],

	[RequestStatus.CLOSED]: [RequestStatus.REOPENED],

	[RequestStatus.REJECTED]: [],
};

export const TIMESTAMP_MAP: Partial<Record<RequestStatus, keyof TimestampFields>> = {
	[RequestStatus.UNDER_REVIEW]: "firstRespondedAt",
	[RequestStatus.ASSIGNED]: "firstRespondedAt",
	[RequestStatus.RESOLVED]: "resolvedAt",
	[RequestStatus.CLOSED]: "closedAt",
};

export interface TimestampFields {
	firstRespondedAt: Date | null;
	resolvedAt: Date | null;
	closedAt: Date | null;
}
