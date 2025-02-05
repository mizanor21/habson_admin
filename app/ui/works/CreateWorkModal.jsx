"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";

const CreateWorkModal = ({ modalId, addWork }) => {
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
        addWork(result);
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
      <dialog id={modalId} className="modal">
        <div className="modal-box max-w-[1000px]">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <h3 className="font-bold text-lg">Create Work Item</h3>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                type="text"
                {...register("title", { required: "Title is required" })}
                className="input input-bordered"
              />
              {errors.title && (
                <span className="text-red-500">{errors.title.message}</span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Details Title</span>
              </label>
              <input
                type="text"
                {...register("detailsTitle", {
                  required: "Details title is required",
                })}
                className="input input-bordered"
              />
              {errors.detailsTitle && (
                <span className="text-red-500">
                  {errors.detailsTitle.message}
                </span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Category</span>
              </label>
              <input
                type="text"
                {...register("category", { required: "Category is required" })}
                className="input input-bordered"
              />
              {errors.category && (
                <span className="text-red-500">{errors.category.message}</span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Industry</span>
              </label>
              <input
                type="text"
                {...register("industry", { required: "Industry is required" })}
                className="input input-bordered"
              />
              {errors.industry && (
                <span className="text-red-500">{errors.industry.message}</span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Image URL</span>
              </label>
              <input
                type="url"
                {...register("img", { required: "Image URL is required" })}
                className="input input-bordered"
              />
              {errors.img && (
                <span className="text-red-500">{errors.img.message}</span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Video Iframe URL</span>
              </label>
              <input
                type="url"
                {...register("videoIframeURL", {
                  required: "Video Iframe URL is required",
                })}
                className="input input-bordered"
              />
              {errors.videoIframeURL && (
                <span className="text-red-500">
                  {errors.videoIframeURL.message}
                </span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Service Details</span>
              </label>
              <textarea
                {...register("serviceDetails", {
                  required: "Service details are required",
                })}
                className="textarea textarea-bordered"
                rows={4}
              ></textarea>
              {errors.serviceDetails && (
                <span className="text-red-500">
                  {errors.serviceDetails.message}
                </span>
              )}
            </div>
            <div>
              <label className="label">
                <span className="label-text">Services</span>
              </label>
              {servicesFields.map((field, index) => (
                <div key={field.id} className="flex space-x-2 mb-2">
                  <input
                    {...register(`services.${index}.serviceName`, {
                      required: "Service name is required",
                    })}
                    placeholder="Service Name"
                    className="input input-bordered flex-grow"
                  />
                  <input
                    {...register(`services.${index}.description`, {
                      required: "Service description is required",
                    })}
                    placeholder="Service Description"
                    className="input input-bordered flex-grow"
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="btn btn-error"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => append({ serviceName: "", description: "" })}
                className="btn btn-secondary mt-2"
              >
                Add Service
              </button>
            </div>
            <div className="w-full flex justify-end items-center">
              <Button
                type="submit"
                className="px-10 bg-[#147274] hover:bg-[#145e60]"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create"}
              </Button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default CreateWorkModal;
