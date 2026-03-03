import React from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { logout } = useAuth();
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      console.log("logout success");
      logout();
      window.location.href = "/";
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex justify-end p-4">
      <button
        onClick={handleLogout}
        className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transform active:scale-[0.95] transition-all shadow-sm flex items-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Logout
      </button>
    </div>
  );
};

export default Home;
