import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, User } from "lucide-react";

const UpdateProfile = () => {
  const { id } = useParams();
  const { user, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && (user.id === id || user.id === id.toString())) {
      setEmail(user.email || "");
      setUserName(user.name || "");
      setPhoneNumber(user.phoneNumber || "");
    }
  }, [user, id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);
    try {
      await api.put(`/user/${id}`, {
        username: userName,
        email,
        password,
        phoneNumber,
      });
      login({ ...user, name: userName, email, phoneNumber });
      setSuccess(true);
      setTimeout(() => navigate("/home"), 1200);
    } catch (error) {
      setError(
        error.response?.data?.message || "Update failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Back */}
        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium mb-8 transition text-sm"
        >
          <ArrowLeft size={16} />
          Back to home
        </button>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-blue-600 to-blue-700 px-8 py-8 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-black">
                {userName?.charAt(0).toUpperCase() || <User size={28} />}
              </div>
              <div>
                <h2 className="text-xl font-black">Your Profile</h2>
                <p className="text-blue-200 text-sm mt-0.5">{email}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            {error && (
              <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium">
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Profile updated! Redirecting...
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  New Password{" "}
                  <span className="text-slate-400 font-normal">
                    (leave blank to keep current)
                  </span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder:text-slate-400 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="07X XXXXXXX"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder:text-slate-400 text-slate-900"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3.5 rounded-xl font-bold transition shadow-lg shadow-blue-200 active:scale-[0.98]"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
