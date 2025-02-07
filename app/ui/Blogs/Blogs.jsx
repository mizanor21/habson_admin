"use client";

import Image from "next/image";
import { useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { LuClipboardEdit } from "react-icons/lu";
import BlogModal from "./BlogModal";
import { useRouter } from "next/navigation";

const Blogs = ({ blogs: initialBlogs }) => {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [data, setData] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const router = useRouter();

  const handleOpenModal = (item) => {
    setIsOpenModal(true);
    setData(item);
  };

  const removeBlog = async (id) => {
    const confirm = window.confirm(
      `Are you sure you want to delete this blog?`
    );

    if (confirm) {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/blogs?id=${id}`,
          {
            method: "DELETE",
          }
        );

        if (res.ok) {
          setBlogs(blogs.filter((blog) => blog._id !== id));
          router.refresh(); // Refresh the page to update server-side data
          alert("Blog successfully deleted!");
        } else {
          throw new Error("Failed to delete blog");
        }
      } catch (error) {
        console.error("Error deleting blog:", error);
        alert("Failed to delete blog. Please try again.");
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 gap-y-8 md:gap-y-20">
      {blogs.map((item) => (
        <div key={item._id} className="group">
          <div>
            <Image
              src={item?.img || "/placeholder.svg"}
              alt=""
              width={500}
              height={100}
              className="rounded-xl"
            />
            <div className="flex justify-between items-center">
              <h2 className="text-md lg:text-lg font-extrabold mt-3">
                {item?.title}
              </h2>
              <div className="hidden group-hover:flex gap-3 text-xl">
                <button onClick={() => handleOpenModal(item)}>
                  <LuClipboardEdit />
                </button>
                <button onClick={() => removeBlog(item._id)} className="">
                  <RiDeleteBin6Line />
                </button>
              </div>
            </div>
            <p className="text-[16px] md:text-[20px] mt-3">
              {item?.detailsTitle}
            </p>
          </div>
        </div>
      ))}
      <BlogModal
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        data={data}
        onUpdate={(updatedBlog) => {
          setBlogs(
            blogs.map((blog) =>
              blog._id === updatedBlog._id ? updatedBlog : blog
            )
          );
          router.refresh(); // Refresh the page to update server-side data
        }}
      />
    </div>
  );
};

export default Blogs;
