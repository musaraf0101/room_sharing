import { logger } from "./../utils/logger.js";
import { Room } from "./../models/Room.js";
import {
  createRoomValidation,
  updateRoomValidation,
} from "../validation/room.validation.js";
import cloudinary from "./../config/cloudinary.js";

export const getAllRoom = async (req, res) => {
  try {
    logger.info("get all room end point hit...");

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.city) {
      filter.location = { $regex: req.query.city, $options: "i" };
    }
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }
    if (req.query.roomType) filter.roomType = req.query.roomType;
    if (req.query.genderPreference)
      filter.genderPreference = req.query.genderPreference;
    if (req.query.suitableFor) filter.suitableFor = req.query.suitableFor;
    if (req.query.meals === "true") filter["utilities.meals"] = true;
    if (req.query.availableFrom) {
      filter.availableFrom = { $lte: new Date(req.query.availableFrom) };
    }

    const totalRooms = await Room.countDocuments(filter);

    const rooms = await Room.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "all room data fetch success",
      data: rooms,
      totalRooms,
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

export const getUserRooms = async (req, res) => {
  try {
    logger.info("get user rooms end point hit...");

    const rooms = await Room.find({ userId: req.userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      message: "user rooms fetch success",
      data: rooms,
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
    logger.info("get room by id end point hit...");

    const { id } = req.params;

    const room = await Room.findById(id);

    if (!room) {
      return res.status(404).json({
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
    logger.info("create room end point hit...");

    const { error } = createRoomValidation(req.body);

    if (error) {
      logger.warn("validation error", error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const {
      roomType,
      location,
      price,
      securityDeposit,
      waterIncluded,
      electricityIncluded,
      wifiIncluded,
      mealsIncluded,
      genderPreference,
      suitableFor,
      availableFrom,
      houseRules,
      whatsapp,
      title,
      description,
    } = req.body;

    const rooms = {};

    if (roomType !== undefined) rooms.roomType = roomType;
    if (location !== undefined) rooms.location = location;
    if (price !== undefined) rooms.price = price;
    if (securityDeposit !== undefined) rooms.securityDeposit = securityDeposit;
    if (genderPreference !== undefined)
      rooms.genderPreference = genderPreference;
    if (suitableFor !== undefined) rooms.suitableFor = suitableFor;
    if (availableFrom !== undefined)
      rooms.availableFrom = new Date(availableFrom);
    if (houseRules !== undefined) rooms.houseRules = houseRules;
    if (whatsapp !== undefined) rooms.whatsapp = whatsapp;
    if (title !== undefined) rooms.title = title;
    if (description !== undefined) rooms.description = description;

    rooms.utilities = {
      water: waterIncluded === "true",
      electricity: electricityIncluded === "true",
      wifi: wifiIncluded === "true",
      meals: mealsIncluded === "true",
    };

    if (req.file) {
      rooms.mediaIDs = [{ url: req.file.path, public_id: req.file.filename }];
    }
    if (req.files && req.files.length > 0) {
      rooms.mediaIDs = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename,
      }));
    }

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
    logger.info("update room end point hit...");

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
      return res.status(404).json({
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

    const {
      roomType,
      location,
      price,
      securityDeposit,
      waterIncluded,
      electricityIncluded,
      wifiIncluded,
      mealsIncluded,
      genderPreference,
      suitableFor,
      availableFrom,
      houseRules,
      whatsapp,
      title,
      description,
    } = req.body;

    const updatedRooms = {};

    if (roomType !== undefined) updatedRooms.roomType = roomType;
    if (location !== undefined) updatedRooms.location = location;
    if (price !== undefined) updatedRooms.price = price;
    if (securityDeposit !== undefined)
      updatedRooms.securityDeposit = securityDeposit;
    if (genderPreference !== undefined)
      updatedRooms.genderPreference = genderPreference;
    if (suitableFor !== undefined) updatedRooms.suitableFor = suitableFor;
    if (availableFrom !== undefined)
      updatedRooms.availableFrom = new Date(availableFrom);
    if (houseRules !== undefined) updatedRooms.houseRules = houseRules;
    if (whatsapp !== undefined) updatedRooms.whatsapp = whatsapp;
    if (title !== undefined) updatedRooms.title = title;
    if (description !== undefined) updatedRooms.description = description;

    if (
      waterIncluded !== undefined ||
      electricityIncluded !== undefined ||
      wifiIncluded !== undefined ||
      mealsIncluded !== undefined
    ) {
      updatedRooms.utilities = {
        water: waterIncluded === "true",
        electricity: electricityIncluded === "true",
        wifi: wifiIncluded === "true",
        meals: mealsIncluded === "true",
      };
    }

    if (req.file) {
      if (rooms.mediaIDs && rooms.mediaIDs.length > 0) {
        for (const img of rooms.mediaIDs) {
          if (img.public_id) await cloudinary.uploader.destroy(img.public_id);
        }
      }
      updatedRooms.mediaIDs = [
        { url: req.file.path, public_id: req.file.filename },
      ];
    }

    if (req.files && req.files.length > 0) {
      if (rooms.mediaIDs && rooms.mediaIDs.length > 0) {
        for (const img of rooms.mediaIDs) {
          if (img.public_id) await cloudinary.uploader.destroy(img.public_id);
        }
      }
      updatedRooms.mediaIDs = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename,
      }));
    }

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

export const deleteRoom = async (req, res) => {
  try {
    logger.info("delete room end point hit...");

    const { id } = req.params;
    const rooms = await Room.findById(id);

    if (!rooms) {
      return res.status(404).json({
        success: false,
        message: "room not found",
      });
    }

    if (rooms.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can delete only your own room",
      });
    }

    if (rooms.mediaIDs && rooms.mediaIDs.length > 0) {
      for (const img of rooms.mediaIDs) {
        if (img.public_id) await cloudinary.uploader.destroy(img.public_id);
      }
    }

    await Room.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "room details delete success",
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
