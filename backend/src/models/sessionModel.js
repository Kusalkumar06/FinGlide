import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    refreshTokenHash: {
      type: String,
      required: true,
      index: true,
    },
    userAgent: {
      type: String,
      default: "unknown",
    },
    ipAddress: {
      type: String,
      default: "unknown",
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // MongoDB TTL auto-cleanup
    },
    absoluteExpiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export const SessionModel = mongoose.model("Session", sessionSchema);

