import { Router } from "express";
import { categoryController } from "./category.controller";
import { slaPolicyController } from "./slaPolicy.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../../generated/prisma/enums";

const router = Router();

// ?departmentId=<uuid> narrows the list to one department's categories
router.get("/", auth(), categoryController.getAllCategories);

router.post(
	"/",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
	categoryController.createCategory,
);

router.get("/:id", auth(), categoryController.getCategoryById);

router.patch(
	"/:id",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
	categoryController.updateCategory,
);

router.delete(
	"/:id",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
	categoryController.deleteCategory,
);


// SLA - Routes
router.get("/:categoryId/sla", auth(), slaPolicyController.getSla);

router.post(
	"/:categoryId/sla",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
	slaPolicyController.createSla,
);

router.patch(
	"/:categoryId/sla",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
	slaPolicyController.updateSla,
);

export const categoryRoutes = router;
