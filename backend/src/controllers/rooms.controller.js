import { logger } from "./../utils/logger.js";
import { Room } from "./../models/Room.js";
import {
  createRoomValidation,
  updateRoomValidation,
} from "../validation/room.validation.js";

export const getAllRoom = async (req, res) => {
  try {
    logger.info("get all room end point hit...");

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalRooms = await Room.countDocuments();

    const rooms = await Room.find().skip(skip).limit(limit);

    res.status(200).json({
      success: true,
      message: "all room data fetch success",
      data: rooms,
      skip,
      limit,
      page,
      totalPage: Math.ceil(totalRooms / limit),
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};
export const getRoomById = async (req, res) => {
  try {
    logger.info("get all room end point hit...");

    const { id } = req.params;

    const room = await Room.findById(id);

    if (!room) {
      return res.status(200).json({
        success: false,
        message: "room details not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "room details founded",
      data: room,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};
export const createRoom = async (req, res) => {
  try {
    logger.info("get all room end point hit...");

    const { error } = createRoomValidation(req.body);

    if (error) {
      logger.warn("validation error", error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { roomType, location, price, title, description } = req.body;

    const rooms = {};

    if (roomType !== undefined) rooms.roomType = roomType;
    if (location !== undefined) rooms.location = location;
    if (price !== undefined) rooms.price = price;
    if (title !== undefined) rooms.title = title;
    if (description !== undefined) rooms.description = description;

    rooms.userId = req.userId;

    const newRoom = await Room.create(rooms);

    res.status(201).json({
      success: true,
      message: "new room added success",
      data: newRoom,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};
export const updateRoom = async (req, res) => {
  try {
    logger.info("get all room end point hit...");

    const { error } = updateRoomValidation(req.body);

    if (error) {
      logger.warn("validation error", error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { id } = req.params;

    const rooms = await Room.findById(id);

    if (!rooms) {
      return res.status(200).json({
        success: false,
        message: "room details not founded",
      });
    }
    if (rooms.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can update only your own room",
      });
    }
    const { roomType, location, price, title, description } = req.body;

    const updatedRooms = {};

    if (roomType !== undefined) updatedRooms.roomType = roomType;
    if (location !== undefined) updatedRooms.location = location;
    if (price !== undefined) updatedRooms.price = price;
    if (title !== undefined) updatedRooms.title = title;
    if (description !== undefined) updatedRooms.description = description;

    const updatedRoom = await Room.findByIdAndUpdate(id, updatedRooms, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "room details update success",
      data: updatedRoom,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};
export const deleteRooom = async (req, res) => {
  try {
    logger.info("get all room end point hit...");
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};
