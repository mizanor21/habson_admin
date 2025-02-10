import mongoose from "mongoose";

const ContactImgSchema = new mongoose.Schema(
  {
    contactImage: { type: String },
  },
  { timestamps: true }
);

export const ContactImg =
  mongoose.models.ContactImg || mongoose.model("ContactImg", ContactImgSchema);
