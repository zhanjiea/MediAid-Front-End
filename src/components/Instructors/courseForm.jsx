import { useState, useEffect } from "react";

const CourseForm = ({ onClose, initialValues = null }) => {
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState("");
  const [badge, setBadge] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [material, setMaterial] = useState(null);

  // Prefill when editing
  useEffect(() => {
    if (initialValues) {
      setCourseName(initialValues.title || initialValues.courseName || "");
      setDescription(initialValues.description || "");
      setDetails(initialValues.details || "");
      setBadge(initialValues.badge || "");
      // coverImage/material are files; keep as null — we store filenames when uploading
    }
  }, [initialValues]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Build payload to send to backend (or console.log while backend not available)
    const payload = {
      id: initialValues && initialValues.id ? initialValues.id : Date.now(),
      title: courseName,
      courseName,
      description,
      details,
      badge,
      coverImage: coverImage ? coverImage.name : (initialValues && initialValues.coverImage) || "",
      material: material ? material.name : (initialValues && initialValues.material) || "",
    };

    // Instead of writing to localStorage, send payload to backend.
    // Backend not implemented yet — log JSON payload so you can copy/send later.
    console.log("Course payload to send to server:\n", JSON.stringify(payload, null, 2));

    // Optional: clear the form
    setCourseName("");
    setDescription("");
    setBadge("");
    setCoverImage(null);
    setMaterial(null);

    // Close the form after submission
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 bg-[rgba(247,245,250,0.70)] flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl w-full mx-4 relative h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-[#0A033C]">Course</h1>
            <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                >×
            </button>
        </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 overflow-y-auto flex-1">
        {/* Course Name */}
        <div>
          <label className="block font-semibold mb-2">Course Name:</label>
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            required
            className="w-full p-3 bg-gray-100 rounded-lg outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold mb-2">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full p-3 bg-gray-100 rounded-lg outline-none min-h-16"
          ></textarea>
        </div>

        {/* Content */}
        <div>
          <label className="block font-semibold mb-2">Course Content:</label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            required
            className="w-full p-3 bg-gray-100 rounded-lg outline-none min-h-[120px]"
          ></textarea>
        </div>

        {/* Badge */}
        <div>
          <label className="block font-semibold mb-2">Badge:</label>
          <select
            value={badge}
            onChange={(e) => setBadge(e.target.value)}
            className="w-full p-3 bg-gray-100 rounded-lg outline-none"
            required
          >
            <option value="">Select a badge</option>
            <option value="Bronze">Bronze</option>
            <option value="Silver">Silver</option>
            <option value="Gold">Gold</option>
          </select>
        </div>

        {/* Cover Image */}
        <div>
          <label className="block font-semibold mb-2">Cover Image:</label>
          <div className="bg-gray-100 p-5 rounded-lg text-center">
            <p className="text-sm text-gray-400 mb-2">Support jpg, png</p>
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={(e) => setCoverImage(e.target.files[0])}
            />
          </div>
        </div>

        {/* Material */}
        <div>
          <label className="block font-semibold mb-2">Material:</label>
          <div className="bg-gray-100 p-5 rounded-lg text-center">
            <p className="text-sm text-gray-400 mb-2">
              Support mp4, jpg, png, docx, pdf …
            </p>
            <input
              type="file"
              accept=".mp4,.jpg,.jpeg,.png,.docx,.pdf"
              onChange={(e) => setMaterial(e.target.files[0])}
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-[#9C4DF4] hover:bg-[#7b35e6] text-white py-3 rounded-lg font-semibold"
        >
          {initialValues && initialValues.id ? "Update" : "Create"}
        </button>
      </form>
      </div>
    </div>
  );
};

export default CourseForm;
