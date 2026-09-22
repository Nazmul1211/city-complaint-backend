import { Router } from "express";
import { departmentController } from "./department.controller";
import { departmentMemberController } from "./departmentMember.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../../generated/prisma/enums";

const router = Router();

router.post(
	"/",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
	departmentController.createDepartment,
);

router.get("/", departmentController.getAllDepartments);

router.get("/:id", departmentController.getDepartmentById);

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

// Department member management — nested under /departments/:id/members
router.post(
	"/:id/members",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
	departmentMemberController.addMember,
);

router.get("/:id/members", auth(), departmentMemberController.getMembers);

router.patch(
	"/:id/members/:memberId",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
	departmentMemberController.updateMember,
);

router.delete(
	"/:id/members/:memberId",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
	departmentMemberController.removeMember,
);

export const departmentRoutes = router;
