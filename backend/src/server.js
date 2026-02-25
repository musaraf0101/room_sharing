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

const app = express();

DBConnection();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/room", roomRouter);

app.use(errorHandler);

app.listen(3000, () => {
  console.log("server is running");
  logger.info("server is running");
});