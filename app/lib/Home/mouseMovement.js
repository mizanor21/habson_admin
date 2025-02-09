import mongoose, { Schema } from "mongoose";

const mouseMovementSchema = new mongoose.Schema({
  id: { type: String },
  path: { type: String },
  title: { type: String, required: true },
  content: { type: String, required: true },
});

export const MouseMovement =
  mongoose.models.MouseMovement ||
  mongoose.model("MouseMovement", mouseMovementSchema);
