import { Router } from "express";
import { workUpdateController } from "./work-update.controller";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { workUpdateValidation } from "./work-update.validation";
import { UserRole } from "../../../../generated/prisma/enums";

const router = Router({ mergeParams: true });

router.post(
	"/",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF),
	validateRequest(workUpdateValidation.createWorkUpdateSchema),
	workUpdateController.createWorkUpdate,
);

router.get(
	"/",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF, UserRole.CITIZEN),
	validateRequest(workUpdateValidation.listWorkUpdatesSchema),
	workUpdateController.getWorkUpdates,
);

export const workUpdateRoutes = router;
