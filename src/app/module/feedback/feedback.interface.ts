import type { RequestStatus } from "../../../../generated/prisma/enums";

export interface ICreateFeedback {
	rating: number;
	comment?: string;
}

export interface IFeedbackResponse {
	id: string;
	requestId: string;
	citizenId: string;
	rating: number;
	comment: string | null;
	createdAt: Date;
	citizen?: {
		id: string;
		name: string;
		email: string;
	};
	request?: {
		id: string;
		requestNo: string;
		title: string;
		status: RequestStatus;
	};
}
