import { Router } from "express";
import { requestStatusController } from "./request-status.controller";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { requestStatusValidation } from "./request-status.validation";
import { UserRole } from "../../../../generated/prisma/enums";

const router = Router({ mergeParams: true });

router.patch(
	"/",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF),
	validateRequest(requestStatusValidation.changeStatusSchema),
	requestStatusController.changeStatus,
);

router.get(
	"/history",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF, UserRole.CITIZEN),
	validateRequest(requestStatusValidation.listStatusHistorySchema),
	requestStatusController.getStatusHistory,
);

export const requestStatusRoutes = router;
