import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { notificationService } from "./notification.service";
import type { INotificationFilters } from "./notification.interface";

const getMyNotifications = catchAsync(async (req: Request, res: Response) => {
	const filters: INotificationFilters = {
		unreadOnly: req.query.unreadOnly === "true",
		page: req.query.page ? Number(req.query.page) : undefined,
		limit: req.query.limit ? Number(req.query.limit) : undefined,
	};

	const result = await notificationService.getMyNotifications(
		req.user.id,
		filters,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Notifications fetched successfully",
		data: result.data,
		meta: result.meta,
	});
});

const markAsRead = catchAsync(async (req: Request, res: Response) => {
	const result = await notificationService.markAsRead(
		String(req.params.id),
		req.user.id,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Notification marked as read",
		data: result,
	});
});

const markAllAsRead = catchAsync(async (req: Request, res: Response) => {
	const result = await notificationService.markAllAsRead(req.user.id);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "All notifications marked as read",
		data: result,
	});
});

export const notificationController = {
	getMyNotifications,
	markAsRead,
	markAllAsRead,
};
