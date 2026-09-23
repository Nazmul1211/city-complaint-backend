import type { StaffPosition } from "../../../../generated/prisma/enums";

export interface IAssignRequest {
	assigneeId: string;
	note?: string;
}

export interface IReleaseAssignment {
	note?: string;
}

export interface IAssignmentResponse {
	id: string;
	requestId: string;
	assigneeId: string;
	assignedById: string;
	note: string | null;
	assignedAt: Date;
	releasedAt: Date | null;
	assignee: {
		id: string;
		name: string;
		email: string;
		phone: string | null;
		departmentMemberships: {
			departmentId: string;
			position: StaffPosition;
			isActive: boolean;
		}[];
	};
	assignedBy: {
		id: string;
		name: string;
		email: string;
	};
	request: {
		id: string;
		requestNo: string;
		title: string;
		status: string;
		currentDepartmentId: string;
	};
}

export interface IAssignmentFilters {
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}