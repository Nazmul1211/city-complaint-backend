import { prisma } from "../../lib/prisma";
import type { IRouteRequest, IRouteResponse } from "./request-routing.interface";

const routeInclude = {
	department: { select: { id: true, name: true, code: true } },
	routedBy: { select: { id: true, name: true, email: true } },
	request: { select: { id: true, requestNo: true, status: true, currentDepartmentId: true } },
} as const;

// Transfer a request to a new department.
// Only ADMIN, SUPER_ADMIN, or STAFF belonging to the current department may do this.
const routeRequest = async (requestId: string, userId: string, userRole: string, payload: IRouteRequest): Promise<IRouteResponse> => {
	const request = await prisma.serviceRequest.findFirst({ where: { id: requestId } });
	if (!request) throw new Error("Service request not found.");

	// STAFF may only route requests that currently sit in one of their departments
	if (userRole === "STAFF") {
		const memberships = await prisma.departmentMember.findMany({
			where: { userId, isActive: true },
			select: { departmentId: true },
		});
		const deptIds = memberships.map((m) => m.departmentId);
		if (!deptIds.includes(request.currentDepartmentId)) {
			throw new Error("You can only route requests that belong to your department.");
		}
	}

	const targetDepartment = await prisma.department.findFirst({
		where: { id: payload.departmentId, isActive: true, deletedAt: null },
	});
	if (!targetDepartment) throw new Error("Target department not found or inactive.");

	if (request.currentDepartmentId === payload.departmentId) {
		throw new Error("Request is already assigned to that department.");
	}

	// In one transaction: close the active route, create the new one, update the request
	const newRoute = await prisma.$transaction(async (tx) => {
		// End the currently active route (the one with no endedAt)
		await tx.requestDepartmentRoute.updateMany({
			where: { requestId, endedAt: null },
			data: { endedAt: new Date() },
		});

		// Create the new route entry
		const created = await tx.requestDepartmentRoute.create({
			data: {
				requestId,
				departmentId: payload.departmentId,
				routedById: userId,
				reason: payload.reason ?? null,
			},
			include: routeInclude,
		});

		// Move the request to the new department
		await tx.serviceRequest.update({
			where: { id: requestId },
			data: { currentDepartmentId: payload.departmentId },
		});

		return created;
	});

	return newRoute as IRouteResponse;
};

// Return the full routing history for a request (oldest first)
const getRoutes = async (requestId: string): Promise<IRouteResponse[]> => {
	const request = await prisma.serviceRequest.findFirst({ where: { id: requestId } });
	if (!request) throw new Error("Service request not found.");

	const routes = await prisma.requestDepartmentRoute.findMany({
		where: { requestId },
		orderBy: { routedAt: "asc" },
		include: routeInclude,
	});

	return routes as IRouteResponse[];
};

// Mark a specific route entry as ended manually (edge-case / admin correction)
const endRoute = async (requestId: string, routeId: string): Promise<IRouteResponse> => {
	const route = await prisma.requestDepartmentRoute.findFirst({
		where: { id: routeId, requestId },
	});
	if (!route) throw new Error("Route entry not found.");
	if (route.endedAt) throw new Error("This route has already been ended.");

	const updated = await prisma.requestDepartmentRoute.update({
		where: { id: routeId },
		data: { endedAt: new Date() },
		include: routeInclude,
	});

	return updated as IRouteResponse;
};

export const requestRoutingService = {
	routeRequest,
	getRoutes,
	endRoute,
};
