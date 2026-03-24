import express from "express";
import rateLimit from "express-rate-limit";
import { verifyToken } from "./../middleware/verifyToken.js";
import { authorizedRoles } from "./../middleware/verifyRole.js";

const createRequestLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many requests created, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
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
  createRequestLimiter,
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
