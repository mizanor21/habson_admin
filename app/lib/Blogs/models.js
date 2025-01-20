import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
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
    isActive: Boolean,
  },
  { timestamps: true }
);

export const Blogs =
  mongoose.models.Blogs || mongoose.model("Blogs", blogSchema);
