"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { LuClipboardEdit } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import WorkModal from "./WorkModal";
import { Button } from "@/components/ui/button";
import CreateWorkModal from "./CreateWorkModal";

const Works = ({ works }) => {
  const router = useRouter();
  const [workId, setWorkId] = useState("");

  const removeWork = async (id) => {
    const confirm = window.confirm(
      `Are you sure you want to delete work item?`
    );

    if (confirm) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/works?id=${id}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        router.refresh();
        alert("Successfully work item deleted!");
      }
    }
  };
  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button
          className="px-10 bg-[#147274] hover:bg-[#145e60]"
          onClick={() => document.getElementById("createWorkModal").showModal()}
        >
          Create Work
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-5 gap-y-8 md:gap-y-10">
        {works.map((item) => (
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
                <div className="hidden group-hover:flex gap-3">
                  <button
                    onClick={() => {
                      document.getElementById("workModal").showModal();
                      setWorkId(item._id);
                    }}
                  >
                    <LuClipboardEdit />
                  </button>
                  <button className="" onClick={() => removeWork(item._id)}>
                    <RiDeleteBin6Line />
                  </button>
                </div>
                <WorkModal workId={workId} modalId={"workModal"} />
              </div>
              <p className="text-[16px] md:text-[20px] mt-3">
                {item?.detailsTitle}
              </p>
            </div>
          </div>
        ))}

        <CreateWorkModal modalId={"createWorkModal"} />
      </div>
    </div>
  );
};

export default Works;
