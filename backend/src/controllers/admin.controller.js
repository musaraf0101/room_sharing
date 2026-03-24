import { logger } from "../utils/logger.js";
import { User } from "./../models/User.js";
import { Room } from "./../models/Room.js";

export const getAllCount = async (req, res) => {
  try {
    logger.info("get all count end point hit...");

    const totalUser = await User.countDocuments();
    const totalRooms = await Room.countDocuments();

    res.status(200).json({
      success: true,
      message: "total count end point fetch success",
      totalRooms,
      totalUser,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};
