import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { logger } from "../utils/logger.js";
import {
  validateLogin,
  validateRegistration,
} from "../validation/auth.validation.js";
import { generateToken } from "./../utils/token.js";

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

    const { username, email, password } = req.body;

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
    });

    logger.warn("user saved successfully", user._id);

    res.status(201).json({
      success: true,
      message: "user registration success",
      data: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
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
      return res.status(404).json({
        success: false,
        message: "user not found!.. please register",
      });
    }

    const isPassword = await bcrypt.compare(password, user.password);

    if (!isPassword) {
      return res.status(400).json({
        success: false,
        message: "invalite credentials",
      });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "login success",
      token,
      data: {
        name: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
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
      error: error.message,
    });
  }
};