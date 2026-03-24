import express from "express";
import { verifyToken } from "./../middleware/verifyToken.js";
import { authorizedRoles } from "./../middleware/verifyRole.js";
import {
  createRequest,
  deleteRequest,
  getAllRequests,
  getRequestById,
  getUserRequests,
  updateRequest,
} from "../controllers/requests.controller.js";

const requestRouter = express.Router();

requestRouter.get("/", getAllRequests);
requestRouter.get("/:id", getRequestById);
requestRouter.get(
  "/user/my-requests",
  verifyToken,
  authorizedRoles("admin", "user"),
  getUserRequests,
);
requestRouter.post(
  "/",
  verifyToken,
  authorizedRoles("admin", "user"),
  createRequest,
);
requestRouter.put(
  "/:id",
  verifyToken,
  authorizedRoles("admin", "user"),
  updateRequest,
);
requestRouter.delete(
  "/:id",
  verifyToken,
  authorizedRoles("admin", "user"),
  deleteRequest,
);

export default requestRouter;
