import express from "express";
import { getAllCount } from "../controllers/admin.controller.js";
import { verifyToken } from "./../middleware/verifyToken.js";
import { authorizedRoles } from "./../middleware/verifyRole.js";

const adminRouter = express.Router();

adminRouter.get("/get", verifyToken, authorizedRoles("admin"), getAllCount);

export default adminRouter;
