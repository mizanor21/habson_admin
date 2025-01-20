"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";

const CreateWorkModal = ({ modalId }) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const {
    fields: servicesFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "services",
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/works`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      if (response.ok) {
        toast.success("Work item created successfully");
        reset();
        document.getElementById(modalId).close();
      } else {
        console.error("Error creating work:", result.message);
      }
    } catch (error) {
      console.error("Error with POST request:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <dialog id="createWorkModal" className="modal ">
        <div className="modal-box max-w-[1000px]">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="title">
                Title <span className="text-red-600">*</span>
              </label>
              <input
                {...register("title", { required: "Title is required" })}
                placeholder="Title"
                aria-invalid={errors.title ? "true" : "false"}
                className="rounded-lg px-5 py-2 border border-[#125b5c] w-full"
              />
              {errors.title && (
                <small className="text-red-600">{errors.title.message}</small>
              )}
            </div>

            <div>
              <label htmlFor="detailsTitle">
                Details Title <span className="text-red-600">*</span>
              </label>
              <input
                {...register("detailsTitle", {
                  required: "Details Title is required",
                })}
                placeholder="Details Title"
                aria-invalid={errors.detailsTitle ? "true" : "false"}
                className="rounded-lg px-5 py-2 border border-[#125b5c] w-full"
              />
              {errors.detailsTitle && (
                <small className="text-red-600">
                  {errors.detailsTitle.message}
                </small>
              )}
            </div>

            <div>
              <label htmlFor="serviceDetails">
                Service Details <span className="text-red-600">*</span>
              </label>
              <textarea
                {...register("serviceDetails", {
                  required: "Service Details are required",
                })}
                placeholder="Service Details"
                aria-invalid={errors.serviceDetails ? "true" : "false"}
                className="rounded-lg px-5 py-2 border border-[#125b5c] w-full min-h-[100px]"
              />
              {errors.serviceDetails && (
                <small className="text-red-600">
                  {errors.serviceDetails.message}
                </small>
              )}
            </div>

            <div>
              <label htmlFor="industry">
                Industry <span className="text-red-600">*</span>
              </label>
              <input
                {...register("industry")}
                placeholder="Industry"
                className="rounded-lg px-5 py-2 border border-[#125b5c] w-full"
              />
              {errors.industry && (
                <small className="text-red-600">
                  {errors.industry.message}
                </small>
              )}
            </div>
            <div>
              <label htmlFor="category">
                Category <span className="text-red-600">*</span>
              </label>
              <input
                {...register("category")}
                placeholder="Category"
                className="rounded-lg px-5 py-2 border border-[#125b5c] w-full"
              />
              {errors.industry && (
                <small className="text-red-600">
                  {errors.category.message}
                </small>
              )}
            </div>

            <div>
              <label>
                Services <span className="text-red-600">*</span>
              </label>
              {servicesFields.map((field, index) => (
                <div key={field.id} className="flex space-x-2 mb-2">
                  <input
                    {...register(`services[${index}].serviceName`, {
                      required: "Service Name is required",
                    })}
                    placeholder="Service Name"
                    className="rounded-lg px-5 py-2 border border-[#125b5c] w-full"
                  />
                  <input
                    {...register(`services[${index}].description`, {
                      required: "Description is required",
                    })}
                    placeholder="Service Description"
                    className="rounded-lg px-5 py-2 border border-[#125b5c] w-full"
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="rounded-lg px-5 py-2 border border-red-500 hover:bg-red-500 hover:text-white w-full"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() => append({ serviceName: "", description: "" })}
                className="mt-2 ms-2 px-10 text-black border-2 border-[#125b5c] hover:bg-[#147274] bg-white hover:text-white"
              >
                Add Service
              </Button>
              {errors.services && (
                <small className="text-red-600">
                  {errors.services.message}
                </small>
              )}
            </div>

            <div>
              <label htmlFor="img">
                Thumbnail Image URL <span className="text-red-600">*</span>
              </label>
              <input
                {...register("img", { required: "Image URL is required" })}
                placeholder="Image URL"
                aria-invalid={errors.img ? "true" : "false"}
                className="rounded-lg px-5 py-2 border border-[#125b5c] w-full"
              />
              {errors.img && (
                <small className="text-red-600">{errors.img.message}</small>
              )}
            </div>

            <div>
              <label htmlFor="videoIframeURL">
                YouTube Iframe URL <span className="text-red-600">*</span>
              </label>
              <input
                {...register("videoIframeURL", {
                  required: "VideoIframe URL is required",
                })}
                placeholder="VideoIframe URL"
                aria-invalid={errors.videoIframeURL ? "true" : "false"}
                className="rounded-lg px-5 py-2 border border-[#125b5c] w-full"
              />
              {errors.videoIframeURL && (
                <small className="text-red-600">
                  {errors.videoIframeURL.message}
                </small>
              )}
            </div>

            <div className="w-full flex justify-end items-center">
              <Button
                type="submit"
                className="px-10 bg-[#147274] hover:bg-[#145e60]"
              >
                Create
              </Button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default CreateWorkModal;
