import React from "react";

const TeamModal = ({
  isOpen,
  onClose,
  onSubmit,
  editedName,
  setEditedName,
  editedTitle,
  setEditedTitle,
  editedImage,
  setEditedImage,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-5 rounded-lg">
        <h2 className="text-xl font-bold">Add/Edit Team Member</h2>
        <input
          type="text"
          placeholder="Name"
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          className="border-b mb-4 p-2 w-full"
        />
        <input
          type="text"
          placeholder="Title"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          className="border-b mb-4 p-2 w-full"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={editedImage}
          onChange={(e) => setEditedImage(e.target.value)}
          className="border-b mb-4 p-2 w-full"
        />
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mr-2 bg-gray-500 text-white p-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamModal;
