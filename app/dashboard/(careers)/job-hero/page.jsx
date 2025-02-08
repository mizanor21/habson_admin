"use client";
import React from "react";
import { useForm } from "react-hook-form";

const JobHeroForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    // Add your update logic here
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex gap-5">
        <div>
          <label htmlFor="title">Summary</label>
          <input
            className="rounded-lg px-5 py-2 border border-b-4 border-[#125b5c] w-full min-h-[100px]"
            id="summary"
            {...register("summary", { required: "Job Summary is required" })}
          />
          {errors.summary && <p>{errors.summary.message}</p>}
        </div>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            className="rounded-lg px-5 py-2 border border-b-4 border-[#125b5c] w-full min-h-[100px]"
            id="title"
            {...register("title", { required: "Job title is required" })}
          />
          {errors.title && <p>{errors.title.message}</p>}
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea
            className="rounded-lg px-5 py-2 border border-b-4 border-[#125b5c] w-full min-h-[100px]"
            id="description"
            {...register("description", {
              required: "Job description is required",
            })}
          />
          {errors.description && <p>{errors.description.message}</p>}
        </div>
        <div>
          <label htmlFor="description">Background Image</label>
          <input
            type="url"
            className="rounded-lg px-5 py-2 border border-b-4 border-[#125b5c] w-full min-h-[100px]"
            id="image"
            {...register("image", {
              required: "Job image is required",
            })}
          />
          {errors.image && <p>{errors.image.message}</p>}
        </div>
      </div>
      <div className="flex justify-end">
        <button
          className="btn px-10 bg-[#147274] hover:bg-[#145e60] text-white"
          type="submit"
        >
          Update Job Hero
        </button>
      </div>
    </form>
  );
};

export default JobHeroForm;
