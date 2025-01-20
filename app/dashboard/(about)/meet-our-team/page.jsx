"use client"; // Use this if you're using Next.js app directory
import Image from "next/image";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoIosAddCircle } from "react-icons/io";
import { LiaEditSolid } from "react-icons/lia";
import { RiDeleteBin6Fill } from "react-icons/ri";
import TeamModal from "./TeamModal"; // Adjust the path based on your project structure

const MeetOurTeam = () => {
  const [teams, setTeams] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedTitle, setEditedTitle] = useState("");
  const [editedImage, setEditedImage] = useState("");

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/teams`
        );
        setTeams(response.data);
      } catch (error) {
        console.error("Error fetching team data:", error);
        toast.error("Failed to load team data.");
      }
    };

    fetchTeams();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this team member?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/teams?id=${id}`
      );
      setTeams(teams.filter((team) => team.id !== id));
      toast.success("Team member deleted successfully.");
    } catch (error) {
      console.error("Error deleting team member:", error);
      toast.error("Failed to delete team member.");
    }
  };

  const handleEditClick = (team) => {
    setEditingId(team._id);
    setEditedName(team.name);
    setEditedTitle(team.title);
    setEditedImage(team.image);
    setModalOpen(true); // Open modal for editing
  };

  const handleUpdate = async () => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/teams/${editingId}`,
        {
          name: editedName,
          title: editedTitle,
          image: editedImage,
        }
      );

      setTeams((prevData) =>
        prevData.map((team) =>
          team.id === editingId
            ? {
                ...team,
                name: editedName,
                title: editedTitle,
                image: editedImage,
              }
            : team
        )
      );

      toast.success("Team member data updated successfully.");
      resetForm(); // Exit edit mode
    } catch (error) {
      console.error("Error updating team member data:", error);
      toast.error("Failed to update team member data.");
    }
  };

  const handleAddMember = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/teams`,
        {
          name: editedName,
          title: editedTitle,
          image: editedImage,
        }
      );

      setTeams((prevData) => [...prevData, response.data]);
      toast.success("Team member added successfully.");
      resetForm(); // Close the modal
    } catch (error) {
      console.error("Error adding team member:", error);
      toast.error("Failed to add team member.");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setEditedName("");
    setEditedTitle("");
    setEditedImage("");
    setModalOpen(false);
  };

  const handleSubmit = () => {
    if (editingId) {
      handleUpdate();
    } else {
      handleAddMember();
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => {
            resetForm(); // Reset the form for adding a new member
            setModalOpen(true);
          }}
          className="text-xl bg-green-500 text-white rounded-full p-2 flex items-center"
        >
          <IoIosAddCircle className="mr-2" /> Add Team Member
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 py-10 lg:py-16">
        {teams.map((team) => (
          <div key={team.id} className="text-center group">
            <Image
              width={400}
              height={550}
              className="rounded-2xl hover:scale-105 max-h-[550px] transition duration-300"
              src={team.image}
              alt="person"
            />
            <div className="mt-5">
              <h2 className="text-[24px] font-[600] mt-4 mb-2">{team.name}</h2>
              <h4 className="text-[14px] font-[400]">{team.title}</h4>
            </div>
            <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button
                onClick={() => handleEditClick(team)}
                className="text-xl bg-slate-100 hover:bg-blue-600 hover:text-white duration-500 rounded-full p-2"
              >
                <LiaEditSolid />
              </button>
              <button
                onClick={() => handleDelete(team._id)}
                className="text-xl bg-slate-100 hover:bg-red-600 hover:text-white duration-500 rounded-full p-2"
              >
                <RiDeleteBin6Fill />
              </button>
            </div>
          </div>
        ))}
      </div>

      <TeamModal
        isOpen={modalOpen}
        onClose={resetForm}
        onSubmit={handleSubmit}
        editedName={editedName}
        setEditedName={setEditedName}
        editedTitle={editedTitle}
        setEditedTitle={setEditedTitle}
        editedImage={editedImage}
        setEditedImage={setEditedImage}
      />

      <ToastContainer />
    </div>
  );
};

export default MeetOurTeam;
