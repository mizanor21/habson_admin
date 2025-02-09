"use client";

import { useState, useEffect } from "react";
import { AiFillEdit } from "react-icons/ai";
import { RiDeleteBin6Fill } from "react-icons/ri";

const MouseMovementCRUD = () => {
  const [mouseMovementData, setMouseMovementData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  useEffect(() => {
    fetchMouseMovementData();
  }, []);

  const fetchMouseMovementData = async () => {
    try {
      const res = await fetch("/api/mouse-movement");
      if (!res.ok) {
        throw new Error("Failed to fetch mouse movement data");
      }
      const data = await res.json();
      setMouseMovementData(data);
    } catch (error) {
      console.error("Error fetching mouse movement data:", error);
    }
  };

  const handleAddItem = () => {
    setCurrentItem(null);
    setIsModalOpen(true);
  };

  const handleEditItem = (item) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const res = await fetch(`/api/mouse-movement?id=${id}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          throw new Error("Failed to delete item");
        }
        fetchMouseMovementData();
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const url = currentItem
        ? `/api/mouse-movement/${currentItem._id}`
        : "/api/mouse-movement";
      const method = currentItem ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        throw new Error("Failed to save item");
      }
      fetchMouseMovementData();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  const Modal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState(
      initialData || { title: "", content: "" }
    );

    useEffect(() => {
      setFormData(initialData || { title: "", content: "" });
    }, [initialData]);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-5 rounded">
          <h2 className="text-xl font-bold mb-4">
            {initialData ? "Edit Item" : "Add Item"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Content</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="w-full border p-2"
              />
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={onClose} className="btn mr-2">
                Cancel
              </button>
              <button type="submit" className="btn">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold py-10">Mouse Movement</h1>
        <button className="btn" onClick={handleAddItem}>
          Add Item
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {mouseMovementData.map((mouseMovement) => (
          <div
            key={mouseMovement._id}
            className="border p-10 text-center relative group"
          >
            <div>
              <p className="text-3xl font-bold pb-3">{mouseMovement.title}</p>
              <p>{mouseMovement.content}</p>
            </div>
            <div className="absolute top-0 right-0 p-2 hidden group-hover:block">
              <button
                className="mr-2 hover:text-blue-500"
                onClick={() => handleEditItem(mouseMovement)}
              >
                <AiFillEdit />
              </button>
              <button
                className="hover:text-red-500"
                onClick={() => handleDeleteItem(mouseMovement._id)}
              >
                <RiDeleteBin6Fill />
              </button>
            </div>
          </div>
        ))}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={currentItem}
      />
    </div>
  );
};

export default MouseMovementCRUD;
