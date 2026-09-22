import { Router } from "express";
import { departmentController } from "./department.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../../generated/prisma/enums";

const router = Router();

router.post(
	"/",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
	departmentController.createDepartment,
);

router.get("/", auth(), departmentController.getAllDepartments);

router.get("/:id", auth(), departmentController.getDepartmentById);

router.patch(
	"/:id",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
	departmentController.updateDepartment,
);

router.delete(
	"/:id",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
	departmentController.deleteDepartment,
);

export const departmentRoutes = router;
