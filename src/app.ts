import express, { type Application, type Request, type Response } from "express";
import { authRoutes } from "./app/module/auth/auth.route";
import cors from "cors";
import config from "./app/config";

const app: Application = express();

app.use(
	cors({
		origin: config.frontend_url,
		credentials: true,
	}),
);


// Authentication
app.use("/api/v1/auth/", authRoutes);


app.get('/', (req: Request, res: Response) => {
  res.send('Wellcome to the Citycare Backend System!');
});

// app.get


export default app;

