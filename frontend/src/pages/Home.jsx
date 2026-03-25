import { useEffect, useState, useRef } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  User,
  FileText,
  SlidersHorizontal,
  X,
  ChevronDown,
} from "lucide-react";

const SL_CITIES = [
  "Colombo","Dehiwala-Mount Lavinia","Sri Jayawardenepura Kotte","Moratuwa",
  "Negombo","Kalutara","Panadura","Homagama","Kaduwela","Maharagama",
  "Kolonnawa","Kesbewa","Gampaha","Ja-Ela","Wattala","Ragama","Kandana",
  "Minuwangoda","Divulapitiya","Mirigama","Beruwala","Aluthgama","Matugama",
  "Bandaragama","Kandy","Matale","Nuwara Eliya","Gampola","Nawalapitiya",
  "Dambulla","Sigiriya","Hatton","Dikoya","Talawakele","Haputale",
  "Bandarawela","Badulla","Mahiyanganaya","Moneragala","Welimada","Bibile",
  "Galle","Matara","Hambantota","Weligama","Unawatuna","Hikkaduwa",
  "Ambalangoda","Tangalle","Tissamaharama","Dickwella","Koggala","Mirissa",
  "Deniyaya","Akuressa","Elpitiya","Jaffna","Kilinochchi","Mannar",
  "Vavuniya","Mullaitivu","Chavakachcheri","Point Pedro","Nelliady","Kayts",
  "Trincomalee","Batticaloa","Ampara","Kalmunai","Sammanthurai","Akkaraipattu",
  "Kattankudy","Valaichchenai","Eravur","Chenkaladi","Kurunegala","Puttalam",
  "Kuliyapitiya","Narammala","Wariyapola","Chilaw","Wennappuwa","Marawila",
  "Nikaweratiya","Maho","Alawwa","Pannala","Nattandiya","Anuradhapura",
  "Polonnaruwa","Kekirawa","Medawachchiya","Tambuttegama","Eppawala",
  "Mihintale","Hingurakgoda","Kaduruwela","Medirigiriya","Wellawaya",
  "Diyatalawa","Passara","Ella","Hali-Ela","Ratnapura","Kegalle","Balangoda",
  "Embilipitiya","Avissawella","Ruwanwella","Mawanella","Rambukkana",
  "Warakapola","Eheliyagoda","Kuruwita","Kahawatta","Pelmadulla",
];

const ROOM_TYPE_LABELS = {
  single: "Single Room",
  sharing: "Sharing",
  annex: "Annex",
  boarding: "Boarding",
  apartment: "Apartment",
  full_house: "Full House",
  short_stay: "Short Stay",
  rental: "Rental",
};

const WHO_LABELS = {
  student: "Student",
  professional: "Professional",
  family: "Family",
  other: "Other",
};

const Input = ({ ...props }) => (
  <input
    {...props}
    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 placeholder:text-slate-400"
  />
);

const Select = ({ children, ...props }) => (
  <select
    {...props}
    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-800"
  >
    {children}
  </select>
);

