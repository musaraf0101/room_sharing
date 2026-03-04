import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./../utils/api";

const CreateRoom = () => {
  const [roomType, setRoomType] = useState("sharing");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
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
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Create New Room</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Room Type */}
          <div>
            <label className="block mb-2 font-semibold">Room Type</label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="sharing">Sharing</option>
              <option value="rental">Rental</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block mb-2 font-semibold">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter location"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block mb-2 font-semibold">Price (Rs)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter price"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block mb-2 font-semibold">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Room title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 font-semibold">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Room description"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block mb-2 font-semibold">Upload Images</label>
            <input
              type="file"
              multiple
              onChange={handleImageChange}
              className="w-full"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all"
          >
            Create Room
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRoom;
