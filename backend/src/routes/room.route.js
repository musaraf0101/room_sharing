import express from "express";
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
