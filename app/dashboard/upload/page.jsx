"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useState } from "react";

export default function ImageUploader() {
  const [imageUrl, setImageUrl] = useState() || null > null;
  const [publicId, setPublicId] = useState() || null > null;
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState() || null > null;

  const handleUpload = async (error, result) => {
    if (error) {
      console.error("Upload error:", error);
      setError("Failed to upload image. Please try again.");
      return;
    }

    if (result?.info?.secure_url && result?.info?.public_id) {
      setIsUploading(true);
      setError(null);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            public_id: result.info.public_id,
            secure_url: result.info.secure_url,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to save image data");
        }

        const data = await res.json();
        console.log("Image saved in MongoDB:", data);

        setImageUrl(result.info.secure_url);
        setPublicId(result.info.public_id);
      } catch (err) {
        console.error("Error saving image data:", err);
        setError("Failed to save image data. Please try again.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Image Uploader</h1>

      <CldUploadWidget uploadPreset="habson" onUpload={handleUpload}>
        {({ open }) => (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => open()}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload Image"}
          </button>
        )}
      </CldUploadWidget>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {imageUrl && (
        <div className="mt-4">
          <p className="font-semibold mb-2">Uploaded Image:</p>
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt="Uploaded image"
            width={300}
            height={200}
            className="rounded-lg shadow-md"
          />
          <p className="mt-2 break-all">
            <span className="font-semibold">URL: </span>
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {imageUrl}
            </a>
          </p>
          <p className="mt-2">
            <span className="font-semibold">Public ID: </span>
            {publicId}
          </p>
        </div>
      )}
    </div>
  );
}
