import express from "express";
import cors from "cors";
import morgan from "morgan";
import healthCheckRouter from "./routes/healthcheck.route.js";
import userRouter from "./routes/auth.route.js";

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

// routes
app.use("/api", healthCheckRouter);
app.use("/api/users", userRouter);

export default app;
