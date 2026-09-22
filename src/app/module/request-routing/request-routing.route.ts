import { Router } from "express";
import { requestRoutingController } from "./request-routing.controller";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { requestRoutingValidation } from "./request-routing.validation";
import { UserRole } from "../../../../generated/prisma/enums";

const router = Router({ mergeParams: true }); // mergeParams so :id from the parent router is available

router.post(
	"/",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF),
	validateRequest(requestRoutingValidation.routeRequestSchema),
	requestRoutingController.routeRequest,
);

router.get(
	"/",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF),
	requestRoutingController.getRoutes,
);

router.patch(
	"/:routeId/end",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
	validateRequest(requestRoutingValidation.endRouteSchema),
	requestRoutingController.endRoute,
);

export const requestRoutingRoutes = router;
