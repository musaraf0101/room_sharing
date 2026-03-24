import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { DBConnection } from "./config/db.js";
import { logger } from "./utils/logger.js";
import roomRouter from "./routes/room.route.js";
import requestRouter from "./routes/request.routes.js";
import adminRouter from "./routes/admin.routes.js";
import userRouter from "./routes/user.routes.js";

const app = express();

DBConnection();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/room", roomRouter);
app.use("/api/request", requestRouter);
app.use("/api/statistics", adminRouter);
app.use("/api/user", userRouter);

app.use(errorHandler);

app.listen(3000, () => {
  console.log("server is running");
  logger.info("server is running");
});
