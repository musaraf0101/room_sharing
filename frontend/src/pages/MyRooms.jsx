import { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, ArrowLeft, Plus } from "lucide-react";

const MyRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();

  const fetchUserRooms = async () => {
    try {
      setLoading(true);
      setErrors(null);
      const res = await api.get("/room/my-rooms");
      setRooms(res.data.data);
    } catch (error) {
      setErrors(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRooms();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await api.delete(`/room/${id}`);
        setRooms(rooms.filter((room) => room._id !== id));
      } catch (error) {
        console.log(error.response?.data?.message || "Failed to delete room");
      }
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold text-blue-600 animate-pulse">
          Loading your posts...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/home")}
              className="p-2 hover:bg-white rounded-full transition shadow-sm border border-transparent hover:border-gray-200"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-3xl font-extrabold text-gray-900">My Posts</h1>
          </div>
          <button
            onClick={() => navigate("/create-room")}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-blue-200/50"
          >
            <Plus size={18} />
            New Post
          </button>
        </div>

        {errors && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6">
            {errors}
          </div>
        )}

        {rooms.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No posts yet
            </h3>
            <p className="text-gray-400 mb-6">
              You haven't shared any rooms yet.
            </p>
            <button
              onClick={() => navigate("/create-room")}
              className="text-blue-600 font-bold hover:underline"
            >
              Post your first room
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {rooms.map((room) => (
              <div
                key={room._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition flex flex-col md:flex-row gap-6"
              >
                {/* Image */}
                <div className="w-full md:w-48 h-36 shrink-0 bg-gray-100 rounded-xl overflow-hidden shadow-inner">
                  {room.mediaIDs && room.mediaIDs.length > 0 ? (
                    <img
                      src={room.mediaIDs[0]?.url}
                      alt={room.title}
                      className="w-full h-full object-cover font-medium text-gray-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
                        {room.title}
                      </h3>
                      <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {room.roomType}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mb-3 flex items-center gap-1">
                      {room.location}
                    </p>
                    <div className="text-2xl font-black text-blue-600 mb-2">
                      Rs {room.price?.toLocaleString()}{" "}
                      <span className="text-sm font-normal text-gray-400">
                        /month
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                    <span className="text-xs text-gray-400 font-medium">
                      Posted on{" "}
                      {new Date(room.createdAt).toLocaleDateString(undefined, {
                        dateStyle: "long",
                      })}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => navigate(`/update-room/${room._id}`)}
                        className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border border-blue-100"
                        title="Edit Post"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(room._id)}
                        className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-red-100"
                        title="Delete Post"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button
                        onClick={() => navigate(`/view-room/${room._id}`)}
                        className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition"
                      >
                        View Details
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
