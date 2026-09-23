import express, {
	NextFunction,
	type Application,
	type Request,
	type Response,
} from "express";
import { authRoutes } from "./app/module/auth/auth.route";
import { userRoutes } from "./app/module/users/user.route";
import { departmentRoutes } from "./app/module/department/department.route";
import { categoryRoutes } from "./app/module/category/category.route";
import { wardRoutes } from "./app/module/ward/ward.route";
import { serviceRequestRoutes } from "./app/module/service-request/service-request.route";
import { notificationRoutes } from "./app/module/notification/notification.route";
import cors from "cors";
import config from "./app/config";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandlers";
import { notFound } from "./app/middlewares/notFound";
import crypto from "crypto";
import httpStatus from "http-status";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { auditLogRoutes } from "./app/module/audit-log/audit-log.route";
import { getBkashIdToken } from "./app/lib/bkash";
import { redisClient } from "./app/lib/redis";

const app: Application = express();

// Security headers (XSS protection, noSniff, frameguard, HSTS in production)
app.use(helmet());

app.use(
	cors({
		origin: config.frontend_url,
		credentials: true,
	}),
);

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());

// Stricter limiter for auth endpoints — blunt force against credential
// stuffing / OTP brute force. 10 attempts per 10 minutes per IP.
const authLimiter = rateLimit({
	windowMs: 10 * 60 * 1000,
	limit: 10,
	standardHeaders: "draft-7",
	legacyHeaders: false,
	message: {
		success: false,
		statusCode: 429,
		message: "Too many attempts, please try again after 10 minutes",
		errors: [],
	},
});

// General API limiter — 300 requests per 10 minutes per IP.
const apiLimiter = rateLimit({
	windowMs: 10 * 60 * 1000,
	limit: 300,
	standardHeaders: "draft-7",
	legacyHeaders: false,
	message: {
		success: false,
		statusCode: 429,
		message: "Too many requests from this IP, please try again later",
		errors: [],
	},
});

app.use("/api/v1/auth", authLimiter);
app.use("/api", apiLimiter);

app.use("/api/v1/auth/", authRoutes);
app.use("/api/v1/users/", userRoutes);
app.use("/api/v1/departments/", departmentRoutes);
app.use("/api/v1/categories/", categoryRoutes);
app.use("/api/v1/wards/", wardRoutes);
app.use("/api/v1/requests/", serviceRequestRoutes);
app.use("/api/v1/notifications/", notificationRoutes);
app.use("/api/v1/audit-logs/", auditLogRoutes);

// TEST bKash Token Grant & Redis Caching
app.get("/test", async (_req: Request, res: Response, next: NextFunction) => {
	try {
		const idToken = await getBkashIdToken();
		const idTokenTTL = await redisClient.ttl("bkash:idToken");
		const refreshToken = await redisClient.get("bkash:refreshToken");
		const refreshTokenTTL = await redisClient.ttl("bkash:refreshToken");

		console.log("bKash id_token:", idToken);
		console.log("bKash id_token TTL:", `${idTokenTTL} seconds remaining`);
		console.log("bKash refresh_token:", refreshToken);
		console.log("bKash refresh_token TTL:", `${refreshTokenTTL} seconds remaining`);

		return res.status(httpStatus.OK).json({
			success: true,
			statusCode: httpStatus.OK,
			message: "bKash Token Grant & Redis Caching Successful!",
			data: {
				idToken,
				idTokenTTL: `${idTokenTTL} seconds remaining`,
				refreshToken,
				refreshTokenTTL: `${refreshTokenTTL} seconds remaining`,
			},
		});
	} catch (error) {
		console.error("bKash Token Test Error:", error);
		next(error);
	}
});

app.get("/", (_req: Request, res: Response) => {
	res.status(httpStatus.OK).json({
		success: true,
		statusCode: httpStatus.OK,
		message: "Welcome to the Citycare Backend System!",
		data: null,
	});
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
