import mongoose from "mongoose";
import { logger } from "./../utils/logger.js";

export const DBConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info("DB Connected")
  } catch (error) {
    console.log(error.message);
    logger.error(error.message);
    process.exit(1);
  }
};
