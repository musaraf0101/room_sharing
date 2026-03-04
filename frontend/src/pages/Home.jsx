import { useEffect, useState } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { logout } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRooms, setTotalRooms] = useState(0);
  const navigate = useNavigate();

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
      setErrors(error.response?.data?.message || "somthing went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms(currentPage);
  }, [currentPage]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      console.log("logout success");
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
      <nav className="w-full bg-white shadow-md px-6 py-3 flex items-center justify-between">
        <div className="text-xl font-bold text-blue-600">MyApp</div>

        <div className="flex-1 mx-6 max-w-md">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/create-room")}
            className="px-5 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-sm"
          >
            Post Room
          </button>

          <button
            onClick={handleLogout}
            className="px-5 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all shadow-sm"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Available Rooms</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rooms.map((room) => (
            <div
              key={room._id}
              onClick={() => navigate(`/view-room/${room._id}`)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition cursor-pointer flex gap-4 overflow-hidden"
            >
              {/* Thumbnail Image */}
              <div className="w-32 h-24 shrink-0 bg-gray-50 rounded overflow-hidden">
                {room.mediaIDs && room.mediaIDs.length > 0 ? (
                  <img
                    src={room.mediaIDs[0]?.url}
                    alt={room.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <svg
                      className="w-8 h-8"
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
                )}
              </div>

              {/* Content Details */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <h3 className="text-[#005a8d] font-bold text-base md:text-lg line-clamp-1 hover:underline">
                    {room.title || "Room Title"}
                  </h3>

                  <div className="text-gray-500 text-sm mt-1">
                    Beds: 1, Baths: 1
                  </div>

                  <div className="text-gray-400 text-xs mt-0.5 line-clamp-1">
                    {room.location},{" "}
                    {room.roomType === "sharing" ? "Sharing" : "Rental"}
                  </div>

                  <div className="text-[#009b77] font-bold text-sm md:text-base mt-2">
                    Rs {room.price.toLocaleString()} /month
                  </div>
                </div>

                <div className="text-gray-400 text-[10px] self-end mt-1">
                  {new Date(room.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Section */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              onClick={() => {
                setCurrentPage((prev) => Math.max(prev - 1, 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg border font-medium ${
                currentPage === 1
                  ? "bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              Previous
            </button>

            <div className="flex items-center gap-1 mx-2">
              {[...Array(totalPages)].map((_, idx) => {
                const pageNum = idx + 1;
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => {
                        setCurrentPage(pageNum);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className={`w-10 h-10 rounded-lg font-bold border transition ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-blue-500"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  (pageNum === 2 && currentPage > 3) ||
                  (pageNum === totalPages - 1 && currentPage < totalPages - 2)
                ) {
                  return (
                    <span key={pageNum} className="px-2 text-gray-400">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            <button
              onClick={() => {
                setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg border font-medium ${
                currentPage === totalPages
                  ? "bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
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
