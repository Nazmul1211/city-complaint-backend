import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post("/register", authController.registerCitizen);
router.post("/verify-email", authController.verifyCitizenEmail);
router.post("/login", authController.loginUser);
router.post("/google-login", authController.googleLogin);
router.post("/github-login", authController.githubLogin);
router.post("/logout", authController.logoutUser);
router.post("/refresh-token", authController.refreshToken);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

export const authRoutes = router;
