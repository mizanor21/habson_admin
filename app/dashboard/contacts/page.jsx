"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AiOutlineDelete } from "react-icons/ai";
import ContactImageForm from "./ContactImageForm";

const Contacts = () => {
  const [contactImg, setContactImg] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch contact images on component mount
  useEffect(() => {
    const fetchContactImages = async () => {
      try {
        const res = await fetch("/api/contact-img");
        const data = await res.json();
        setContactImg(data);
      } catch (error) {
        console.error("Failed to fetch contact images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactImages();
  }, []);

  // Handle delete functionality
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this image?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/contact-img?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove the deleted item from the state
        setContactImg((prev) => prev.filter((item) => item._id !== id));
      } else {
        console.error("Failed to delete contact image");
      }
    } catch (error) {
      console.error("Error deleting contact image:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-3xl font-bold uppercase">Contact Images</h1>
      </div>
      <ContactImageForm />
      <div className="grid grid-cols-3 gap-3">
        {contactImg.map((item) => (
          <div key={item._id} className="relative group">
            <Image
              width={500}
              height={500}
              src={item.img}
              alt="contact"
              className="w-full h-auto"
            />
            <div className="absolute hidden right-5 top-5 group-hover:flex">
              <button
                onClick={() => handleDelete(item._id)}
                className="bg-white p-2 rounded-full hover:bg-red-500 hover:text-white transition-all duration-500"
              >
                <AiOutlineDelete size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contacts;