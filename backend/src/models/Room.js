import mongoose from "mongoose";

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
      enum: ["sharing", "rentel"],
    },
    location: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true },
);

roomSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

export const Room = mongoose.model("Room", roomSchema);
