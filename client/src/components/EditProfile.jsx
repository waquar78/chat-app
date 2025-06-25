import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useUploadProfilePicMutation } from "../api/AuthApi";
import { IoMdArrowRoundBack } from "react-icons/io"; // ← ye import kar diya
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();
  const loggedInUser = useSelector((state) => state.auth.user);

  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(
    loggedInUser?.profile ||
      "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
  );
  const [message, setMessage] = useState("");

  const [uploadProfilePic, { isLoading }] = useUploadProfilePicMutation();

  useEffect(() => {
    if (loggedInUser?.profile) {
      setPreview(loggedInUser.profile);
    }
  }, [loggedInUser]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!profilePic) {
      setMessage("Please select a profile picture first.");
      return;
    }

    const formData = new FormData();
    formData.append("profile", profilePic);

    try {
      const res = await uploadProfilePic(formData).unwrap();
      console.log("Upload success:", res);
      setMessage(res.message || "Profile updated successfully.");
      setPreview(res.profilePic);
    } catch (err) {
      console.error("Upload failed:", err);
      setMessage("Failed to upload profile.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center p-5">
      <div className="w-full max-w-sm p-6 bg-white rounded-2xl shadow-lg">
        {/* Header with Back Button */}
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => navigate(-1)}
            className="text-2xl text-blue-600 hover:bg-blue-100 p-2 rounded-full transition"
          >
            <IoMdArrowRoundBack />
          </button>
          <h2 className="text-2xl font-bold text-gray-700">Edit Profile</h2>
        </div>

        {/* Profile Image */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <img
              src={preview}
              alt="Profile Preview"
              className="w-36 h-36 rounded-full object-cover border-4 border-gray-300"
            />
            <label
              htmlFor="fileInput"
              className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer"
            >
              📷
            </label>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Name */}
        <div className="mb-3">
          <label className="text-sm font-medium text-gray-600">Name:</label>
          <p className="text-base font-semibold">{loggedInUser?.name}</p>
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="text-sm font-medium text-gray-600">Email:</label>
          <p className="text-base font-semibold">{loggedInUser?.email}</p>
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {isLoading ? "Uploading..." : "Upload Profile Picture"}
        </button>

        {/* Message */}
        {message && (
          <p className="mt-4 text-center text-sm text-green-600 font-medium">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default EditProfile;
