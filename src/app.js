import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/tasks.routes.js";
import membershipRoutes from "./routes/membership.routes.js";
import exchangeRoutes from "./routes/exchanges.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import matchRoutes from "./routes/matches.routes.js";
import healthRoutes from "./routes/health.routes.js";
import debugRoutes from "./routes/debug.routes.js";
import { FRONTEND_URL } from "./config.js";

const app = express();

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use("/api", healthRoutes);
app.use("/api", debugRoutes);
app.use("/api", authRoutes);
app.use("/api", taskRoutes);
app.use("/api", membershipRoutes);
app.use("/api", exchangeRoutes);
app.use("/api", uploadRoutes);
app.use("/api/matches", matchRoutes);
export default app;
