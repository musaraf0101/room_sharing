import { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, ArrowLeft, Plus, Eye } from "lucide-react";

const ROOM_TYPE_LABELS = {
  single: "Single Room",
  sharing: "Sharing",
  annex: "Annex",
  boarding: "Boarding",
  apartment: "Apartment",
  full_house: "Full House",
  short_stay: "Short Stay",
  rental: "Rental",
};

const MyRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/room/my-rooms");
        setRooms(res.data.data);
      } catch (e) {
        setErrors(e.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this room listing?")) return;
    try {
      await api.delete(`/room/${id}`);
      setRooms((prev) => prev.filter((r) => r._id !== id));
    } catch (e) {
      alert(e.response?.data?.message || "Failed to delete");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Loading your rooms...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-5 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/home")}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition text-slate-600 dark:text-slate-300"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white">
                My Rooms
              </h1>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {rooms.length} listing{rooms.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/create-room")}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-sm"
          >
            <Plus size={16} /> New Listing
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-6">
        {errors && (
          <div className="mb-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-medium">
            {errors}
          </div>
        )}

        {rooms.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-16 text-center">
            <div className="text-5xl mb-4">🏠</div>
            <h3 className="text-xl font-black text-slate-700 dark:text-slate-200 mb-2">
              No listings yet
            </h3>
            <p className="text-slate-400 dark:text-slate-500 text-sm mb-8">
              Post your first room and start getting enquiries.
            </p>
            <button
              onClick={() => navigate("/create-room")}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition text-sm"
            >
              Post Your First Room
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {rooms.map((room) => (
              <div
                key={room._id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all overflow-hidden flex flex-col sm:flex-row"
              >
                {/* Image */}
                <div className="sm:w-44 h-40 sm:h-auto bg-slate-100 dark:bg-slate-700 shrink-0 relative overflow-hidden">
                  {room.mediaIDs?.length > 0 ? (
                    <img
                      src={room.mediaIDs[0].url}
                      alt={room.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600 text-4xl">
                      🏠
                    </div>
                  )}
                  <span className="absolute top-2 left-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-xs font-bold px-2 py-0.5 rounded-full text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600">
                    {ROOM_TYPE_LABELS[room.roomType] || room.roomType}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h3 className="font-black text-slate-900 dark:text-white text-lg leading-tight line-clamp-1">
                        {room.title || room.location}
                      </h3>
                    </div>
                    <p className="text-slate-400 dark:text-slate-500 text-sm flex items-center gap-1 mb-3">
                      <svg
                        className="w-3.5 h-3.5 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                      </svg>
                      {room.location}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-black text-emerald-600">
                        Rs {room.price?.toLocaleString()}
                      </span>
                      <span className="text-slate-400 dark:text-slate-500 text-sm">
                        /month
                      </span>
                      {room.securityDeposit > 0 && (
                        <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                          +Rs {room.securityDeposit?.toLocaleString()} deposit
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-100 dark:border-slate-700">
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      Posted{" "}
                      {new Date(room.createdAt).toLocaleDateString("en-LK", {
                        dateStyle: "medium",
                      })}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/view-room/${room._id}`)}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
                      >
                        <Eye size={13} /> View
                      </button>
                      <button
                        onClick={() => navigate(`/update-room/${room._id}`)}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/30 transition"
                      >
                        <Edit size={13} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(room._id)}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800 transition"
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRooms;
