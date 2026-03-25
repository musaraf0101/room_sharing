import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./../utils/api";
import { ArrowLeft } from "lucide-react";

const SRI_LANKA_CITIES = [
  "Colombo",
  "Dehiwala-Mount Lavinia",
  "Sri Jayawardenepura Kotte",
  "Moratuwa",
  "Negombo",
  "Kalutara",
  "Panadura",
  "Homagama",
  "Kaduwela",
  "Maharagama",
  "Kolonnawa",
  "Kesbewa",
  "Gampaha",
  "Ja-Ela",
  "Wattala",
  "Ragama",
  "Kandana",
  "Minuwangoda",
  "Divulapitiya",
  "Mirigama",
  "Beruwala",
  "Aluthgama",
  "Matugama",
  "Bandaragama",
  "Kandy",
  "Matale",
  "Nuwara Eliya",
  "Gampola",
  "Nawalapitiya",
  "Dambulla",
  "Sigiriya",
  "Hatton",
  "Dikoya",
  "Talawakele",
  "Haputale",
  "Bandarawela",
  "Badulla",
  "Mahiyanganaya",
  "Moneragala",
  "Welimada",
  "Bibile",
  "Galle",
  "Matara",
  "Hambantota",
  "Weligama",
  "Unawatuna",
  "Hikkaduwa",
  "Ambalangoda",
  "Tangalle",
  "Tissamaharama",
  "Dickwella",
  "Koggala",
  "Mirissa",
  "Deniyaya",
  "Akuressa",
  "Elpitiya",
  "Jaffna",
  "Kilinochchi",
  "Mannar",
  "Vavuniya",
  "Mullaitivu",
  "Chavakachcheri",
  "Point Pedro",
  "Nelliady",
  "Kayts",
  "Trincomalee",
  "Batticaloa",
  "Ampara",
  "Kalmunai",
  "Sammanthurai",
  "Akkaraipattu",
  "Kattankudy",
  "Valaichchenai",
  "Eravur",
  "Chenkaladi",
  "Kurunegala",
  "Puttalam",
  "Kuliyapitiya",
  "Narammala",
  "Wariyapola",
  "Chilaw",
  "Wennappuwa",
  "Marawila",
  "Nikaweratiya",
  "Maho",
  "Alawwa",
  "Pannala",
  "Nattandiya",
  "Anuradhapura",
  "Polonnaruwa",
  "Kekirawa",
  "Medawachchiya",
  "Tambuttegama",
  "Eppawala",
  "Mihintale",
  "Hingurakgoda",
  "Kaduruwela",
  "Medirigiriya",
  "Wellawaya",
  "Diyatalawa",
  "Passara",
  "Ella",
  "Hali-Ela",
  "Ratnapura",
  "Kegalle",
  "Balangoda",
  "Embilipitiya",
  "Avissawella",
  "Ruwanwella",
  "Mawanella",
  "Rambukkana",
  "Warakapola",
  "Eheliyagoda",
  "Kuruwita",
  "Kahawatta",
  "Pelmadulla",
];

const ROOM_TYPES = [
  { value: "single", label: "Single Room" },
  { value: "sharing", label: "Sharing Room" },
  { value: "annex", label: "Annex" },
  { value: "boarding", label: "Boarding House" },
  { value: "apartment", label: "Apartment" },
  { value: "full_house", label: "Full House" },
  { value: "short_stay", label: "Short Stay" },
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

const CreateRoom = () => {
  const [roomType, setRoomType] = useState("single");
  const [location, setLocation] = useState("");
  const [subArea, setSubArea] = useState("");
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleBack = () =>
    window.history.state?.idx > 0 ? navigate(-1) : navigate("/home");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const fd = new FormData();
      fd.append("roomType", roomType);
      fd.append("location", location);
      if (subArea) fd.append("subArea", subArea);
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
      await api.post("/room/", fd);
      navigate("/home");
    } catch (e) {
      setError(e.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Posting your room...
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
            onClick={handleBack}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition text-slate-600 dark:text-slate-300"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-lg font-black text-slate-900 dark:text-white">
              Post a Room
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Fill in the details below
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
          {/* Section: Basics */}
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

            <Field label="City" required>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className={inputCls}
              >
                <option value="">Select a city</option>
                {SRI_LANKA_CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Sub Area" hint="optional">
              <input
                type="text"
                value={subArea}
                onChange={(e) => setSubArea(e.target.value)}
                placeholder="e.g. Bambalapitiya, Fort, Pettah"
                className={inputCls}
              />
            </Field>

            <Field label="WhatsApp Number" required>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value.slice(0, 10))}
                required
                maxLength={10}
                placeholder="07X XXXXXXX"
                className={inputCls}
              />
            </Field>
          </div>

          {/* Section: Pricing */}
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
              <Field label="Security Deposit (Rs)" hint="optional">
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
                  { key: "water", label: "Water" },
                  { key: "electricity", label: "Electricity" },
                  { key: "wifi", label: "WiFi" },
                  { key: "meals", label: "Meals" },
                ].map(({ key, label }) => (
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

          {/* Section: Preferences */}
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

          {/* Section: Description */}
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
                placeholder="Describe the room, the building, nearby transport, etc."
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

          {/* Section: Photos */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
            <h2 className="font-black text-slate-900 dark:text-white text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 text-xs flex items-center justify-center font-black">
                5
              </span>
              Photos
              <span className="text-xs font-normal text-slate-400 dark:text-slate-500">
                (up to 4 images)
              </span>
            </h2>

            <label className="relative flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl hover:border-blue-400 hover:bg-blue-50/30 cursor-pointer transition group">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImages(e.target.files)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-blue-700 transition">
                  {images.length > 0
                    ? `${images.length} photo${images.length > 1 ? "s" : ""} selected`
                    : "Click to upload photos"}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  PNG, JPG up to 10MB each
                </p>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 py-3.5 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow-lg shadow-blue-200 active:scale-[0.98] text-sm"
            >
              Post Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRoom;
