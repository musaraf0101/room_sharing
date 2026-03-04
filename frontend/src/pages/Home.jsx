import { useEffect, useState } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { logout } = useAuth();
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate()

  const fetchRooms = async () => {
    try {
      const res = await api.get("/room/");
      setRooms(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rooms.map((room) => (
            <div
              key={room._id}
              className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold">
                {room.title || "Room Title"}
              </h3>

              <p className="text-gray-600 mt-2">
                {room.description || "No description available"}
              </p>

              <div className="mt-4 flex justify-between items-center">
                <span className="text-blue-600 font-bold">
                  Rs. {room.price || "N/A"}
                </span>

                <button className="px-4 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
