import { useEffect, useState, useRef } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, User, FileText } from "lucide-react";

const Home = () => {
  const { logout } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRooms, setTotalRooms] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navigate = useNavigate();
  const menuRef = useRef();

  const fetchRooms = async (page = 1) => {
    try {
      setLoading(true);
      setErrors(null);
      const res = await api.get(`/room/?page=${page}&limit=10`);

      setRooms(res.data.data);
      setTotalPages(res.data.totalPage || 1);
      setTotalRooms(res.data.totalRooms || 0);
      setCurrentPage(res.data.page || 1);
    } catch (error) {
      setErrors(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      localStorage.removeItem("token");
      logout();
      window.location.href = "/";
    } catch (error) {
      console.log(error);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold text-blue-600 animate-pulse">
          Loading...
        </p>
      </div>
    );

  if (errors)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold text-red-600">{errors}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100">
      {/*NAVBAR*/}
      <nav className="w-full bg-white shadow-md px-6 py-3 flex items-center justify-between">
        <div className="text-xl font-bold text-blue-600">MyApp</div>

        {/* Search */}
        <div className="flex-1 mx-6 max-w-md">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Right Buttons */}
        <div className="flex items-center gap-4">
          {/* Post Room */}
          <button
            onClick={() => navigate("/create-room")}
            className="px-5 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition shadow-sm"
          >
            Post Room
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowProfileMenu((prev) => !prev)}
              className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow hover:bg-blue-700 transition"
            >
              U
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 animate-fadeIn">
                <button
                  onClick={() => {
                    navigate("/profile");
                    setShowProfileMenu(false);
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition"
                >
                  <User size={16} />
                  Update Profile
                </button>

                <button
                  onClick={() => {
                    navigate("/my-rooms");
                    setShowProfileMenu(false);
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition"
                >
                  <FileText size={16} />
                  My Posts
                </button>

                <button
                  onClick={() => {
                    handleLogout();
                    setShowProfileMenu(false);
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/*ROOMS SECTION */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">
          Available Rooms ({totalRooms})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rooms.map((room) => (
            <div
              key={room._id}
              onClick={() => navigate(`/view-room/${room._id}`)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition cursor-pointer flex gap-4 overflow-hidden"
            >
              {/* Image */}
              <div className="w-32 h-24 shrink-0 bg-gray-50 rounded overflow-hidden">
                {room.mediaIDs && room.mediaIDs.length > 0 ? (
                  <img
                    src={room.mediaIDs[0]?.url}
                    alt={room.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    No Image
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <h3 className="text-blue-700 font-bold text-lg line-clamp-1">
                    {room.title}
                  </h3>

                  <div className="text-gray-400 text-sm mt-1 line-clamp-1">
                    {room.location} •{" "}
                    {room.roomType === "sharing" ? "Sharing" : "Rental"}
                  </div>

                  <div className="text-green-600 font-bold mt-2">
                    Rs {room.price?.toLocaleString()} /month
                  </div>
                </div>

                <div className="text-gray-400 text-xs self-end">
                  {new Date(room.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/*PAGINATION */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              onClick={() => {
                setCurrentPage((prev) => Math.max(prev - 1, 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-40"
            >
              Previous
            </button>

            <span className="px-4 font-semibold">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => {
                setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
