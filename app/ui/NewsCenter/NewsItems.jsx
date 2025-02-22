"use client";
import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const SkeletonLoader = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 gap-y-8 md:gap-y-20">
    {[1, 2, 3].map((key) => (
      <div key={key} className="space-y-3">
        <div className="h-72 w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl animate-pulse"></div>
        <div className="h-6 w-1/2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md animate-pulse"></div>
        <div className="h-4 w-3/4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md animate-pulse"></div>
      </div>
    ))}
  </div>
);

const NewsItems = ({ data, setData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  if (!data) {
    return <SkeletonLoader />;
  }

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setValue("category", item.category);
    setValue("title", item.title);
    setValue("img", item.img);
    setValue("description", item.description || "");
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedItem(null);
    reset();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    reset();
  };

  const handleImageUpload = async (file) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "habson"); // Replace with your Cloudinary upload preset

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dov6k7xdk/image/upload", // Replace with your Cloudinary cloud name
        formData
      );
      setIsUploading(false);
      return response.data.secure_url; // Return the uploaded image URL
    } catch (error) {
      setIsUploading(false);
      toast.error("Image upload failed. Please try again.");
      return null;
    }
  };

  const onSubmit = async (formData) => {
    try {
      let updatedItem;
      if (selectedItem) {
        // PATCH request for updating an existing item
        const { data: response } = await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/news-center/${selectedItem._id}`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        updatedItem = response;
      } else {
        // POST request for adding a new item
        const { data: response } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/news-center`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        updatedItem = response;
      }

      // Notify the user of success
      alert(`News item ${selectedItem ? "updated" : "added"} successfully!`);

      // Update local data
      if (selectedItem) {
        const updatedData = data.map((item) =>
          item._id === updatedItem._id ? updatedItem : item
        );
        setData(updatedData);
      } else {
        setData([...data, updatedItem]);
      }
      handleCloseModal();
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/news-center?id=${id}`);
        setData(data.filter((item) => item._id !== id)); // Remove the deleted item from the local state
      } catch (error) {
        Swal.fire("Deleted!", "Your news item has been deleted.", "success");
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">News Items</h1>
        <button onClick={() => handleAdd()} className="btn px-10 py-2">
          Add News
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 gap-y-10">
        {data.map((item) => (
          <div key={item._id} className="relative">
            <div>
              <Image
                src={item.img}
                alt={item.title}
                width={600}
                height={100}
                className="rounded-xl object-cover"
              />
              <p className="text-[16px] font-medium text-black mt-2">
                {item.title}
              </p>
            </div>
            <button
              className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 transition-all"
              onClick={() => handleEditClick(item)}
            >
              Edit
            </button>
            <button
              className="absolute top-2 right-20 bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition-all"
              onClick={() => handleDelete(item._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-11/12 md:w-2/3 lg:w-1/2 relative">
            <button
              className="absolute top-4 right-4 text-white bg-red-500 p-2 rounded-full hover:bg-red-600 focus:outline-none"
              onClick={handleCloseModal}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-6">{selectedItem ? "Edit" : "Add"} News Item</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium">
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  {...register("category", { required: "Category is required" })}
                  className={`mt-1 w-full px-4 py-2 bg-gray-50 border ${
                    errors.category ? "border-red-500" : "border-gray-300"
                  } rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                    errors.category ? "focus:ring-red-500" : "focus:ring-blue-500"
                  }`}
                />
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.category.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  {...register("title", { required: "Title is required" })}
                  className={`mt-1 w-full px-4 py-2 bg-gray-50 border ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  } rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                    errors.title ? "focus:ring-red-500" : "focus:ring-blue-500"
                  }`}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="img" className="block text-sm font-medium">
                  Image
                </label>
                <input
                  type="file"
                  id="img"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const imageUrl = await handleImageUpload(file);
                      if (imageUrl) {
                        setValue("img", imageUrl);
                      }
                    }
                  }}
                />
                {isUploading && <p>Uploading image...</p>}
              </div>
              <div className="mb-6">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  rows="4"
                  {...register("description", {
                    required: "Description is required",
                  })}
                  className={`mt-1 w-full px-4 py-2 bg-gray-50 border ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  } rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                    errors.description
                      ? "focus:ring-red-500"
                      : "focus:ring-blue-500"
                  }`}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-4 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-all"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white px-4 py-2 rounded-md hover:shadow-lg transition-all"
                >
                  {selectedItem ? "Save Changes" : "Add News"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsItems;