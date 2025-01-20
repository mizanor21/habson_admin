"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import { ToastContainer } from "react-toastify";

const Edge = () => {
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    title: "",
    description: "",
    buttonText: "",
    buttonLink: "",
    image: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Fetch data from the API
  useEffect(() => {
    fetchEdges();
  }, []);

  const fetchEdges = async () => {
    try {
      const response = await fetch("/api/edge"); // Adjust URL as needed
      const data = await response.json();
      setEdges(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch edge data:", error);
    }
  };

  // Handle input changes in the modal form
  const handleChange = (e) => {
    setModalData({ ...modalData, [e.target.name]: e.target.value });
  };

  // Open modal for creating a new edge
  const openCreateModal = () => {
    setModalData({
      title: "",
      description: "",
      buttonText: "",
      buttonLink: "",
      image: "",
    });
    setIsEdit(false);
    setIsModalOpen(true);
  };

  // Open modal for updating an existing edge
  const openEditModal = (edge) => {
    setModalData({
      title: edge.title,
      description: edge.description.join("\n"),
      buttonText: edge.buttonText,
      buttonLink: edge.buttonLink,
      image: edge.image,
    });
    setIsEdit(true);
    setCurrentId(edge._id);
    setIsModalOpen(true);
  };

  // Create new edge data
  const createEdge = async () => {
    const newEdge = {
      ...modalData,
      description: modalData.description.split("\n"),
    };
    try {
      const response = await fetch("/api/edge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEdge),
      });
      if (response.ok) {
        fetchEdges(); // Refresh data after creation
        setIsModalOpen(false); // Close modal
      }
    } catch (error) {
      console.error("Failed to create edge data:", error);
    }
  };

  // Update edge data by ID
  const updateEdge = async () => {
    const updatedData = {
      ...modalData,
      description: modalData.description.split("\n"),
    };
    try {
      const response = await fetch(`/api/edge/${currentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (response.ok) {
        fetchEdges(); // Refresh data after update
        setIsModalOpen(false); // Close modal
      }
    } catch (error) {
      console.error("Failed to update edge data:", error);
    }
  };

  const deleteEdge = async (id) => {
    try {
      const response = await fetch(`/api/edge?id=${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchEdges(); // Refresh data after deletion
      } else {
        console.error("Failed to delete edge data:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting edge data:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="font-sora px-6 py-12 bg-[#f5f5f5] min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <button
        onClick={openCreateModal}
        className="mb-6 px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition"
      >
        Add New Edge
      </button>

      <div className="grid gap-12">
        {edges.map((edge, index) => (
          <div
            key={edge._id}
            className={`grid md:grid-cols-2 gap-10 p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ${
              index % 2 === 1 ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* Text Content */}
            <div
              className={`flex flex-col justify-center ${
                index % 2 === 0 ? "order-1" : "order-2"
              }`}
            >
              <div className="flex justify-between items-center mb-5">
                <h1 className="text-3xl font-bold text-[#125b5c]">
                  {edge.title}
                </h1>
                <div className="flex gap-4">
                  <button
                    onClick={() => openEditModal(edge)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteEdge(edge._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {edge.description.map((desc, idx) => (
                <p key={idx} className="text-md text-gray-700 mb-4">
                  {desc}
                </p>
              ))}
              <div className="mt-8">
                <Link href={edge.buttonLink}>
                  <button className="flex items-center gap-2 bg-[#125b5c] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#0f4c4c] transition">
                    <span className="text-lg">{edge.buttonText}</span>
                    <MdOutlineArrowRightAlt className="text-2xl" />
                  </button>
                </Link>
              </div>
            </div>

            {/* Image Content */}
            <div
              className={`flex justify-center items-center ${
                index % 2 === 0 ? "order-2" : "order-1"
              }`}
            >
              <img
                src={edge.image}
                alt="Edge Image"
                className="rounded-lg shadow-md w-full max-w-xs md:max-w-full"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-lg w-full shadow-lg">
            <h2 className="text-2xl font-bold mb-4">
              {isEdit ? "Edit Edge" : "Add New Edge"}
            </h2>
            <label className="block mb-2 font-semibold">Title</label>
            <input
              name="title"
              value={modalData.title}
              onChange={handleChange}
              placeholder="Title"
              className="w-full mb-3 p-2 border rounded"
            />
            <label className="block mb-2 font-semibold">
              Description (Separate lines)
            </label>
            <textarea
              name="description"
              value={modalData.description}
              onChange={handleChange}
              placeholder="Description (Separate lines)"
              className="w-full mb-3 p-2 border rounded"
              rows="4"
            />
            <label className="block mb-2 font-semibold">Button Text</label>
            <input
              name="buttonText"
              value={modalData.buttonText}
              onChange={handleChange}
              placeholder="Button Text"
              className="w-full mb-3 p-2 border rounded"
            />
            <label className="block mb-2 font-semibold">Button Link</label>
            <input
              name="buttonLink"
              value={modalData.buttonLink}
              onChange={handleChange}
              placeholder="Button Link"
              className="w-full mb-3 p-2 border rounded"
            />
            <label className="block mb-2 font-semibold">Image URL</label>
            <input
              name="image"
              value={modalData.image}
              onChange={handleChange}
              placeholder="Image URL"
              className="w-full mb-4 p-2 border rounded"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={isEdit ? updateEdge : createEdge}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                {isEdit ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Edge;
