import { logger } from "./../utils/logger.js";
import { RoomRequest } from "./../models/RoomRequest.js";
import {
  createRequestValidation,
  updateRequestValidation,
} from "../validation/request.validation.js";

export const getAllRequests = async (req, res) => {
  try {
    logger.info("get all requests end point hit...");

    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.city) {
      filter.lookingIn = { $regex: req.query.city, $options: "i" };
    }
    if (req.query.maxBudget) {
      filter.maxBudget = { $lte: Number(req.query.maxBudget) };
    }
    if (req.query.whoAmI) filter.whoAmI = req.query.whoAmI;
    if (req.query.duration) filter.duration = req.query.duration;
    if (req.query.roomTypePreferred)
      filter.roomTypePreferred = req.query.roomTypePreferred;

    const totalRequests = await RoomRequest.countDocuments(filter);

    const requests = await RoomRequest.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "all requests fetch success",
      data: requests,
      totalRequests,
      skip,
      limit,
      page,
      totalPage: Math.ceil(totalRequests / limit),
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

export const getUserRequests = async (req, res) => {
  try {
    logger.info("get user requests end point hit...");

    const requests = await RoomRequest.find({ userId: req.userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      message: "user requests fetch success",
      data: requests,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

export const getRequestById = async (req, res) => {
  try {
    logger.info("get request by id end point hit...");

    const { id } = req.params;
    const request = await RoomRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "request not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "request details found",
      data: request,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

export const createRequest = async (req, res) => {
  try {
    logger.info("create request end point hit...");

    const { error } = createRequestValidation(req.body);

    if (error) {
      logger.warn("validation error", error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const {
      whoAmI,
      lookingIn,
      maxBudget,
      roomTypePreferred,
      moveInDate,
      gender,
      mealsNeeded,
      duration,
      bio,
      whatsapp,
    } = req.body;

    const newRequest = await RoomRequest.create({
      userId: req.userId,
      whoAmI,
      lookingIn,
      maxBudget,
      roomTypePreferred: roomTypePreferred || "any",
      moveInDate: moveInDate ? new Date(moveInDate) : undefined,
      gender,
      mealsNeeded: mealsNeeded === true || mealsNeeded === "true",
      duration: duration || "long_term",
      bio,
      whatsapp,
    });

    res.status(201).json({
      success: true,
      message: "request created success",
      data: newRequest,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

export const updateRequest = async (req, res) => {
  try {
    logger.info("update request end point hit...");

    const { error } = updateRequestValidation(req.body);

    if (error) {
      logger.warn("validation error", error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { id } = req.params;
    const request = await RoomRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "request not found",
      });
    }

    if (request.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can update only your own request",
      });
    }

    const updates = {};
    const fields = [
      "whoAmI",
      "lookingIn",
      "maxBudget",
      "roomTypePreferred",
      "gender",
      "duration",
      "bio",
      "whatsapp",
    ];
    for (const field of fields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }
    if (req.body.moveInDate !== undefined)
      updates.moveInDate = new Date(req.body.moveInDate);
    if (req.body.mealsNeeded !== undefined)
      updates.mealsNeeded =
        req.body.mealsNeeded === true || req.body.mealsNeeded === "true";

    const updated = await RoomRequest.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "request updated success",
      data: updated,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

export const deleteRequest = async (req, res) => {
  try {
    logger.info("delete request end point hit...");

    const { id } = req.params;
    const request = await RoomRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "request not found",
      });
    }

    if (request.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can delete only your own request",
      });
    }

    await RoomRequest.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "request deleted success",
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};
