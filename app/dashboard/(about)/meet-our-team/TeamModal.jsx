"use client";
import React, { useState } from "react";

const TeamModal = ({
  isOpen,
  onClose,
  onSubmit,
  editedName,
  setEditedName,
  editedTitle,
  setEditedTitle,
  editedImage,
  setEditedImage,
}) => {
  const [file, setFile] = useState(null); // For image file
  const [imagePreview, setImagePreview] = useState(null); // For image preview
  const [uploading, setUploading] = useState(false); // For upload loading state

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "habson"); // Replace with your Cloudinary upload preset

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dov6k7xdk/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      return data.secure_url; // Return the secure URL
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile)); // Set image preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = editedImage;

      // Upload new image if a file is selected
      if (file) {
        imageUrl = await uploadImage(file);
        if (!imageUrl) return; // Stop if upload fails
      }

      setEditedImage(imageUrl); // Update the image URL
      onSubmit(); // Call the parent's submit handler
    } catch (error) {
      console.error("Error saving team member:", error);
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-5 rounded-lg">
        <h2 className="text-xl font-bold">Add/Edit Team Member</h2>
        <form onSubmit={handleSubmit}>
          {/* Image Upload */}
          <label className="block mb-2 font-semibold">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border-b mb-4 p-2 w-full"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mb-4 rounded-lg w-full max-w-xs"
            />
          )}

          <input
            type="text"
            placeholder="Name"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            className="border-b mb-4 p-2 w-full"
          />
          <input
            type="text"
            placeholder="Title"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="border-b mb-4 p-2 w-full"
          />
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="mr-2 bg-gray-500 text-white p-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamModal;