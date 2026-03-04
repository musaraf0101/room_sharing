import jwt from "jsonwebtoken";
import { User } from "./../models/User.js";

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    const token =
      req.cookies?.token ||
      (authHeader ? authHeader.replace("Bearer ", "") : null);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decode.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.userId = user._id;
    req.userRole = user.role;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please login again.",
      });
    }
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};
