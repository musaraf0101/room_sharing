import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
  console.log("server is running");
});
