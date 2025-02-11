"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";

const WorkModal = ({ workId, modalId, updateWork }) => {
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const {
    fields: servicesFields,
    append,
    remove,
    replace,
  } = useFieldArray({
    control,
    name: "services",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!workId) return;

    const fetchWorkData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/works/${workId}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error fetching work data:", errorData.message);
          return;
        }

        const { work } = await response.json();

        Object.keys(work).forEach((key) => setValue(key, work[key]));

        if (Array.isArray(work.services)) {
          replace(
            work.services.map(({ serviceName, description }) => ({
              serviceName,
              description,
            }))
          );
        }
      } catch (error) {
        console.error("Network error fetching work data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkData();
  }, [workId, setValue, replace]);

  const onSubmit = async (data) => {
    if (!workId) return;

    const services = data.services.filter(
      (service) => service.serviceName && service.description
    );

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/works/${workId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: data.title,
            detailsTitle: data.detailsTitle,
            category: data.category,
            services,
            serviceDetails: data.serviceDetails,
            industry: data.industry,
            img: data.img,
            videoIframeURL: data.videoIframeURL,
            isTrending: data.isTrending,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error(
          "Failed to update work:",
          errorData.message || "Unknown error"
        );
        return;
      }

      const result = await response.json();
      updateWork(result);
      toast.success("Work updated successfully.");

      const modal = document.getElementById(modalId);
      if (modal) modal.close();
    } catch (error) {
      console.error("Error updating work:", error.message);
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
            <h3 className="font-bold text-lg">Edit Work Item</h3>
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
              <select
                {...register("category", { required: "Category is required" })}
                className="select select-bordered"
              >
                <option value="">Select a category</option>
                <option value="Casestudy">Casestudy</option>
                <option value="Daily Creativity">Daily Creativity</option>
              </select>
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
            <div className="form-control">
              <label className="cursor-pointer label">
                <span className="label-text">This work is trending?</span>
                <input
                  type="checkbox"
                  {...register("isTrending")}
                  className="toggle toggle-primary"
                />
              </label>
            </div>
            <div className="w-full flex justify-end items-center">
              <Button
                type="submit"
                className="px-10 bg-[#147274] hover:bg-[#145e60]"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default WorkModal;
