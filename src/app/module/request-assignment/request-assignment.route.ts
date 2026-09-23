import { Router } from "express";
import { requestAssignmentController } from "./request-assignment.controller";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { requestAssignmentValidation } from "./request-assignment.validation";
import { UserRole } from "../../../../generated/prisma/enums";

const router = Router({ mergeParams: true });

router.post(
	"/",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF),
	validateRequest(requestAssignmentValidation.assignRequestSchema),
	requestAssignmentController.assignRequest,
);

router.get(
	"/",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF, UserRole.CITIZEN),
	validateRequest(requestAssignmentValidation.listAssignmentsSchema),
	requestAssignmentController.getAssignments,
);

router.patch(
	"/:assignmentId/release",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF),
	validateRequest(requestAssignmentValidation.releaseAssignmentSchema),
	requestAssignmentController.releaseAssignment,
);

export const requestAssignmentRoutes = router;