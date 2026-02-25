import express from "express";
import { verifyToken } from "./../middleware/verifyToken.js";
import {
  createRoom,
  deleteRooom,
  getAllRoom,
  getRoomById,
  updateRoom,
} from "../controllers/rooms.controller.js";

const roomRouter = express.Router();

roomRouter.get("/", verifyToken, getAllRoom);
roomRouter.get("/:id", verifyToken, getRoomById);
roomRouter.post("/", verifyToken, createRoom);
roomRouter.put("/:id", verifyToken, updateRoom);
roomRouter.delete("/:id", verifyToken, deleteRooom);

export default roomRouter;
