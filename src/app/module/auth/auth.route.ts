import { Router } from "express";
import { authController } from "./auth.controller";
import { authValidation } from "./auth.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = Router();

router.post(
	"/register",
	validateRequest(authValidation.citizenRegistrationSchema),
	authController.registerCitizen,
);

router.post(
	"/verify-email",
	validateRequest(authValidation.citizenEmailVerifySchema),
	authController.verifyCitizenEmail,
);

router.post(
	"/login",
	validateRequest(authValidation.loginSchema),
	authController.loginUser,
);


router.post(
	"/google-login",
	validateRequest(authValidation.googleLoginSchema),
	authController.googleLogin,
);


router.post("/github-login", authController.githubLogin);
router.post("/logout", authController.logoutUser);
router.post("/refresh-token", authController.refreshToken);

router.post(
	"/forgot-password",
	validateRequest(authValidation.forgotPasswordSchema),
	authController.forgotPassword,
);

router.post(
	"/reset-password",
	validateRequest(authValidation.resetPasswordSchema),
	authController.resetPassword,
);

export const authRoutes = router;
