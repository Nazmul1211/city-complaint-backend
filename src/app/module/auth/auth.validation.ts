import { z } from "zod";

/*
 * Shared password rule used by register / login / reset-password so the
 * strength requirements stay consistent everywhere.
 */
const passwordSchema = z
	.string()
	.min(8, "Password must be at least 8 characters long")
	.max(32, "Password cannot exceed 32 characters")
	.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
	.regex(/[a-z]/, "Password must contain at least one lowercase letter")
	.regex(/[0-9]/, "Password must contain at least one number")
	.regex(
		/[^A-Za-z0-9]/,
		"Password must contain at least one special character",
	);

// POST /api/v1/auth/register
const citizenRegistrationSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.email(),
	password: passwordSchema,
	citizen: z
		.object({
			contactNumber: z.string().optional(),
		})
		.optional(),
});

// POST /api/v1/auth/verify-email
const citizenEmailVerifySchema = z.object({
	email: z.email(),
	otp: z.string().length(6, "OTP must be exactly 6 digits"),
});

// POST /api/v1/auth/login
const loginSchema = z.object({
	email: z.email(),
	password: passwordSchema,
});

// POST /api/v1/auth/google-login
const googleLoginSchema = z.object({
	idToken: z.string().min(1, "Google idToken is required"),
});

// POST /api/v1/auth/forgot-password
const forgotPasswordSchema = z.object({
	email: z.email(),
});

// POST /api/v1/auth/reset-password
const resetPasswordSchema = z.object({
	email: z.email(),
	otp: z.string().length(6, "OTP must be exactly 6 digits"),
	newPassword: passwordSchema,
});

export const authValidation = {
	citizenRegistrationSchema,
	citizenEmailVerifySchema,
	loginSchema,
	googleLoginSchema,
	forgotPasswordSchema,
	resetPasswordSchema,
};
