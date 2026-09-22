import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { requestRoutingService } from "./request-routing.service";

const routeRequest = catchAsync(async (req: Request, res: Response) => {
	const result = await requestRoutingService.routeRequest(
		String(req.params.id),
		req.user.id,
		req.user.role,
		req.body,
	);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Request routed to department successfully",
		data: result,
	});
});

const getRoutes = catchAsync(async (req: Request, res: Response) => {
	const result = await requestRoutingService.getRoutes(String(req.params.id));

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Routing history fetched successfully",
		data: result,
	});
});

const endRoute = catchAsync(async (req: Request, res: Response) => {
	const result = await requestRoutingService.endRoute(
		String(req.params.id),
		String(req.params.routeId),
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Route ended successfully",
		data: result,
	});
});

export const requestRoutingController = {
	routeRequest,
	getRoutes,
	endRoute,
};