export default function Home() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef();
  const postMenuRef = useRef();

  const [activeTab, setActiveTab] = useState("rooms");
  const [searchCity, setSearchCity] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showPostMenu, setShowPostMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Room filters
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [roomTypeFilter, setRoomTypeFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");

  // Request filters
  const [maxBudgetFilter, setMaxBudgetFilter] = useState("");
  const [whoAmIFilter, setWhoAmIFilter] = useState("");
  const [durationFilter, setDurationFilter] = useState("");

  // Rooms
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [roomsError, setRoomsError] = useState(null);
  const [roomsPage, setRoomsPage] = useState(1);
  const [roomsTotalPages, setRoomsTotalPages] = useState(1);
  const [totalRooms, setTotalRooms] = useState(0);

  // Requests
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestsError, setRequestsError] = useState(null);
  const [requestsPage, setRequestsPage] = useState(1);
  const [requestsTotalPages, setRequestsTotalPages] = useState(1);
  const [totalRequests, setTotalRequests] = useState(0);

  const buildRoomParams = (page) => {
    const p = new URLSearchParams({ page, limit: 10 });
    if (searchCity) p.append("city", searchCity);
    if (minPrice) p.append("minPrice", minPrice);
    if (maxPrice) p.append("maxPrice", maxPrice);
    if (roomTypeFilter) p.append("roomType", roomTypeFilter);
    if (genderFilter) p.append("genderPreference", genderFilter);
    return p;
  };

  const buildRequestParams = (page) => {
    const p = new URLSearchParams({ page, limit: 10 });
    if (searchCity) p.append("city", searchCity);
    if (maxBudgetFilter) p.append("maxBudget", maxBudgetFilter);
    if (whoAmIFilter) p.append("whoAmI", whoAmIFilter);
    if (durationFilter) p.append("duration", durationFilter);
    return p;
  };

  const fetchRooms = async (page = 1) => {
    try {
      setRoomsLoading(true);
      setRoomsError(null);
      const res = await api.get(`/room/?${buildRoomParams(page)}`);
      setRooms(res.data.data);
      setRoomsTotalPages(res.data.totalPage || 1);
      setTotalRooms(res.data.totalRooms || 0);
      setRoomsPage(res.data.page || 1);
    } catch (e) {
      setRoomsError(e.response?.data?.message || "Something went wrong");
    } finally {
      setRoomsLoading(false);
    }
  };

  const fetchRequests = async (page = 1) => {
    try {
      setRequestsLoading(true);
      setRequestsError(null);
      const res = await api.get(`/request/?${buildRequestParams(page)}`);
      setRequests(res.data.data);
      setRequestsTotalPages(res.data.totalPage || 1);
      setTotalRequests(res.data.totalRequests || 0);
      setRequestsPage(res.data.page || 1);
    } catch (e) {
      setRequestsError(e.response?.data?.message || "Something went wrong");
    } finally {
      setRequestsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms(1);
    fetchRequests(1);
  }, []);
  useEffect(() => {
    fetchRooms(roomsPage);
  }, [roomsPage]);
  useEffect(() => {
    fetchRequests(requestsPage);
  }, [requestsPage]);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setShowProfileMenu(false);
      if (postMenuRef.current && !postMenuRef.current.contains(e.target))
        setShowPostMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setRoomsPage(1);
    setRequestsPage(1);
    fetchRooms(1);
    fetchRequests(1);
  };

  const handleApplyFilters = () => {
    setRoomsPage(1);
    setRequestsPage(1);
    fetchRooms(1);
    fetchRequests(1);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setRoomTypeFilter("");
    setGenderFilter("");
    setMaxBudgetFilter("");
    setWhoAmIFilter("");
    setDurationFilter("");
    setSearchCity("");
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    localStorage.removeItem("token");
    logout();
    window.location.href = "/";
  };

  const goPost = (path) => {
    setShowPostMenu(false);
    user ? navigate(path) : navigate("/");
  };

  const hasFilters =
    minPrice ||
    maxPrice ||
    roomTypeFilter ||
    genderFilter ||
    maxBudgetFilter ||
    whoAmIFilter ||
    durationFilter ||
    searchCity;

  const Pagination = ({ page, totalPages, setPage }) =>
    totalPages > 1 ? (
      <div className="mt-10 flex items-center justify-center gap-3">
        <button
          onClick={() => {
            setPage((p) => Math.max(p - 1, 1));
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          disabled={page === 1}
          className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition"
        >
          ← Prev
        </button>
        <span className="text-sm text-slate-500 font-medium">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => {
            setPage((p) => Math.min(p + 1, totalPages));
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          disabled={page === totalPages}
          className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition"
        >
          Next →
        </button>
      </div>
    ) : null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── NAVBAR ── */}
      <nav className="w-full bg-white border-b border-slate-200 px-5 py-3 flex items-center gap-4 sticky top-0 z-50">
        {/* Logo */}
        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 shrink-0"
        >
          <span className="text-lg font-black text-slate-900 hidden sm:block">
            RoomLK
          </span>
        </button>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="flex-1 flex gap-2 max-w-lg mx-auto"
        >
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <select
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-slate-800"
            >
              <option value="">All cities</option>
              {SL_CITIES.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition shrink-0"
          >
            Search
          </button>
        </form>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Filter */}
          <button
            onClick={() => setShowFilters((p) => !p)}
            className={`p-2.5 rounded-xl border transition text-sm font-medium flex items-center gap-1.5 ${showFilters || hasFilters ? "bg-blue-600 border-blue-600 text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
          >
            <SlidersHorizontal size={15} />
            <span className="hidden md:block">Filters</span>
            {hasFilters && !showFilters && (
              <span className="w-2 h-2 rounded-full bg-white block" />
            )}
          </button>

          {/* Post + dropdown */}
          <div className="relative" ref={postMenuRef}>
            <button
              onClick={() => setShowPostMenu((p) => !p)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
            >
              + Post <ChevronDown size={14} />
            </button>
            {showPostMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50">
                <button
                  onClick={() => goPost("/create-room")}
                  className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition"
                >
                  <div>
                    <div className="font-semibold">Post a Room</div>
                    <div className="text-xs text-slate-400">
                      List your space
                    </div>
                  </div>
                </button>
                <div className="h-px bg-slate-100" />
                <button
                  onClick={() => goPost("/post-request")}
                  className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition"
                >
                  <div>
                    <div className="font-semibold">Post a Request</div>
                    <div className="text-xs text-slate-400">Find a room</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Profile or Login */}
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowProfileMenu((p) => !p)}
                className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm hover:bg-blue-700 transition"
              >
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="font-semibold text-sm text-slate-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {user.email}
                    </p>
                  </div>
                  {[
                    {
                      icon: <User size={14} />,
                      label: "Update Profile",
                      action: () => navigate(`/profile/${user?.id}`),
                    },
                    {
                      icon: <FileText size={14} />,
                      label: "My Rooms",
                      action: () => navigate("/my-rooms"),
                    },
                    {
                      icon: <FileText size={14} />,
                      label: "My Requests",
                      action: () => navigate("/my-requests"),
                    },
                  ].map(({ icon, label, action }) => (
                    <button
                      key={label}
                      onClick={() => {
                        action();
                        setShowProfileMenu(false);
                      }}
                      className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition"
                    >
                      {icon} {label}
                    </button>
                  ))}
                  <div className="h-px bg-slate-100" />
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowProfileMenu(false);
                    }}
                    className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/")}
                className="px-3 py-2.5 text-sm font-semibold text-slate-700 hover:text-blue-600 transition"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* ── FILTER PANEL ── */}
      {showFilters && (
        <div className="bg-white border-b border-slate-200 px-5 py-5 sticky top-14.25 z-40">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-700">
                {activeTab === "rooms" ? "Filter Rooms" : "Filter Requests"}
              </h3>
              {hasFilters && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition"
                >
                  <X size={12} /> Clear all
                </button>
              )}
            </div>

            {activeTab === "rooms" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                    Min Price
                  </p>
                  <Input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Rs 0"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                    Max Price
                  </p>
                  <Input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Any"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                    Room Type
                  </p>
                  <Select
                    value={roomTypeFilter}
                    onChange={(e) => setRoomTypeFilter(e.target.value)}
                  >
                    <option value="">Any type</option>
                    {Object.entries(ROOM_TYPE_LABELS).map(([v, l]) => (
                      <option key={v} value={v}>
                        {l}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                    City
                  </p>
                  <Select
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                  >
                    <option value="">All Cities</option>
                    {SL_CITIES.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                    Gender
                  </p>
                  <Select
                    value={genderFilter}
                    onChange={(e) => setGenderFilter(e.target.value)}
                  >
                    <option value="">Any</option>
                    <option value="male">Male only</option>
                    <option value="female">Female only</option>
                    <option value="any">Mixed</option>
                  </Select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleApplyFilters}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition"
                  >
                    Apply
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                    City
                  </p>
                  <Select
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                  >
                    <option value="">All Cities</option>
                    {SL_CITIES.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                    Max Budget
                  </p>
                  <Input
                    type="number"
                    value={maxBudgetFilter}
                    onChange={(e) => setMaxBudgetFilter(e.target.value)}
                    placeholder="Any"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                    Looking For
                  </p>
                  <Select
                    value={whoAmIFilter}
                    onChange={(e) => setWhoAmIFilter(e.target.value)}
                  >
                    <option value="">Anyone</option>
                    <option value="student">Student</option>
                    <option value="professional">Professional</option>
                    <option value="family">Family</option>
                  </Select>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                    Duration
                  </p>
                  <Select
                    value={durationFilter}
                    onChange={(e) => setDurationFilter(e.target.value)}
                  >
                    <option value="">Any</option>
                    <option value="long_term">Long Term</option>
                    <option value="short_term">Short Term</option>
                  </Select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleApplyFilters}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TABS ── */}
      <div className="bg-white border-b border-slate-200 px-5">
        <div className="max-w-6xl mx-auto flex gap-1 -mb-px">
          {[
            { key: "rooms", label: "Rooms", count: totalRooms },
            { key: "requests", label: "Room Requests", count: totalRequests },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-5 py-3.5 text-sm font-semibold border-b-2 transition ${
                activeTab === key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {label}
              <span
                className={`ml-2 text-xs px-2 py-0.5 rounded-full font-bold ${
                  activeTab === key
                    ? "bg-blue-100 text-blue-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-6xl mx-auto px-5 py-6">
        {activeTab === "rooms" ? (
          <>
            {roomsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-slate-200 p-4 flex gap-4 animate-pulse"
                  >
                    <div className="w-32 h-24 bg-slate-200 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-slate-200 rounded w-3/4" />
                      <div className="h-3 bg-slate-200 rounded w-1/2" />
                      <div className="h-4 bg-slate-200 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : roomsError ? (
              <div className="text-center py-20 text-red-500 font-semibold">
                {roomsError}
              </div>
            ) : rooms.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-slate-600 font-bold text-xl mb-1">
                  No rooms found
                </p>
                <p className="text-slate-400 text-sm">
                  Try adjusting your search or clear filters
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rooms.map((room) => (
                  <div
                    key={room._id}
                    onClick={() => navigate(`/view-room/${room._id}`)}
                    className="group bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer overflow-hidden flex gap-0"
                  >
                    {/* Image */}
                    <div className="w-36 shrink-0 bg-slate-100 relative overflow-hidden">
                      {room.mediaIDs?.length > 0 ? (
                        <img
                          src={room.mediaIDs[0].url}
                          alt={room.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-1"></div>
                      )}
                    </div>
                    {/* Content */}
                    <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                            {ROOM_TYPE_LABELS[room.roomType] || room.roomType}
                          </span>
                          {room.genderPreference &&
                            room.genderPreference !== "any" && (
                              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-pink-50 text-pink-600">
                                {room.genderPreference} only
                              </span>
                            )}
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm line-clamp-1 mb-0.5">
                          {room.title
                            ? room.title.charAt(0).toUpperCase() +
                              room.title.slice(1)
                            : room.location}
                        </h3>
                        <p className="text-slate-400 text-xs flex items-center gap-1 line-clamp-1">
                          <svg
                            className="w-3 h-3 shrink-0"
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
                          {room.location}
                        </p>
                      </div>
                      <div className="flex items-end justify-between mt-3">
                        <div>
                          <span className="text-emerald-600 font-black text-base">
                            Rs {room.price?.toLocaleString()}
                          </span>
                          <span className="text-slate-400 text-xs">/mo</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const url = `${window.location.origin}/view-room/${room._id}`;
                            if (navigator.share) {
                              navigator.share({
                                title: room.title || room.location,
                                text: `Check out this room in ${room.location} - Rs ${room.price?.toLocaleString()}/mo`,
                                url,
                              });
                            } else {
                              navigator.clipboard.writeText(url);
                              alert("Link copied!");
                            }
                          }}
                          className="text-slate-400 hover:text-blue-500 transition p-1"
                          title="Share"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Pagination
              page={roomsPage}
              totalPages={roomsTotalPages}
              setPage={setRoomsPage}
            />
          </>
        ) : (
          <>
            {requestsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse space-y-3"
                  >
                    <div className="h-4 bg-slate-200 rounded w-1/2" />
                    <div className="h-3 bg-slate-200 rounded w-3/4" />
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                  </div>
                ))}
              </div>
            ) : requestsError ? (
              <div className="text-center py-20 text-red-500 font-semibold">
                {requestsError}
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">📋</div>
                <p className="text-slate-600 font-bold text-xl mb-1">
                  No room requests yet
                </p>
                <p className="text-slate-400 text-sm mb-6">
                  Be the first to post what you're looking for
                </p>
                <button
                  onClick={() => goPost("/post-request")}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition text-sm"
                >
                  Post a Request
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requests.map((req) => {
                  const waLink = req.whatsapp
                    ? `https://wa.me/94${req.whatsapp.replace(/^0/, "")}`
                    : null;
                  return (
                    <div
                      key={req._id}
                      onClick={() => navigate(`/view-request/${req._id}`)}
                      className="bg-white rounded-2xl border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all p-5 cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex gap-3 flex-1 min-w-0">
                          {/* Avatar */}
                          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 font-black text-sm shrink-0">
                            {(WHO_LABELS[req.whoAmI] || "?").charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                                {WHO_LABELS[req.whoAmI] || req.whoAmI}
                              </span>
                              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                {req.gender}
                              </span>
                              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                {req.duration === "short_term"
                                  ? "Short term"
                                  : "Long term"}
                              </span>
                            </div>
                            <p className="font-bold text-slate-900 text-sm flex items-center gap-1">
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
                              {req.lookingIn}
                            </p>
                            <p className="text-emerald-600 font-black text-sm mt-1">
                              Up to Rs {req.maxBudget?.toLocaleString()}{" "}
                              <span className="text-slate-400 font-normal">
                                /mo
                              </span>
                            </p>
                            {req.bio && (
                              <p className="text-slate-400 text-xs mt-1.5 line-clamp-2">
                                {req.bio}
                              </p>
                            )}
                          </div>
                        </div>
                        {waLink && (
                          <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition"
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            Chat
                          </a>
                        )}
                      </div>
                      <p className="text-slate-300 text-xs mt-3 text-right">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
            <Pagination
              page={requestsPage}
              totalPages={requestsTotalPages}
              setPage={setRequestsPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
