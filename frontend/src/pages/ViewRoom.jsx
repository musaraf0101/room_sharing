import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, MapPin, Calendar, Shield } from "lucide-react";

const ROOM_TYPE_LABELS = {
  single: "Single Room",
  sharing: "Sharing Room",
  annex: "Annex",
  boarding: "Boarding House",
  apartment: "Apartment",
  full_house: "Full House",
  short_stay: "Short Stay",
  rental: "Rental",
};

const ViewRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/room/${id}`);
        setRoom(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch room details");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Loading room details...
          </p>
        </div>
      </div>
    );

  if (error || !room)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-10 max-w-sm w-full text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-black text-slate-800 dark:text-white mb-2">
            Room not found
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            {error || "This listing may have expired."}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
          >
            Back to Listings
          </button>
        </div>
      </div>
    );

  const included = Object.entries(room.utilities || {})
    .filter(([, v]) => v)
    .map(
      ([k]) =>
        ({
          water: "Water",
          electricity: "Electricity",
          wifi: "WiFi",
          meals: "Meals",
        })[k],
    );

  const waLink = room.whatsapp
    ? `https://wa.me/94${room.whatsapp.replace(/^0/, "")}`
    : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Navbar */}
      <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-5 py-3.5 flex items-center justify-between sticky top-0 z-50">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 transition text-sm font-semibold"
        >
          <ArrowLeft size={16} /> Back to listings
        </button>
        <div className="w-28" />
      </nav>

      <div className="max-w-6xl mx-auto px-5 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── LEFT (main content) ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              {room.mediaIDs?.length > 0 ? (
                <div>
                  <div className="relative aspect-video bg-slate-100 dark:bg-slate-700 overflow-hidden">
                    <img
                      src={room.mediaIDs[currentImageIndex]?.url}
                      alt={room.title}
                      className="w-full h-full object-cover transition-all duration-500"
                    />
                  </div>
                  {room.mediaIDs.length > 1 && (
                    <div className="flex gap-2 p-3 overflow-x-auto scrollbar-hide">
                      {room.mediaIDs.map((img, idx) => (
                        <div
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-16 h-16 rounded-lg overflow-hidden shrink-0 cursor-pointer border-2 transition ${
                            currentImageIndex === idx
                              ? "border-blue-600 scale-95"
                              : "border-transparent opacity-60 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={img.url}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-video flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                  <p className="text-sm font-medium text-slate-300 dark:text-slate-600">
                    No photos uploaded
                  </p>
                </div>
              )}
            </div>

            {/* Title & Meta */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                  {ROOM_TYPE_LABELS[room.roomType] || room.roomType}
                </span>
                {room.genderPreference && room.genderPreference !== "any" && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400">
                    {room.genderPreference} only
                  </span>
                )}
                {room.suitableFor && room.suitableFor !== "anyone" && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                    For {room.suitableFor}
                  </span>
                )}
              </div>

              <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-3 leading-tight">
                {room.title
                  ? room.title.charAt(0).toUpperCase() + room.title.slice(1)
                  : ROOM_TYPE_LABELS[room.roomType]}
              </h1>

              <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-blue-500" /> {room.location}
                </span>
                {room.availableFrom && (
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-emerald-500" />
                    Available{" "}
                    {new Date(room.availableFrom).toLocaleDateString("en-LK", {
                      dateStyle: "medium",
                    })}
                  </span>
                )}
                <span className="text-slate-300 dark:text-slate-600">
                  Listed {new Date(room.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Description */}
            {room.description && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="font-black text-slate-900 dark:text-white mb-3">
                  About this room
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line text-sm">
                  {room.description.charAt(0).toUpperCase() +
                    room.description.slice(1)}
                </p>
              </div>
            )}

            {/* What's Included */}
            {included.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="font-black text-slate-900 dark:text-white mb-4">
                  What's included in rent
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {included.map((item) => {
                    const icons = {
                      Water: "💧",
                      Electricity: "⚡",
                      WiFi: "📶",
                      Meals: "🍽️",
                    };
                    return (
                      <div
                        key={item}
                        className="flex flex-col items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-900/30"
                      >
                        <span className="text-2xl">{icons[item]}</span>
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                          {item}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* House Rules */}
            {room.houseRules && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Shield size={16} className="text-amber-500" /> House Rules
                </h2>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                  {room.houseRules}
                </p>
              </div>
            )}
          </div>

          {/* ── RIGHT (price card) ── */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 sticky top-24">
              {/* Price breakdown */}
              <div className="mb-6">
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                  Pricing
                </p>
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 dark:text-slate-400">
                      Monthly rent
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      Rs {room.price?.toLocaleString()}
                    </span>
                  </div>
                  {included.length > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 dark:text-slate-400">
                        Utilities
                      </span>
                      <span className="font-bold text-emerald-600">
                        Included ✓
                      </span>
                    </div>
                  )}
                  {room.securityDeposit > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 dark:text-slate-400">
                        Security deposit
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        Rs {room.securityDeposit?.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="h-px bg-slate-100 dark:bg-slate-700" />
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-700 dark:text-slate-200">
                      Total / month
                    </span>
                    <span className="text-2xl font-black text-blue-600">
                      Rs {room.price?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-3">
                {waLink ? (
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition active:scale-[0.98] shadow-lg shadow-emerald-100"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Contact on WhatsApp
                  </a>
                ) : (
                  <button className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition">
                    Contact Owner
                  </button>
                )}
                {!user && (
                  <button
                    onClick={() => navigate("/")}
                    className="w-full py-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl text-sm font-semibold transition"
                  >
                    Sign in to save listing
                  </button>
                )}
              </div>

              {/* Trust note */}
              <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-4">
                Contact directly via WhatsApp — no fees, no middlemen.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewRoom;
