import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { ArrowLeft } from "lucide-react";

const WHO_LABELS = {
  student: "Student",
  professional: "Working Professional",
  family: "Family",
  other: "Other",
};

const ROOM_TYPE_LABELS = {
  any: "Any type",
  single: "Single Room",
  sharing: "Sharing Room",
  annex: "Annex",
  boarding: "Boarding House",
  apartment: "Apartment",
  full_house: "Full House",
  short_stay: "Short Stay",
};

const ViewRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/request/${id}`);
        setRequest(res.data.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch request details",
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleBack = () =>
    window.history.state?.idx > 0 ? navigate(-1) : navigate("/home");

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Loading request details...
          </p>
        </div>
      </div>
    );

  if (error || !request)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-10 max-w-sm w-full text-center">
          <h2 className="text-xl font-black text-slate-800 dark:text-white mb-2">
            Request not found
          </h2>
          <p className="text-slate-400 dark:text-slate-500 text-sm mb-6">
            {error}
          </p>
          <button
            onClick={handleBack}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );

  const waLink = request.whatsapp
    ? `https://wa.me/94${request.whatsapp.replace(/^0/, "")}`
    : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-5 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition text-slate-600 dark:text-slate-300"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-lg font-black text-slate-900 dark:text-white">
            Room Request Details
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-8 space-y-4">
        {/* About */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
          <h2 className="font-black text-slate-900 dark:text-white text-base">
            About
          </h2>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
              {WHO_LABELS[request.whoAmI] || request.whoAmI}
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 capitalize">
              {request.gender}
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
              {request.duration === "short_term" ? "Short Term" : "Long Term"}
            </span>
          </div>
          {request.bio && (
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              {request.bio}
            </p>
          )}
        </div>

        {/* Looking For */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-3">
          <h2 className="font-black text-slate-900 dark:text-white text-base">
            Looking For
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mb-0.5">
                City / Area
              </p>
              <p className="text-sm font-semibold text-slate-800 dark:text-white">
                {request.lookingIn}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mb-0.5">
                Max Budget
              </p>
              <p className="text-sm font-black text-emerald-600">
                Rs {request.maxBudget?.toLocaleString()} /mo
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mb-0.5">
                Room Type
              </p>
              <p className="text-sm font-semibold text-slate-800 dark:text-white">
                {ROOM_TYPE_LABELS[request.roomTypePreferred] ||
                  request.roomTypePreferred}
              </p>
            </div>
            {request.moveInDate && (
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mb-0.5">
                  Move-in Date
                </p>
                <p className="text-sm font-semibold text-slate-800 dark:text-white">
                  {new Date(request.moveInDate).toLocaleDateString()}
                </p>
              </div>
            )}
            {request.mealsNeeded && (
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mb-0.5">
                  Meals
                </p>
                <p className="text-sm font-semibold text-slate-800 dark:text-white">
                  Meals needed
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Contact */}
        {waLink && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="font-black text-slate-900 dark:text-white text-base mb-4">
              Contact
            </h2>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-sm transition"
            >
              Chat on WhatsApp
            </a>
          </div>
        )}

        <p className="text-xs text-slate-400 dark:text-slate-500 text-right">
          Posted {new Date(request.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default ViewRequest;
