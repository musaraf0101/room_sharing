import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "./../utils/api";
import { ArrowLeft, Upload, Loader2, Save } from "lucide-react";

const ROOM_TYPES = [
  { value: "single", label: "Single Room" },
  { value: "sharing", label: "Sharing Room" },
  { value: "annex", label: "Annex" },
  { value: "boarding", label: "Boarding House" },
  { value: "apartment", label: "Apartment" },
  { value: "full_house", label: "Full House" },
  { value: "short_stay", label: "Short Stay" },
  { value: "rental", label: "Rental" },
];

const Field = ({ label, required, hint, children }) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
      {label} {required && <span className="text-red-400">*</span>}
      {hint && (
        <span className="text-slate-400 dark:text-slate-500 font-normal ml-1">
          ({hint})
        </span>
      )}
    </label>
    {children}
  </div>
);

const inputCls =
  "w-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition";

const UpdateRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [roomType, setRoomType] = useState("single");
  const [location, setLocation] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [price, setPrice] = useState("");
  const [securityDeposit, setSecurityDeposit] = useState("");
  const [utilities, setUtilities] = useState({
    water: false,
    electricity: false,
    wifi: false,
    meals: false,
  });
  const [genderPreference, setGenderPreference] = useState("any");
  const [suitableFor, setSuitableFor] = useState("anyone");
  const [availableFrom, setAvailableFrom] = useState("");
  const [houseRules, setHouseRules] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/room/${id}`);
        const r = res.data.data;
        setRoomType(r.roomType || "single");
        setLocation(r.location || "");
        setWhatsapp(r.whatsapp || "");
        setPrice(r.price || "");
        setSecurityDeposit(r.securityDeposit || "");
        setUtilities({
          water: r.utilities?.water || false,
          electricity: r.utilities?.electricity || false,
          wifi: r.utilities?.wifi || false,
          meals: r.utilities?.meals || false,
        });
        setGenderPreference(r.genderPreference || "any");
        setSuitableFor(r.suitableFor || "anyone");
        setAvailableFrom(
          r.availableFrom
            ? new Date(r.availableFrom).toISOString().split("T")[0]
            : "",
        );
        setHouseRules(r.houseRules || "");
        setTitle(r.title || "");
        setDescription(r.description || "");
        setExistingImages(r.mediaIDs || []);
      } catch (e) {
        setError(e.response?.data?.message || "Failed to load room");
      } finally {
        setFetching(false);
      }
    })();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const fd = new FormData();
      fd.append("roomType", roomType);
      fd.append("location", location);
      fd.append("whatsapp", whatsapp);
      fd.append("price", price);
      if (securityDeposit) fd.append("securityDeposit", securityDeposit);
      fd.append("waterIncluded", utilities.water.toString());
      fd.append("electricityIncluded", utilities.electricity.toString());
      fd.append("wifiIncluded", utilities.wifi.toString());
      fd.append("mealsIncluded", utilities.meals.toString());
      fd.append("genderPreference", genderPreference);
      fd.append("suitableFor", suitableFor);
      if (availableFrom) fd.append("availableFrom", availableFrom);
      if (houseRules) fd.append("houseRules", houseRules);
      if (title) fd.append("title", title);
      if (description) fd.append("description", description);
      for (let i = 0; i < images.length; i++) fd.append("images", images[i]);
      await api.put(`/room/${id}`, fd);
      navigate("/my-rooms");
    } catch (e) {
      setError(e.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Loading room details...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-5 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate("/my-rooms")}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition text-slate-600 dark:text-slate-300"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-lg font-black text-slate-900 dark:text-white">
              Update Listing
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Changes will refresh your post timestamp
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-8">
        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-medium">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Details */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-5">
            <h2 className="font-black text-slate-900 dark:text-white text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 text-xs flex items-center justify-center font-black">
                1
              </span>
              Room Details
            </h2>

            <Field label="Room Type" required>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className={inputCls}
              >
                {ROOM_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Title" hint="optional">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Bright single room near university"
                className={inputCls}
              />
            </Field>

            <Field label="Location / City" required>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                placeholder="e.g. Colombo 3, near Bambalapitiya"
                className={inputCls}
              />
            </Field>

            <Field label="WhatsApp Number">
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="07X XXXXXXX"
                className={inputCls}
              />
            </Field>
          </div>

          {/* Section 2: Pricing */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-5">
            <h2 className="font-black text-slate-900 dark:text-white text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 text-xs flex items-center justify-center font-black">
                2
              </span>
              Pricing
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Monthly Rent (Rs)" required>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  placeholder="15,000"
                  className={inputCls}
                />
              </Field>
              <Field label="Security Deposit" hint="optional">
                <input
                  type="number"
                  value={securityDeposit}
                  onChange={(e) => setSecurityDeposit(e.target.value)}
                  placeholder="0"
                  className={inputCls}
                />
              </Field>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
                What's included in rent
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: "water", label: "Water", icon: "💧" },
                  { key: "electricity", label: "Electricity", icon: "⚡" },
                  { key: "wifi", label: "WiFi", icon: "📶" },
                  { key: "meals", label: "Meals", icon: "🍽️" },
                ].map(({ key, label, icon }) => (
                  <label
                    key={key}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition select-none ${
                      utilities[key]
                        ? "border-blue-400 bg-blue-50 dark:bg-blue-900/40"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-white dark:bg-slate-800"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={utilities[key]}
                      onChange={() =>
                        setUtilities((p) => ({ ...p, [key]: !p[key] }))
                      }
                      className="sr-only"
                    />
                    <span className="text-lg">{icon}</span>
                    <span
                      className={`text-sm font-semibold ${utilities[key] ? "text-blue-700 dark:text-blue-400" : "text-slate-700 dark:text-slate-200"}`}
                    >
                      {label}
                    </span>
                    {utilities[key] && (
                      <span className="ml-auto text-blue-500 text-xs font-bold">
                        ✓
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Preferences */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-5">
            <h2 className="font-black text-slate-900 dark:text-white text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 text-xs flex items-center justify-center font-black">
                3
              </span>
              Preferences
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Gender Preference">
                <select
                  value={genderPreference}
                  onChange={(e) => setGenderPreference(e.target.value)}
                  className={inputCls}
                >
                  <option value="any">Any gender</option>
                  <option value="male">Male only</option>
                  <option value="female">Female only</option>
                </select>
              </Field>
              <Field label="Suitable For">
                <select
                  value={suitableFor}
                  onChange={(e) => setSuitableFor(e.target.value)}
                  className={inputCls}
                >
                  <option value="anyone">Anyone</option>
                  <option value="students">Students</option>
                  <option value="professionals">Professionals</option>
                  <option value="families">Families</option>
                </select>
              </Field>
            </div>

            <Field label="Available From" hint="optional">
              <input
                type="date"
                value={availableFrom}
                onChange={(e) => setAvailableFrom(e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>

          {/* Section 4: Description */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-5">
            <h2 className="font-black text-slate-900 dark:text-white text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 text-xs flex items-center justify-center font-black">
                4
              </span>
              Description & Rules
            </h2>

            <Field label="Description" hint="optional">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe the room, building, nearby transport..."
                className={`${inputCls} resize-none`}
              />
            </Field>

            <Field label="House Rules" hint="optional">
              <textarea
                value={houseRules}
                onChange={(e) => setHouseRules(e.target.value)}
                rows={2}
                placeholder="e.g. No pets, no smoking, no visitors after 9 PM"
                className={`${inputCls} resize-none`}
              />
            </Field>
          </div>

          {/* Section 5: Photos */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
            <h2 className="font-black text-slate-900 dark:text-white text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 text-xs flex items-center justify-center font-black">
                5
              </span>
              Photos
            </h2>

            {existingImages.length > 0 && (
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-2 font-medium">
                  Current photos (uploading new ones will replace these)
                </p>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {existingImages.map((img, i) => (
                    <div
                      key={i}
                      className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700"
                    >
                      <img
                        src={img.url}
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <label className="relative flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl hover:border-blue-400 hover:bg-blue-50/30 cursor-pointer transition group">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImages(e.target.files)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 flex items-center justify-center transition">
                <Upload
                  className="text-slate-400 dark:text-slate-500 group-hover:text-blue-500 transition"
                  size={22}
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-blue-700 transition">
                  {images.length > 0
                    ? `${images.length} new photo${images.length > 1 ? "s" : ""} selected`
                    : "Upload new photos"}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  PNG, JPG — up to 4 images
                </p>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/my-rooms")}
              className="flex-1 py-3.5 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-2 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-bold transition shadow-lg shadow-blue-200 active:scale-[0.98] text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save size={16} /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateRoom;
