"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";

const WorkModal = ({ workId, modalId }) => {
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
    if (!workId) return; // Exit early if no workId is provided

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

        // Populate form fields with fetched data
        Object.keys(work).forEach((key) => setValue(key, work[key]));

        // Update services if they exist
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
    if (!workId) return; // Ensure workId is provided

    // Validate essential fields before sending the request
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
            thumbnail: data.thumbnail,
            category: data.category,
            services,
            serviceDetails: data.serviceDetails,
            industry: data.industry,
            img: data.img,
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
      toast.success("Work updated successfully.");

      // Only close modal if it exists
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
      <dialog id="workModal" className="modal ">
        <div className="modal-box max-w-[1000px]">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Title Input */}
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

            {/* Details Title Input */}
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

            {/* Service Details Textarea */}
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

            {/* Services Section */}
            <div>
              <label>
                Services <span className="text-red-600">*</span>
              </label>
              {servicesFields?.map((field, index) => (
                <div key={field.id} className="space-y-2">
                  <input
                    {...register(`services.${index}.serviceName`, {
                      required: "Service name is required",
                    })}
                    placeholder={`Service Name ${index + 1}`}
                    aria-invalid={
                      errors.services?.[index]?.serviceName ? "true" : "false"
                    }
                    className="rounded-lg px-5 py-2 border border-[#125b5c] w-full"
                  />
                  <input
                    {...register(`services.${index}.description`, {
                      required: "Service description is required",
                    })}
                    placeholder={`Service Description ${index + 1}`}
                    aria-invalid={
                      errors.services?.[index]?.description ? "true" : "false"
                    }
                    className="rounded-lg px-5 py-2 border border-[#125b5c] w-full"
                  />
                  <button
                    type="button"
                    className="my-2 rounded px-2 py-1 text-red-600 border-2 border-[#125b5c]"
                    onClick={() => remove(index)}
                  >
                    X
                  </button>
                  {errors.services?.[index] && (
                    <small className="text-red-600">
                      {errors.services[index]?.serviceName?.message ||
                        errors.services[index]?.description?.message}
                    </small>
                  )}
                </div>
              ))}
              <Button
                type="button"
                onClick={() => append({ serviceName: "", description: "" })}
                className="mt-2 ms-2 px-10 text-black border-2 border-[#125b5c] hover:bg-[#147274] bg-white hover:text-white"
              >
                Add Service
              </Button>
            </div>

            {/* Thumbnail Image URL */}
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

            {/* Submit Button */}
            <div className="w-full flex justify-end items-center">
              <Button
                type="submit"
                className="px-10 bg-[#147274] hover:bg-[#145e60]"
              >
                Save
              </Button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default WorkModal;
