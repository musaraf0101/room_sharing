import bcrypt from "bcryptjs";
import crypto from "crypto";
import { User } from "../models/User.js";
import { logger } from "../utils/logger.js";
import {
  validateLogin,
  validateRegistration,
} from "../validation/auth.validation.js";
import { generateToken } from "./../utils/token.js";
import { sendPasswordResetEmail } from "../utils/email.js";

export const register = async (req, res) => {
  try {
    logger.info("register end point hit....");

    const { error } = validateRegistration(req.body);

    if (error) {
      logger.warn("validation error", error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { username, email, password, phoneNumber } = req.body;

    const checkUser = await User.findOne({ $or: [{ email }, { username }] });

    if (checkUser) {
      logger.warn("User already exists");
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      password: hashedPassword,
      email,
      phoneNumber,
    });

    logger.warn("user saved successfully", user._id);

    res.status(201).json({
      success: true,
      message: "user registration success",
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};
export const login = async (req, res) => {
  try {
    logger.info("login end point hit....");

    const { error } = validateLogin(req.body);

    if (error) {
      logger.warn("validation error", error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPassword = await bcrypt.compare(password, user.password);

    if (!isPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "login success",
      data: {
        id: user._id,
        name: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};
export const logout = async (req, res) => {
  try {
    logger.info("logout end point hit....");

    res.clearCookie("token");

    res.status(200).json({
      success: true,
      message: "logout success",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    logger.info("forgot password end point hit....");

    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (user) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpiry = new Date(Date.now() + 15 * 60 * 1000);
      await user.save();

      await sendPasswordResetEmail(user.email, resetToken);
    }

    res.status(200).json({
      success: true,
      message: "If that email exists, a reset link has been sent.",
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ success: false, message: "internal server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    logger.info("reset password end point hit....");

    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 8) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Password must be at least 8 characters",
        });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: { $gt: new Date() },
    }).select("+resetPasswordToken +resetPasswordExpiry");

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset link" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Password reset successful. You can now log in.",
      });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ success: false, message: "internal server error" });
  }
};
