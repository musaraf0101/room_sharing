import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./../utils/api";
import { ArrowLeft } from "lucide-react";

const CreateRoom = () => {
  const [roomType, setRoomType] = useState("sharing");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setErrors(null);
      const formData = new FormData();

      formData.append("roomType", roomType);
      formData.append("location", location);
      formData.append("price", price);
      formData.append("title", title);
      formData.append("description", description);

      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }

      await api.post("/room/", formData);

      navigate("/home");
    } catch (error) {
      console.log(error);
      setErrors(error.response?.data?.message || "somthing went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/home");
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg font-semibold text-blue-600 animate-pulse mb-4">
          Loading...
        </p>
        <button
          onClick={handleBack}
          type="button"
          className="text-gray-500 hover:text-blue-600 font-medium transition-colors"
        >
          Go Back
        </button>
      </div>
    );

  if (errors)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
          <p className="text-lg font-semibold text-red-600 mb-6">{errors}</p>
          <button
            onClick={handleBack}
            type="button"
            className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8">
        <div className="relative flex items-center mb-10">
          <button
            onClick={handleBack}
            type="button"
            className="absolute left-0 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 z-50"
            title="Go Back"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-2xl font-bold w-full text-center">
            Create New Room
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Room Type
            </label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              <option value="sharing">Sharing</option>
              <option value="rental">Rental</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Enter location"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Price (Rs)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Enter price"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Room title"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
              placeholder="Room description"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Upload Images
            </label>
            <input
              type="file"
              multiple
              onChange={handleImageChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div className="pt-4 flex gap-4">
            <button
              onClick={handleBack}
              type="button"
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-2 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              Create Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRoom;
