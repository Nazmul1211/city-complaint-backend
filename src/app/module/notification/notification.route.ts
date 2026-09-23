import { Router } from "express";
import { UserRole } from "../../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { notificationController } from "./notification.controller";
import { notificationValidation } from "./notification.validation";

const router = Router();

router.get(
	"/",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF, UserRole.CITIZEN),
	validateRequest(notificationValidation.getNotificationsSchema),
	notificationController.getMyNotifications,
);

// Declared before /:id/read so "read-all" is never swallowed by the uuid param
router.patch(
	"/read-all",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF, UserRole.CITIZEN),
	notificationController.markAllAsRead,
);

router.patch(
	"/:id/read",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF, UserRole.CITIZEN),
	validateRequest(notificationValidation.markNotificationReadSchema),
	notificationController.markAsRead,
);

export const notificationRoutes = router;
