import express from "express";
import rateLimit from "express-rate-limit";
import { verifyToken } from "./../middleware/verifyToken.js";
import {
  createRoom,
  deleteRoom,
  getAllRoom,
  getUserRooms,
  getRoomById,
  updateRoom,
} from "../controllers/rooms.controller.js";
import upload from "./../middleware/upload.js";
import { authorizedRoles } from "./../middleware/verifyRole.js";

const createRoomLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many rooms created, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

const roomRouter = express.Router();

roomRouter.get("/", getAllRoom);
roomRouter.get(
  "/my-rooms",
  verifyToken,
  authorizedRoles("admin", "user"),
  getUserRooms,
);
roomRouter.get("/:id", getRoomById);
roomRouter.post(
  "/",
  verifyToken,
  authorizedRoles("admin", "user"),
  createRoomLimiter,
  upload.array("images", 4),
  createRoom,
);
roomRouter.put(
  "/:id",
  verifyToken,
  authorizedRoles("admin", "user"),
  upload.array("images", 4),
  updateRoom,
);
roomRouter.delete(
  "/:id",
  verifyToken,
  authorizedRoles("admin", "user"),
  deleteRoom,
);

export default roomRouter;
