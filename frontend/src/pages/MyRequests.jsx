import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./../utils/api";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

const WHO_LABELS = {
  student: "Student",
  professional: "Professional",
  family: "Family",
  other: "Other",
};

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/request/user/my-requests");
        setRequests(res.data.data);
      } catch (e) {
        setError(e.response?.data?.message || "Failed to load requests");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this room request?")) return;
    try {
      await api.delete(`/request/${id}`);
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (e) {
      alert(e.response?.data?.message || "Failed to delete");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Loading your requests...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-5 py-4 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition text-slate-600 dark:text-slate-300"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white">
                My Requests
              </h1>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {requests.length} active request
                {requests.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/post-request")}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-sm"
          >
            <Plus size={16} /> New Request
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 py-6">
        {error && (
          <div className="mb-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        {requests.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-16 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-black text-slate-700 dark:text-slate-200 mb-2">
              No requests yet
            </h3>
            <p className="text-slate-400 dark:text-slate-500 text-sm mb-8">
              Post a room request so landlords can find and contact you
              directly.
            </p>
            <button
              onClick={() => navigate("/post-request")}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition text-sm"
            >
              Post a Request
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req._id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4 flex-1 min-w-0">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-700 dark:text-amber-400 font-black text-lg shrink-0">
                      {(WHO_LABELS[req.whoAmI] || "?").charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-100">
                          {WHO_LABELS[req.whoAmI] || req.whoAmI}
                        </span>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30">
                          {req.gender}
                        </span>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {req.duration === "short_term"
                            ? "Short term"
                            : "Long term"}
                        </span>
                        {req.mealsNeeded && (
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                            🍽️ Meals needed
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 mb-1">
                        <svg
                          className="w-3.5 h-3.5 text-blue-500 shrink-0"
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
                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                          {req.lookingIn}
                        </span>
                      </div>

                      <p className="text-emerald-600 font-black text-base">
                        Rs {req.maxBudget?.toLocaleString()}
                        <span className="text-slate-400 dark:text-slate-500 text-sm font-normal">
                          {" "}
                          /month max
                        </span>
                      </p>

                      {req.bio && (
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 line-clamp-2 leading-relaxed">
                          {req.bio}
                        </p>
                      )}

                      {req.moveInDate && (
                        <p className="text-slate-400 dark:text-slate-500 text-xs mt-2 flex items-center gap-1">
                          📅 Move in:{" "}
                          {new Date(req.moveInDate).toLocaleDateString(
                            "en-LK",
                            { dateStyle: "medium" },
                          )}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(req._id)}
                    className="shrink-0 p-2.5 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800 hover:border-red-200 transition"
                    title="Delete request"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    Posted{" "}
                    {new Date(req.createdAt).toLocaleDateString("en-LK", {
                      dateStyle: "medium",
                    })}
                  </span>
                  {req.whatsapp && (
                    <a
                      href={`https://wa.me/94${req.whatsapp.replace(/^0/, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-600 font-semibold hover:underline flex items-center gap-1"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      {req.whatsapp}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequests;
