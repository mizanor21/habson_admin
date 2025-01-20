import React from "react";

const PartnerModal = ({
  isOpen,
  onClose,
  onSubmit,
  editedName,
  setEditedName,
  editedDescription,
  setEditedDescription,
  editedLogo,
  setEditedLogo,
}) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-lg font-bold mb-4">Add New Partner</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={editedLogo}
            onChange={(e) => setEditedLogo(e.target.value)}
            placeholder="Logo URL"
            className="border-b mb-4 w-full focus:outline-none"
            required
          />
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            placeholder="Partner Name"
            className="border-b mb-4 w-full focus:outline-none"
            required
          />
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            placeholder="Description"
            className="border-b mb-4 w-full focus:outline-none"
            required
          />
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-black px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add Partner
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PartnerModal;
