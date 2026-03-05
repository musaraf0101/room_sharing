import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

const ViewRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/room/${id}`);
        setRoom(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch room details");
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">
            Loading room details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error || "Room not found"}</p>
          <button
            onClick={() => navigate("/home")}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <nav className="bg-white shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <button
          onClick={() => navigate("/home")}
          className="flex items-center text-gray-600 hover:text-blue-600 transition font-medium"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </button>
        <h1 className="text-xl font-bold text-gray-800">Room Details</h1>
        <div className="w-10"></div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 mt-8">
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
          <div className="pt-6 px-7 border-t border-gray-100">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-2 leading-tight">
              {room.title}
            </h2>
            <p className="text-sm text-gray-700 font-semibold">
              Posted on: {new Date(room.createdAt).toLocaleDateString()}
            </p>
          </div>
          {/* Image Gallery */}
          <div className="p-4 sm:p-6 bg-white border-b border-gray-100">
            {room.mediaIDs && room.mediaIDs.length > 0 ? (
              <div className="flex flex-col gap-6">
                {/* Main Image */}
                <div className="relative group aspect-video md:aspect-21/9 w-full bg-gray-100 rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src={room.mediaIDs[currentImageIndex]?.url}
                    alt={room.title}
                    className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Image Counter Badge */}
                  <div className="absolute bottom-6 right-6 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-white text-xs font-bold tracking-widest uppercase border border-white/20">
                    {currentImageIndex + 1} / {room.mediaIDs.length}
                  </div>
                </div>

                {/* Thumbnails Carousel */}
                <div className="relative">
                  {room.mediaIDs.length > 1 && (
                    <div className="flex items-center gap-4 px-2">
                      <div
                        id="thumbnail-container"
                        className="flex-1 flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
                      >
                        {room.mediaIDs.map((img, idx) => (
                          <div
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`relative shrink-0 w-24 sm:w-32 aspect-square rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 snap-start border-4 ${
                              currentImageIndex === idx
                                ? "border-blue-600 shadow-xl shadow-blue-100 scale-95"
                                : "border-transparent opacity-60 hover:opacity-100 hover:scale-105"
                            }`}
                          >
                            <img
                              src={img.url}
                              alt={`${room.title} thumb ${idx}`}
                              className="w-full h-full object-cover"
                            />
                            {currentImageIndex === idx && (
                              <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-[1px]" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="w-full h-96 bg-gray-50 rounded-3xl flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 p-8">
                <div className="bg-white p-6 rounded-full shadow-lg mb-6 transform transition hover:rotate-12 duration-300">
                  <svg
                    className="w-16 h-16 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-2xl font-bold text-gray-500 mb-2">
                  No images yet
                </p>
                <p className="text-gray-400 max-w-sm text-center font-medium">
                  The owner hasn't uploaded any photos of this room yet.
                </p>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-10">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-6">
                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      room.roomType === "rental"
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {room.roomType}
                  </span>
                  <span className="flex items-center text-gray-500 text-sm font-medium">
                    <svg
                      className="w-4 h-4 mr-1.5 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {room.location}
                  </span>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                      Description
                    </h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
                      {room.description.charAt(0).toUpperCase() +
                        room.description.slice(1)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border-2 border-blue-50 shadow-2xl shadow-blue-100/50 min-w-85 md:sticky md:top-24 self-start">
                <div className="mb-8">
                  <p className="text-gray-400 text-xs mb-2 uppercase tracking-[0.2em] font-bold">
                    Price per month
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-blue-600">
                      Rs. {room.price}
                    </span>
                    <span className="text-gray-400 font-medium">/month</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <button className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-[0.98]">
                    Contact
                  </button>
                  <button className="w-full py-4 bg-white text-blue-600 border-2 border-blue-100 rounded-2xl font-bold hover:bg-blue-50 transition-all">
                    Save to Favorites
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewRoom;
