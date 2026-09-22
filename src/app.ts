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
import cors from "cors";
import config from "./app/config";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandlers";
import { notFound } from "./app/middlewares/notFound";
import crypto from "crypto";
import httpStatus from "http-status";
import cookieParser from "cookie-parser";

const app: Application = express();

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

// Authentication API
app.use("/api/v1/auth/", authRoutes);

// User Management API
app.use("/api/v1/users/", userRoutes);

// Department Management API
app.use("/api/v1/departments/", departmentRoutes);

// Category Management API
app.use("/api/v1/categories/", categoryRoutes);

// TEST Otp api
app.get("/test", async (req: Request, res: Response, next: NextFunction) => {
	try {
		// Generates a 6-digit OTP as a number and converts it to a string
		const otp = crypto.randomInt(100000, 1000000).toString();

		// // Set the data into Redis with a 60-second expiration (TTL)
		// await redisClient.set("forgot-password-otp:patient1@gmail.com", otp, {
		// 	expiration: {
		// 		type: "EX",
		// 		value: 60,
		// 	},
		// });

		return res.status(httpStatus.OK).json({
			success: true,
			message: "Welcome to CityCare OTP Provider System!",
			data: otp,
		});
	} catch (error) {
		next(error);
	}
});

app.get("/", (req: Request, res: Response) => {
	res.send("Wellcome to the Citycare Backend System!");
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
