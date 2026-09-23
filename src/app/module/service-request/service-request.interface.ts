import type { RequestType, RequestPriority, RequestStatus } from "../../../../generated/prisma/enums";

export interface ICreateServiceRequest {
	categoryId: string;
	title: string;
	description: string;
	type: RequestType;
	priority?: RequestPriority;
	wardId: string;
	addressLine: string;
	landmark?: string;
	latitude?: number;
	longitude?: number;
}

export interface IUpdateServiceRequest {
	title?: string;
	description?: string;
	type?: RequestType;
	priority?: RequestPriority;
	status?: RequestStatus;
	wardId?: string;
	addressLine?: string;
	landmark?: string;
	latitude?: number;
	longitude?: number;
}

export interface ITimelineEvent {
	type: "SUBMITTED" | "ROUTED" | "STATUS_CHANGED" | "ASSIGNED" | "RELEASED";
	timestamp: Date;
	note: string;
	actor?: {
		id: string;
		name: string;
		email: string;
	};
	department?: {
		id: string;
		name: string;
		code: string;
	};
	meta?: Record<string, unknown>;
}

export interface IServiceRequestFilters {
	searchTerm?: string;
	status?: RequestStatus;
	priority?: RequestPriority;
	categoryId?: string;
	departmentId?: string;
	wardId?: string;
	citizenId?: string;
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export interface IServiceRequestResponse {
	id: string;
	requestNo: string;
	citizenId: string;
	categoryId: string;
	currentDepartmentId: string;
	type: RequestType;
	title: string;
	description: string;
	priority: RequestPriority;
	status: RequestStatus;
	responseDueAt: Date | null;
	resolutionDueAt: Date | null;
	firstRespondedAt: Date | null;
	resolvedAt: Date | null;
	closedAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
	citizen?: {
		id: string;
		name: string;
		email: string;
		contactNumber: string | null;
	};
	category?: {
		id: string;
		name: string;
		department: {
			id: string;
			name: string;
			code: string;
		};
	};
	currentDepartment?: {
		id: string;
		name: string;
		code: string;
	};
	reportedLocation?: {
		id: string;
		wardId: string;
		addressLine: string;
		landmark: string | null;
		latitude: string | null;
		longitude: string | null;
		ward: {
			id: string;
			name: string;
			code: string;
			city: string;
		};
	};
}