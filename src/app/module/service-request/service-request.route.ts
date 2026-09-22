import { Router } from "express";
import { serviceRequestController } from "./service-request.controller";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { serviceRequestValidation } from "./service-request.validation";
import { UserRole } from "../../../../generated/prisma/enums";

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

export const serviceRequestRoutes = router;