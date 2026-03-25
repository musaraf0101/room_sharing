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
  { value: "any", label: "Any type" },
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

const PostRequest = () => {
  const [whoAmI, setWhoAmI] = useState("student");
  const [lookingIn, setLookingIn] = useState("");
  const [subArea, setSubArea] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [roomTypePreferred, setRoomTypePreferred] = useState("any");
  const [moveInDate, setMoveInDate] = useState("");
  const [gender, setGender] = useState("male");
  const [mealsNeeded, setMealsNeeded] = useState(false);
  const [duration, setDuration] = useState("long_term");
  const [bio, setBio] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleBack = () => navigate(-1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await api.post("/request/", {
        whoAmI,
        lookingIn,
        subArea: subArea || undefined,
        maxBudget: Number(maxBudget),
        roomTypePreferred,
        moveInDate: moveInDate || undefined,
        gender,
        mealsNeeded,
        duration,
        bio,
        whatsapp,
      });
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
            Posting your request...
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
              Post a Room Request
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Let landlords find you
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-8">
        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: About You */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-5">
            <h2 className="font-black text-slate-900 dark:text-white text-base">
              About You
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <Field label="I am a" required>
                <select
                  value={whoAmI}
                  onChange={(e) => setWhoAmI(e.target.value)}
                  className={inputCls}
                >
                  <option value="student">Student</option>
                  <option value="professional">Working Professional</option>
                  <option value="family">Family</option>
                  <option value="other">Other</option>
                </select>
              </Field>
              <Field label="I am" required>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className={inputCls}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </Field>
            </div>

            <Field label="Short Bio" hint="optional">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Tell landlords about yourself — your routine, why you're moving, lifestyle..."
                className={`${inputCls} resize-none`}
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

          {/* Section 2: What You're Looking For */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-5">
            <h2 className="font-black text-slate-900 dark:text-white text-base">
              What You're Looking For
            </h2>

            <Field label="City" required>
              <select
                value={lookingIn}
                onChange={(e) => setLookingIn(e.target.value)}
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

            <div className="grid grid-cols-2 gap-4">
              <Field label="Max Budget (Rs/month)" required>
                <input
                  type="number"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value)}
                  required
                  placeholder="20,000"
                  className={inputCls}
                />
              </Field>
              <Field label="Room Type Preferred">
                <select
                  value={roomTypePreferred}
                  onChange={(e) => setRoomTypePreferred(e.target.value)}
                  className={inputCls}
                >
                  {ROOM_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Move-in Date" hint="optional">
                <input
                  type="date"
                  value={moveInDate}
                  onChange={(e) => setMoveInDate(e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Stay Duration">
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className={inputCls}
                >
                  <option value="long_term">Long Term</option>
                  <option value="short_term">Short Term</option>
                </select>
              </Field>
            </div>

            <label
              className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition select-none ${
                mealsNeeded
                  ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
                  : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
              }`}
            >
              <input
                type="checkbox"
                checked={mealsNeeded}
                onChange={(e) => setMealsNeeded(e.target.checked)}
                className="sr-only"
              />
              <div className="flex-1">
                <p
                  className={`text-sm font-semibold ${mealsNeeded ? "text-emerald-700 dark:text-emerald-400" : "text-slate-700 dark:text-slate-200"}`}
                >
                  Meals Needed
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  I'm looking for a boarding house with meals included
                </p>
              </div>
              {mealsNeeded && (
                <span className="text-emerald-500 text-sm font-bold">✓</span>
              )}
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
              Post Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostRequest;
