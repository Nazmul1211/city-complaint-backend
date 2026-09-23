import { Router } from "express";
import { serviceRequestController } from "./service-request.controller";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { serviceRequestValidation } from "./service-request.validation";
import { UserRole } from "../../../../generated/prisma/enums";
import { requestRoutingRoutes } from "../request-routing/request-routing.route";
import { requestAssignmentRoutes } from "../request-assignment/request-assignment.route";
import { requestStatusRoutes } from "../request-status/request-status.route";

const router = Router();

router.post(
	"/",
	auth(UserRole.CITIZEN),
	validateRequest(serviceRequestValidation.createServiceRequestSchema),
	serviceRequestController.createServiceRequest,
);

router.get(
	"/my",
	auth(UserRole.CITIZEN),
	serviceRequestController.getMyServiceRequests,
);

router.get(
	"/",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF),
	serviceRequestController.getAllServiceRequests,
);

router.get(
	"/:id",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF, UserRole.CITIZEN),
	validateRequest(serviceRequestValidation.getServiceRequestByIdSchema),
	serviceRequestController.getServiceRequestById,
);

router.get(
	"/:id/timeline",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF, UserRole.CITIZEN),
	validateRequest(serviceRequestValidation.getServiceRequestByIdSchema),
	serviceRequestController.getRequestTimeline,
);

// Department routing sub-router — POST/GET /requests/:id/routes, PATCH /requests/:id/routes/:routeId/end
router.use("/:id/routes", requestRoutingRoutes);

// Assignment sub-router — POST/GET /requests/:id/assignments, PATCH /requests/:id/assignments/:assignmentId/release
router.use("/:id/assignments", requestAssignmentRoutes);

// Status sub-router — PATCH /requests/:id/status, GET /requests/:id/status/history
router.use("/:id/status", requestStatusRoutes);

export const serviceRequestRoutes = router;