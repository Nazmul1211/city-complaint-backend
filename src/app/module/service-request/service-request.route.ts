import { Router } from "express";
import { serviceRequestController } from "./service-request.controller";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { serviceRequestValidation } from "./service-request.validation";
import { UserRole } from "../../../../generated/prisma/enums";
import { requestRoutingRoutes } from "../request-routing/request-routing.route";
import { requestAssignmentRoutes } from "../request-assignment/request-assignment.route";
import { requestStatusRoutes } from "../request-status/request-status.route";
import { workUpdateRoutes } from "../work-update/work-update.route";
import { mediaAttachmentRoutes } from "../media-attachment/media-attachment.route";

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

router.use("/:id/routes", requestRoutingRoutes);
router.use("/:id/assignments", requestAssignmentRoutes);
router.use("/:id/status", requestStatusRoutes);
router.use("/:id/updates", workUpdateRoutes);
router.use("/:id/attachments", mediaAttachmentRoutes);

export const serviceRequestRoutes = router;