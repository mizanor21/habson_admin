import mongoose from "mongoose";

const workSchema = new mongoose.Schema(
  {
    id: Number,
    category: String,
    thumbnail: String,
    title: String,
    detailsTitle: String,
    services: [
      {
        serviceName: String,
        description: String,
      },
    ],
    serviceDetails: String,
    industry: String,
    img: String,
    videoIframeURL: String,
    isActive: Boolean,
  },
  { timestamps: true }
);

export const Works =
  mongoose.models.Works || mongoose.model("Works", workSchema);
