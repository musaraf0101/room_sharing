import express from "express";
import rateLimit from "express-rate-limit";
import { login, logout, register } from "../controllers/auth.controller.js";

const authRouter = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many attempts, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

authRouter.post("/login", authLimiter, login);
authRouter.post("/logout", logout);
authRouter.post("/register", authLimiter, register);

export default authRouter;
