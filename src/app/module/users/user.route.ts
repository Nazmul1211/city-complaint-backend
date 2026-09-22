import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../../generated/prisma/enums";
import { upload } from "../../lib/multer";

const router = Router();

// Authenticated "my profile" APIs — must be declared BEFORE "/:id" so that
// Express does not treat "me" as an :id parameter.
router.get("/me", auth(), userController.getMe);

router.patch("/me", auth(), userController.updateMyProfile);

router.patch(
	"/profile-image",
	auth(UserRole.ADMIN, UserRole.CITIZEN, UserRole.STAFF, UserRole.SUPER_ADMIN),
	upload.single("profileImage"),
	userController.uploadProfileImage,
);

router.delete("/me", auth(), userController.deleteMe);

// Admin-only user management API
router.delete(
	"/:id",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
	userController.deleteUser,
);

export const userRoutes = router;
