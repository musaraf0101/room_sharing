import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "./../utils/api";
import {
  ArrowLeft,
  Upload,
  Loader2,
  Save,
  MapPin,
  Tag,
  FileText,
  Image as ImageIcon,
} from "lucide-react";

const UpdateRoom = () => {
  const { id } = useParams();
  const [roomType, setRoomType] = useState("sharing");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const res = await api.get(`/room/${id}`);
        const room = res.data.data;
        setRoomType(room.roomType);
        setLocation(room.location);
        setPrice(room.price);
        setTitle(room.title);
        setDescription(room.description);
        setExistingImages(room.mediaIDs || []);
      } catch (error) {
        setErrors(
          error.response?.data?.message || "Failed to fetch room details",
        );
      } finally {
        setFetching(false);
      }
    };

    fetchRoomData();
  }, [id]);

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

      await api.put(`/room/${id}`, formData);

      navigate("/my-rooms");
    } catch (error) {
      console.log(error);
      setErrors(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-lg font-bold text-gray-700">
          Fetching room details...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-6">
      <div className="max-w-4xl mx-auto w-full">
        <button
          onClick={() => navigate("/my-rooms")}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-semibold mb-6 transition"
        >
          <ArrowLeft size={18} />
          Back to My Posts
        </button>

        <div className="bg-white shadow-xl rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-blue-900/5">
          {/* Sidebar with helpful tips */}
          <div className="bg-blue-600 md:w-1/3 p-10 text-white flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-black mb-6">Update Your Post</h2>
              <p className="text-blue-100 mb-8 font-medium">
                Keep your information up to date to attract more interest!
              </p>

              <ul className="space-y-6 text-sm">
                <li className="flex items-start gap-3">
                  <div className="bg-blue-500 p-1.5 rounded-lg">
                    <MapPin size={16} />
                  </div>
                  <span>Verify your current location coordinates.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-blue-500 p-1.5 rounded-lg">
                    <Tag size={16} />
                  </div>
                  <span>Check if the pricing is still competitive.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-blue-500 p-1.5 rounded-lg">
                    <ImageIcon size={16} />
                  </div>
                  <span>Better photos get 70% more clicks.</span>
                </li>
              </ul>
            </div>

            <div className="mt-12 pt-8 border-t border-blue-500 text-xs text-blue-200">
              Updating will refresh the post timestamp.
            </div>
          </div>

          {/* Main Form Area */}
          <div className="md:flex-1 p-10">
            {errors && (
              <div className="bg-red-50 text-red-600 px-5 py-4 rounded-2xl mb-8 border border-red-100 flex items-center gap-3 animate-shake">
                <div className="bg-red-100 p-1.5 rounded-full">
                  <FileText size={16} />
                </div>
                <span className="font-bold">{errors}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-700 uppercase tracking-wider ml-1">
                    Room Type
                  </label>
                  <div className="relative">
                    <select
                      value={roomType}
                      onChange={(e) => setRoomType(e.target.value)}
                      className="w-full bg-gray-50 border-0 focus:ring-2 focus:ring-blue-500/20 text-gray-900 rounded-2xl px-5 py-4 font-bold outline-none transition appearance-none"
                    >
                      <option value="sharing">Sharing</option>
                      <option value="rental">Rental</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      {/* Custom arrow if needed */}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-700 uppercase tracking-wider ml-1">
                    Price (Rs /month)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="w-full bg-gray-50 border-0 focus:ring-2 focus:ring-blue-500/20 text-gray-900 rounded-2xl px-5 py-4 font-bold outline-none transition"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-gray-700 uppercase tracking-wider ml-1">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="w-full bg-gray-50 border-0 focus:ring-2 focus:ring-blue-500/20 text-gray-900 rounded-2xl px-5 py-4 font-bold outline-none transition"
                  placeholder="Enter full address"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-gray-700 uppercase tracking-wider ml-1">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-gray-50 border-0 focus:ring-2 focus:ring-blue-500/20 text-gray-900 rounded-2xl px-5 py-4 font-bold outline-none transition"
                  placeholder="Catchy title for your room"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-gray-700 uppercase tracking-wider ml-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  className="w-full bg-gray-50 border-0 focus:ring-2 focus:ring-blue-500/20 text-gray-900 rounded-2xl px-5 py-4 font-bold outline-none transition resize-none"
                  placeholder="Describe your room, amenities, and rules..."
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-black text-gray-700 uppercase tracking-wider ml-1">
                  Media Management
                </label>

                {existingImages.length > 0 && (
                  <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                    {existingImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="w-16 h-16 rounded-lg bg-gray-50 overflow-hidden shrink-0 border border-gray-100"
                      >
                        <img
                          src={img.url}
                          className="w-full h-full object-cover opacity-50grayscale grayscale hover:grayscale-0 transition cursor-default"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 bg-gray-50/50 hover:bg-gray-50 transition-colors group cursor-pointer relative">
                  <input
                    type="file"
                    multiple
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-3 bg-white rounded-xl shadow-sm group-hover:scale-110 transition duration-300">
                      <Upload className="text-blue-600" size={24} />
                    </div>
                    <p className="text-sm font-bold text-gray-500">
                      {images.length > 0
                        ? `${images.length} files selected`
                        : "Replace all images"}
                    </p>
                    <p className="text-xs text-gray-400">
                      Click or drag to upload new photos
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3 hover:-translate-y-0.5"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Update Room
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateRoom;
