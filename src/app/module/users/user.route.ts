import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../../generated/prisma/enums";

const router = Router();

router.delete(
	"/:id",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
	userController.deleteUser,
);

export const userRoutes = router;
