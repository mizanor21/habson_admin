"use client";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import axios from "axios";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HeroSection = ({ data, id }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: data?.title || "",
      shortDescription: data?.shortDescription || "",
      image: data?.image || "",
    },
  });

  useEffect(() => {
    console.log("Updating form values with new data"); // Log whenever data is updated
    reset({
      title: data?.title || "",
      shortDescription: data?.shortDescription || "",
      image: data?.image || "",
    });
  }, [data, reset]);

  // Frontend patch request without file upload
  const onSubmit = async (formData) => {
    try {
      const payload = {
        "heroSection.title": formData.title,
        "heroSection.shortDescription": formData.shortDescription,
        "heroSection.image": formData.image,
      };

      const headers = { "Content-Type": "application/json" };

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/home/${id}`,
        payload,
        { headers }
      );

      alert("Hero Section data updated successfully!");

      // Display success notification
      // toast.success("Hero Section data updated successfully!", {
      //   position: "top-right",
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      // });
    } catch (error) {
      console.error(
        "Error updating data:",
        error.response?.data || error.message
      );

      // Display error notification
      toast.error("Failed to update Hero Section data.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const renderError = (error) =>
    error && (
      <small className="text-[12px] text-red-600" role="alert">
        {error.message}
      </small>
    );

  return (
    <div>
      <ToastContainer /> {/* Toast container to display notifications */}
      <div className="relative rounded-lg bg-white p-[2%] shadow-md">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold uppercase">Hero Section</h3>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <div className="grid grid-cols-3 gap-5">
            <div className="w-full">
              <label>
                Title <span className="text-red-600">*</span>
              </label>
              <textarea
                {...register("title", { required: "Title is required" })}
                placeholder="Title"
                defaultValue={data?.title || ""}
                className="rounded-lg px-5 py-2 border border-b-4 border-[#125b5c] w-full min-h-[100px]"
              />
              {renderError(errors.title)}
            </div>
            <div className="w-full">
              <label>
                Short Description <span className="text-red-600">*</span>
              </label>
              <textarea
                {...register("shortDescription", {
                  required: "Short Description is required",
                })}
                placeholder="Short Description"
                defaultValue={data?.shortDescription || ""}
                className="rounded-lg px-5 py-2 border border-b-4 border-[#125b5c] w-full min-h-[100px]"
              />
              {renderError(errors.shortDescription)}
            </div>
            <div className="w-full">
              <label>
                Hero Image <span className="text-red-600">*</span>
              </label>
              <input
                {...register("image", {
                  required: "Hero Image URL is required",
                  pattern: {
                    value: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/,
                    message: "Please enter a valid image URL",
                  },
                })}
                placeholder="Hero image"
                defaultValue={data?.image || ""}
                type="url"
                className="rounded-lg px-5 py-2 border border-b-4 border-[#125b5c] w-full"
              />
              {renderError(errors.image)}
            </div>
          </div>
          <div className="w-full flex justify-end items-center mt-4">
            <Button
              type="submit"
              className="px-10 bg-[#147274] hover:bg-[#145e60]"
            >
              Save
            </Button>
          </div>
        </form>
        <BorderBeam size={250} duration={12} delay={9} />
      </div>
    </div>
  );
};

export default HeroSection;
