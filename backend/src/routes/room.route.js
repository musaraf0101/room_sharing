import express from "express";
import { verifyToken } from "./../middleware/verifyToken.js";
import {
  createRoom,
  deleteRoom,
  getAllRoom,
  getRoomById,
  updateRoom,
} from "../controllers/rooms.controller.js";
import upload from "./../middleware/upload.js";

const roomRouter = express.Router();

roomRouter.get("/", verifyToken, getAllRoom);
roomRouter.get("/:id", verifyToken, getRoomById);
roomRouter.post("/", verifyToken, upload.array("images", 4), createRoom);
roomRouter.put("/:id", verifyToken, upload.array("images", 4), updateRoom);
roomRouter.delete("/:id", verifyToken, deleteRoom);

export default roomRouter;
