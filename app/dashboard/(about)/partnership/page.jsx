"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoIosAddCircle } from "react-icons/io";
import { LiaEditSolid } from "react-icons/lia";
import { RiDeleteBin6Fill } from "react-icons/ri";
import PartnerModal from "./PartnerModal";
// import Modal from "./components/Modal"; // Adjust the path based on your project structure

const Partnership = () => {
  const [partnersData, setPartnersData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedLogo, setEditedLogo] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/partnership`
        );
        setPartnersData(response.data);
      } catch (error) {
        console.error("Error fetching partner data:", error);
        toast.error("Failed to load partner data.");
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this partner?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/partnership?id=${id}`
      );
      setPartnersData(partnersData.filter((partner) => partner._id !== id));
      toast.success("Partner deleted successfully.");
    } catch (error) {
      console.error("Error deleting partner:", error);
      toast.error("Failed to delete partner.");
    }
  };

  const handleEditClick = (partner) => {
    setEditingId(partner._id);
    setEditedName(partner.name);
    setEditedDescription(partner.description);
    setEditedLogo(partner?.logo);
  };

  const handleUpdate = async (id) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/partnership/${id}`,
        {
          name: editedName,
          description: editedDescription,
          logo: editedLogo,
        }
      );

      // Immediately update the local state with the new data
      setPartnersData((prevData) =>
        prevData.map((partner) =>
          partner._id === id
            ? {
                ...partner,
                name: editedName,
                description: editedDescription,
                logo: editedLogo,
              }
            : partner
        )
      );

      toast.success("Partner data updated successfully.");
      setEditingId(null); // Exit edit mode
    } catch (error) {
      console.error("Error updating partner data:", error);
      toast.error("Failed to update partner data.");
    }
  };

  // Handle adding a new partner
  const handleAddPartner = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/partnership`,
        {
          name: editedName,
          description: editedDescription,
          logo: editedLogo,
        }
      );

      // Immediately add the new partner to local state
      setPartnersData((prevData) => [...prevData, response.data]);
      toast.success("Partner added successfully.");

      // Close the modal and clear input fields after adding
      setModalOpen(false);
      setEditedName("");
      setEditedDescription("");
      setEditedLogo("");
    } catch (error) {
      console.error("Error adding partner:", error);
      toast.error("Failed to add partner.");
    }
  };

  return (
    <div className="bg-white py-10 rounded-[20px] font-sora">
      <div className="p-[3%]">
        <div className="flex justify-end">
          <button
            onClick={() => setModalOpen(true)}
            className="mb-4 text-xl bg-[#14797b] hover:bg-[#296e6f] text-white rounded-full px-8 py-3 flex items-center"
          >
            <IoIosAddCircle className="mr-2" /> Add Partner
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12 items-center text-center justify-center mt-5">
          {partnersData.map((partner) => (
            <div key={partner._id} className="text-center group">
              {editingId === partner._id ? (
                <input
                  type="text"
                  value={editedLogo}
                  onChange={(e) => setEditedLogo(e.target.value)}
                  className="text-[20px] tracking-tighter font-bold text-black mb-2 mt-10 border-b focus:outline-none"
                  placeholder="Logo URL"
                />
              ) : (
                <Image
                  width={200}
                  height={200}
                  src={partner?.logo}
                  alt={`${partner?.name} Logo`}
                  className="mx-auto mb-2 h-16 object-contain saturate-0 group-hover:saturate-100"
                />
              )}

              {editingId === partner._id ? (
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="text-[20px] tracking-tighter font-bold text-black mb-2 mt-10 border-b focus:outline-none"
                  autoFocus
                />
              ) : (
                <h3
                  className="text-[20px] tracking-tighter font-bold text-black mb-2 mt-10 cursor-pointer"
                  onClick={() => handleEditClick(partner)}
                >
                  {partner.name}
                </h3>
              )}

              {editingId === partner._id ? (
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="text-black opacity-75 text-[15px] font-[400] mb-2 border-b focus:outline-none"
                  placeholder="Description"
                />
              ) : (
                <p className="text-black opacity-75 text-[15px] font-[400] mb-2">
                  {partner.description}
                </p>
              )}

              <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => {
                    if (editingId === partner._id) {
                      handleUpdate(partner._id);
                    } else {
                      handleEditClick(partner);
                    }
                  }}
                  className="text-xl bg-slate-100 hover:bg-blue-600 hover:text-white duration-500 rounded-full p-2"
                >
                  <LiaEditSolid />
                </button>
                <button
                  onClick={() => handleDelete(partner._id)}
                  className="text-xl bg-slate-100 hover:bg-red-600 hover:text-white duration-500 rounded-full p-2"
                >
                  <RiDeleteBin6Fill />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <PartnerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddPartner}
        editedName={editedName}
        setEditedName={setEditedName}
        editedDescription={editedDescription}
        setEditedDescription={setEditedDescription}
        editedLogo={editedLogo}
        setEditedLogo={setEditedLogo}
      />

      <ToastContainer />
    </div>
  );
};

export default Partnership;
