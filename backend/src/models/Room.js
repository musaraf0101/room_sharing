import mongoose from "mongoose";
import { SRI_LANKA_CITIES } from "../constants/cities.js";

const roomSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roomType: {
      type: String,
      required: true,
      enum: [
        "single",
        "sharing",
        "annex",
        "boarding",
        "apartment",
        "full_house",
        "short_stay",
        "rental",
      ],
    },
    location: {
      type: String,
      required: true,
      enum: SRI_LANKA_CITIES,
    },
    subArea: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    securityDeposit: {
      type: Number,
      default: 0,
    },
    utilities: {
      water: { type: Boolean, default: false },
      electricity: { type: Boolean, default: false },
      wifi: { type: Boolean, default: false },
      meals: { type: Boolean, default: false },
    },
    genderPreference: {
      type: String,
      enum: ["male", "female", "any"],
      default: "any",
    },
    suitableFor: {
      type: String,
      enum: ["students", "professionals", "families", "anyone"],
      default: "anyone",
    },
    availableFrom: {
      type: Date,
    },
    houseRules: {
      type: String,
    },
    whatsapp: {
      type: String,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    mediaIDs: [
      {
        url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true },
);

roomSchema.index({ createdAt: 1 });

export const Room = mongoose.model("Room", roomSchema);
