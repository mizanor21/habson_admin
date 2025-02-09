"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";

const JobHeroForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [loading, setLoading] = useState(true);
  const [heroId, setHeroId] = useState() || null > null;

  useEffect(() => {
    // Fetch default data from the API
    fetch("/api/job-hero")
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          const heroData = data[0];
          reset(heroData);
          setHeroId(heroData._id);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching job hero data:", error);
        setLoading(false);
      });
  }, [reset]);

  const onSubmit = (data) => {
    if (!heroId) {
      console.error("No hero ID available for update");
      return;
    }

    fetch(`/api/job-hero/${heroId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        toast.success("Data successfully updated!");
        // console.log("Success:", result);
      })
      .catch((error) => {
        toast.error("Failed to update data");
      });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-white p-6 rounded-lg shadow-lg "
    >
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <h2 className="text-2xl font-semibold text-gray-800 text-center">
        Update Job Hero
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Summary */}
        <div className="flex flex-col">
          <label
            htmlFor="summary"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Summary
          </label>
          <input
            className="p-3 rounded-lg border focus:ring-2 focus:ring-indigo-300 outline-none transition-all"
            id="summary"
            placeholder="Enter a brief summary..."
            {...register("summary", { required: "Hero Summary is required" })}
          />
          {errors.summary && (
            <p className="text-sm text-red-500 mt-1">
              {errors.summary.message}
            </p>
          )}
        </div>

        {/* Title */}
        <div className="flex flex-col">
          <label
            htmlFor="title"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Title
          </label>
          <input
            type="text"
            className="p-3 rounded-lg border focus:ring-2 focus:ring-indigo-300 outline-none transition-all"
            id="title"
            placeholder="Enter the title..."
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && (
            <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col">
        <label
          htmlFor="description"
          className="text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          className="p-3 rounded-lg border focus:ring-2 focus:ring-indigo-300 outline-none transition-all"
          id="description"
          rows={4}
          placeholder="Write a short description..."
          {...register("description", { required: "Description is required" })}
        />
        {errors.description && (
          <p className="text-sm text-red-500 mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Image */}
      <div className="flex flex-col">
        <label
          htmlFor="image"
          className="text-sm font-medium text-gray-700 mb-1"
        >
          Background Image URL
        </label>
        <input
          type="url"
          className="p-3 rounded-lg border focus:ring-2 focus:ring-indigo-300 outline-none transition-all"
          id="image"
          placeholder="Paste the image URL..."
          {...register("image", { required: "Job image URL is required" })}
        />
        {errors.image && (
          <p className="text-sm text-red-500 mt-1">{errors.image.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          className="px-6 py-3 text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all"
          type="submit"
        >
          Update Job Hero
        </button>
      </div>
    </form>
  );
};

export default JobHeroForm;
