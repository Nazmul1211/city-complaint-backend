import { Router } from "express";
import { UserRole } from "../../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { feedbackController } from "./feedback.controller";
import { feedbackValidation } from "./feedback.validation";

const router = Router({ mergeParams: true });

router.post(
	"/",
	auth(UserRole.CITIZEN),
	validateRequest(feedbackValidation.createFeedbackSchema),
	feedbackController.createFeedback,
);

router.get(
	"/",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF, UserRole.CITIZEN),
	validateRequest(feedbackValidation.getFeedbackSchema),
	feedbackController.getFeedback,
);

export const feedbackRoutes = router;
