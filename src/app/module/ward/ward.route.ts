import { Router } from "express";
import { wardController } from "./ward.controller";
import { wardValidation } from "./ward.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../../generated/prisma/enums";

const router = Router();

// ?city=Dhaka&isActive=true filter the list
router.get("/", auth(), wardController.getAllWards);

router.post(
	"/",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
	validateRequest(wardValidation.createWardSchema),
	wardController.createWard,
);

router.get("/:id", auth(), wardController.getWardById);

router.patch(
	"/:id",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
	validateRequest(wardValidation.updateWardSchema),
	wardController.updateWard,
);

router.delete(
	"/:id",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
	wardController.deleteWard,
);

export const wardRoutes = router;
