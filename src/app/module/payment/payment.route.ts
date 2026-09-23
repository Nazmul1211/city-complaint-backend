import { Router } from "express";
import { UserRole } from "../../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { paymentController } from "./payment.controller";
import { paymentValidation } from "./payment.validation";

const router = Router();

// 1. bKash Gateway Callback (Public endpoint: bKash redirects browser here)
router.get(
	"/callback",
	validateRequest(paymentValidation.callbackQuerySchema),
	paymentController.handleCallback,
);

// 2. Issue new payment bill/fee (Admin / Super Admin / Staff)
router.post(
	"/",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF),
	validateRequest(paymentValidation.issuePaymentSchema),
	paymentController.issuePayment,
);

// 3. Citizen view my payments
router.get(
	"/my-payments",
	auth(UserRole.CITIZEN),
	validateRequest(paymentValidation.queryPaymentSchema),
	paymentController.getMyPayments,
);

// 4. Admin / Staff view all payments
router.get(
	"/",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF),
	validateRequest(paymentValidation.queryPaymentSchema),
	paymentController.getAllPayments,
);

// 5. Initiate bKash checkout session (returns bkashURL)
router.post(
	"/:id/checkout",
	auth(UserRole.CITIZEN, UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF),
	validateRequest(paymentValidation.initiateCheckoutSchema),
	paymentController.initiateCheckout,
);

// 6. Refund payment (Admin / Super Admin)
router.post(
	"/:id/refund",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
	validateRequest(paymentValidation.refundPaymentSchema),
	paymentController.refundPayment,
);

// 7. Get single payment details with transactions & event log
router.get(
	"/:id",
	auth(UserRole.CITIZEN, UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF),
	paymentController.getPaymentById,
);

export const paymentRoutes = router;
