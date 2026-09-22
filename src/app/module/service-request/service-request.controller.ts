import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { serviceRequestService } from "./service-request.service";
import type { IServiceRequestFilters } from "./service-request.interface";

const parseFilters = (query: Request["query"]): IServiceRequestFilters => ({
	searchTerm: query.searchTerm as string | undefined,
	status: query.status as IServiceRequestFilters["status"],
	priority: query.priority as IServiceRequestFilters["priority"],
	categoryId: query.categoryId as string | undefined,
	departmentId: query.departmentId as string | undefined,
	wardId: query.wardId as string | undefined,
	page: query.page ? Number(query.page) : undefined,
	limit: query.limit ? Number(query.limit) : undefined,
	sortBy: query.sortBy as string | undefined,
	sortOrder: query.sortOrder as "asc" | "desc" | undefined,
});

const createServiceRequest = catchAsync(async (req: Request, res: Response) => {
	const result = await serviceRequestService.createServiceRequest(req.user.id, req.body);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Service request created successfully",
		data: result,
	});
});

const getAllServiceRequests = catchAsync(async (req: Request, res: Response) => {
	const result = await serviceRequestService.getAllServiceRequests(parseFilters(req.query), req.user.id, req.user.role);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Service requests fetched successfully",
		data: result.data,
		meta: result.meta,
	});
});

const getMyServiceRequests = catchAsync(async (req: Request, res: Response) => {
	const result = await serviceRequestService.getMyServiceRequests(req.user.id, parseFilters(req.query));

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "My service requests fetched successfully",
		data: result.data,
		meta: result.meta,
	});
});

const getServiceRequestById = catchAsync(async (req: Request, res: Response) => {
	const result = await serviceRequestService.getServiceRequestById(String(req.params.id), req.user.id, req.user.role);

	if (!result) {
		sendResponse(res, {
			statusCode: httpStatus.NOT_FOUND,
			success: false,
			message: "Service request not found",
			data: null,
		});
		return;
	}

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Service request fetched successfully",
		data: result,
	});
});

export const serviceRequestController = {
	createServiceRequest,
	getAllServiceRequests,
	getMyServiceRequests,
	getServiceRequestById,
};