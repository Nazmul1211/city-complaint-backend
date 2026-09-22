import type { RequestStatus } from "../../../../generated/prisma/enums";

export interface IRouteRequest {
	departmentId: string;
	reason?: string;
}

export interface IRouteResponse {
	id: string;
	requestId: string;
	departmentId: string;
	routedById: string;
	reason: string | null;
	routedAt: Date;
	endedAt: Date | null;
	department: {
		id: string;
		name: string;
		code: string;
	};
	routedBy: {
		id: string;
		name: string;
		email: string;
	};
	request: {
		id: string;
		requestNo: string;
		status: RequestStatus;
		currentDepartmentId: string;
	};
}
