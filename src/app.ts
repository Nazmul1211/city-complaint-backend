import express, { type Application, type Request, type Response } from "express";
import { authRoutes } from "./app/module/auth/auth.route";
import cors from "cors";
import config from "./app/config";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandlers";
import { notFound } from "./app/middlewares/notFound";


const app: Application = express();

app.use(
	cors({
		origin: config.frontend_url,
		credentials: true,
	}),
);

// Middleware to parse JSON bodies
app.use(express.json());

// Authentication
app.use("/api/v1/auth/", authRoutes);


app.get('/', (req: Request, res: Response) => {
  res.send('Wellcome to the Citycare Backend System!');
});



app.use(globalErrorHandler);
app.use(notFound);

export default app;

