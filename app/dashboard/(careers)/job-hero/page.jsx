"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

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
        console.log("Success:", result);
      })
      .catch((error) => {
        console.error("Error updating job hero data:", error);
      });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="summary"
            className="block text-sm font-medium text-gray-700"
          >
            Summary
          </label>
          <input
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            id="summary"
            {...register("summary", { required: "Hero Summary is required" })}
          />
          {errors.summary && (
            <p className="mt-1 text-sm text-red-600">
              {errors.summary.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            id="title"
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          id="description"
          rows={3}
          {...register("description", { required: "Description is required" })}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700"
        >
          Background Image URL
        </label>
        <input
          type="url"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          id="image"
          {...register("image", { required: "Job image URL is required" })}
        />
        {errors.image && (
          <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          type="submit"
        >
          Update Job Hero
        </button>
      </div>
    </form>
  );
};

export default JobHeroForm;
