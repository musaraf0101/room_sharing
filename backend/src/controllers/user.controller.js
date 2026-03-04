import { User } from "../models/User.js";
import { logger } from "../utils/logger.js";
import bcrypt from "bcryptjs";
import { updateProfileUser } from "../validation/user.validation.js";

export const updateProfile = async (req, res) => {
  try {
    logger.info("user update end point hit...");
    const { id } = req.params;
    const { username, email, password } = req.body;

    const { error } = updateProfileUser(req.body);
    if (error) {
      logger.warn("validation error", error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    if (req.userRole !== "admin" && req.userId.toString() !== id) {
      logger.warn("Unauthorized profile update attempt", {
        requestingUser: req.userId,
        targetUser: id,
      });
      return res.status(403).json({
        success: false,
        message: "You can only update your own profile.",
      });
    }

    const checkUser = await User.findById(id);

    if (!checkUser) {
      logger.warn("user not found");
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const updateUserProfile = {};

    if (username !== undefined) updateUserProfile.username = username;
    if (email !== undefined) updateUserProfile.email = email;
    if (password) {
      updateUserProfile.password = await bcrypt.hash(password, 10);
    }

    const updateUser = await User.findByIdAndUpdate(id, updateUserProfile, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "user profile updated",
      data: {
        username: updateUser.username,
        email: updateUser.email,
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
