import { Router } from "express";
import { authController } from "./auth.controller";


const router = Router();


router.post("/register", authController.registerCitizen);
router.post("verify-email", authController.verifyCitizenEmail);
router.post("/login", authController.loginUser);
router.post("/google-login", authController.googleLogin);
router.post("/github-login", authController.githubLogin);
router.post("refresh-token", authController.refreshToken);
router.get("forgotPassword", authController.forgotPassword);
router.post("reset-password", authController.resetPassword);


export const authRoutes = router;