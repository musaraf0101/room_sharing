import mongoose from "mongoose";
import { SRI_LANKA_CITIES } from "../constants/cities.js";

const roomRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    whoAmI: {
      type: String,
      required: true,
      enum: ["student", "professional", "family", "other"],
    },
    lookingIn: {
      type: String,
      required: true,
      enum: SRI_LANKA_CITIES,
    },
    subArea: {
      type: String,
    },
    maxBudget: {
      type: Number,
      required: true,
    },
    roomTypePreferred: {
      type: String,
      enum: [
        "single",
        "sharing",
        "annex",
        "boarding",
        "apartment",
        "full_house",
        "short_stay",
        "any",
      ],
      default: "any",
    },
    moveInDate: {
      type: Date,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    mealsNeeded: {
      type: Boolean,
      default: false,
    },
    duration: {
      type: String,
      enum: ["short_term", "long_term"],
      default: "long_term",
    },
    bio: {
      type: String,
    },
    whatsapp: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

roomRequestSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 30 * 24 * 60 * 60 },
);

export const RoomRequest = mongoose.model("RoomRequest", roomRequestSchema);
