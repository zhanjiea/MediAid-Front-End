const ConfirmDelete = ({ isOpen, onConfirm, onCancel, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-[90%] sm:w-[400px] text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Confirm Deletion
        </h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-red-600">{itemName}</span>?<br />
          This action cannot be undone.
        </p>
        <div className="flex justify-center gap-4">
          <button
            className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-6 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDelete;
