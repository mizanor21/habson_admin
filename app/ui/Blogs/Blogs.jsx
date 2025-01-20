"use client";
import Image from "next/image";
import React, { useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { LuClipboardEdit } from "react-icons/lu";
import BlogModal from "./BlogModal";

const removeBlog = async (id) => {
  const confirm = window.confirm(`Are you sure you want to delete blog?`);

  if (confirm) {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs?id=${id}`, {
      method: "DELETE",
    });
    alert("Successfully Blog deleted!");
  }
};

const Blogs = ({ blogs }) => {
  const [data, setData] = useState(null);

  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleOpenModal = (item) => {
    setIsOpenModal(true);
    setData(item);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 gap-y-8 md:gap-y-20">
      {blogs.map((item) => (
        <div key={item.id} className="group">
          <div>
            <Image
              src={item?.img}
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
                <button
                  onClick={
                    () => handleOpenModal(item)
                    // document.getElementById("blogModal").showModal()
                  }
                >
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
      />
    </div>
  );
};

export default Blogs;
