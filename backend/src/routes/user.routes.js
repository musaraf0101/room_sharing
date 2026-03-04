import express from "express";
import { updateProfile } from "../controllers/user.controller.js";
import { verifyToken } from "./../middleware/verifyToken.js";
import { authorizedRoles } from "./../middleware/verifyRole.js";

const userRouter = express.Router();

userRouter.put(
  "/:id",
  verifyToken,
  authorizedRoles("admin", "user"),
  updateProfile,
);

export default userRouter;
