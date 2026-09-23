import { RequestStatus } from "../../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import type { ICreateFeedback, IFeedbackResponse } from "./feedback.interface";

const feedbackInclude = {
	citizen: { select: { id: true, name: true, email: true } },
	request: { select: { id: true, requestNo: true, title: true, status: true } },
} as const;

const TERMINAL_STATUSES: string[] = [
	RequestStatus.RESOLVED,
	RequestStatus.CLOSED,
];

const getFeedback = async (
	requestId: string,
	userId: string,
	userRole: string,
): Promise<IFeedbackResponse | null> => {
	const request = await prisma.serviceRequest.findFirst({
		where: { id: requestId },
	});
	if (!request) throw new Error("Service request not found.");

	if (userRole === "CITIZEN") {
		const citizen = await prisma.citizen.findUnique({ where: { userId } });
		if (!citizen || request.citizenId !== citizen.id) {
			throw new Error(
				"You don't have permission to view feedback for this request.",
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
				"You don't have permission to view feedback for this request.",
			);
		}
	}

	const feedback = await prisma.feedback.findUnique({
		where: { requestId },
		include: feedbackInclude,
	});

	return feedback as unknown as IFeedbackResponse | null;
};

const createFeedback = async (
	requestId: string,
	userId: string,
	payload: ICreateFeedback,
): Promise<IFeedbackResponse> => {
	const citizen = await prisma.citizen.findUnique({ where: { userId } });
	if (!citizen)
		throw new Error(
			"Citizen profile not found. Please complete your profile first.",
		);

	const request = await prisma.serviceRequest.findFirst({
		where: { id: requestId },
	});
	if (!request) throw new Error("Service request not found.");

	if (request.citizenId !== citizen.id) {
		throw new Error("You can only give feedback on your own requests.");
	}

	if (!TERMINAL_STATUSES.includes(request.status)) {
		throw new Error(
			`Feedback can only be given when the request is RESOLVED or CLOSED. Current status: ${request.status}.`,
		);
	}

	const existing = await prisma.feedback.findUnique({ where: { requestId } });
	if (existing) throw new Error("Feedback already exists for this request.");

	const feedback = await prisma.feedback.create({
		data: {
			requestId,
			citizenId: citizen.id,
			rating: payload.rating,
			comment: payload.comment ?? null,
		},
		include: feedbackInclude,
	});

	return feedback as unknown as IFeedbackResponse;
};

export const feedbackService = {
	createFeedback,
	getFeedback,
};
