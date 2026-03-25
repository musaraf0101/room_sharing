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
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const SL_CITIES = [
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
    className="w-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
  />
);

const Select = ({ children, ...props }) => (
  <select
    {...props}
    className="w-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-white"
  >
    {children}
  </select>
);

export default function Home() {
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const menuRef = useRef();
  const postMenuRef = useRef();

  const [activeTab, setActiveTab] = useState("rooms");
  const [searchCity, setSearchCity] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const cityRef = useRef();
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

  const [clearTrigger, setClearTrigger] = useState(0);

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
    if (clearTrigger === 0) return;
    fetchRooms(1);
    fetchRequests(1);
  }, [clearTrigger]);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setShowProfileMenu(false);
      if (postMenuRef.current && !postMenuRef.current.contains(e.target))
        setShowPostMenu(false);
      if (cityRef.current && !cityRef.current.contains(e.target))
        setShowCitySuggestions(false);
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
    setCityInput("");
    setClearTrigger((t) => t + 1);
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
          className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 transition"
        >
          ← Prev
        </button>
        <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => {
            setPage((p) => Math.min(p + 1, totalPages));
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          disabled={page === totalPages}
          className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 transition"
        >
          Next →
        </button>
      </div>
    ) : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* ── NAVBAR ── */}
      <nav className="w-full bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-5 py-3 flex items-center gap-4 sticky top-0 z-50">
        {/* Logo */}
        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 shrink-0"
        >
          <span className="text-lg font-black text-slate-900 dark:text-white hidden sm:block">
            RoomLK
          </span>
        </button>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="flex-1 flex gap-2 max-w-lg mx-auto"
        >
          <div className="relative flex-1" ref={cityRef}>
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
            <input
              type="text"
              value={cityInput}
              onChange={(e) => {
                setCityInput(e.target.value);
                setSearchCity("");
                setShowCitySuggestions(true);
              }}
              onFocus={() => setShowCitySuggestions(true)}
              placeholder="Search city..."
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
            {showCitySuggestions && cityInput.length > 0 && (
              <ul className="absolute z-50 top-full mt-1 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl shadow-lg max-h-52 overflow-y-auto">
                {SL_CITIES.filter((c) =>
                  c.toLowerCase().includes(cityInput.toLowerCase()),
                ).length === 0 ? (
                  <li className="px-4 py-2.5 text-sm text-slate-400 dark:text-slate-500">
                    No cities found
                  </li>
                ) : (
                  SL_CITIES.filter((c) =>
                    c.toLowerCase().includes(cityInput.toLowerCase()),
                  ).map((city) => (
                    <li
                      key={city}
                      onMouseDown={() => {
                        setSearchCity(city);
                        setCityInput(city);
                        setShowCitySuggestions(false);
                      }}
                      className="px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400 cursor-pointer"
                    >
                      {city}
                    </li>
                  ))
                )}
              </ul>
            )}
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
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            title={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Filter */}
          <button
            onClick={() => setShowFilters((p) => !p)}
            className={`p-2.5 rounded-xl border transition text-sm font-medium flex items-center gap-1.5 ${showFilters || hasFilters ? "bg-blue-600 border-blue-600 text-white" : "border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
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
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
                <button
                  onClick={() => goPost("/create-room")}
                  className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
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
                  className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                >
                  <div>
                    <div className="font-semibold">Post a Request</div>
                    <div className="text-xs text-slate-400 dark:text-slate-500">
                      Find a room
                    </div>
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
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                    <p className="font-semibold text-sm text-slate-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
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
                      className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                    >
                      {icon} {label}
                    </button>
                  ))}
                  <div className="h-px bg-slate-100 dark:bg-slate-700" />
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowProfileMenu(false);
                    }}
                    className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
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
                className="px-3 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* ── FILTER PANEL ── */}
      {showFilters && (
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-5 py-5 sticky top-14.25 z-40">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">
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
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
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
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
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
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
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
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
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
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
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
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
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
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
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
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
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
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
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
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-5">
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
                  : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              {label}
              <span
                className={`ml-2 text-xs px-2 py-0.5 rounded-full font-bold ${
                  activeTab === key
                    ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
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
                    className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex gap-4 animate-pulse"
                  >
                    <div className="w-32 h-24 bg-slate-200 dark:bg-slate-700 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
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
                <p className="text-slate-600 dark:text-slate-300 font-bold text-xl mb-1">
                  No rooms found
                </p>
                <p className="text-slate-400 dark:text-slate-500 text-sm">
                  Try adjusting your search or clear filters
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rooms.map((room) => (
                  <div
                    key={room._id}
                    onClick={() => navigate(`/view-room/${room._id}`)}
                    className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all cursor-pointer overflow-hidden flex gap-0"
                  >
                    {/* Image */}
                    <div className="w-36 shrink-0 bg-slate-100 dark:bg-slate-700 relative overflow-hidden">
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
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                            {ROOM_TYPE_LABELS[room.roomType] || room.roomType}
                          </span>
                          {room.genderPreference &&
                            room.genderPreference !== "any" && (
                              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400">
                                {room.genderPreference} only
                              </span>
                            )}
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1 mb-0.5">
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
                    className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 animate-pulse space-y-3"
                  >
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
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
                <p className="text-slate-600 dark:text-slate-300 font-bold text-xl mb-1">
                  No room requests yet
                </p>
                <p className="text-slate-400 dark:text-slate-500 text-sm mb-6">
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
                {requests.map((req) => (
                  <div
                    key={req._id}
                    onClick={() => navigate(`/view-request/${req._id}`)}
                    className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-600 hover:shadow-md transition-all cursor-pointer p-5"
                  >
                    <div className="flex gap-3 flex-1 min-w-0">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-700 dark:text-amber-400 font-black text-sm shrink-0">
                        {(WHO_LABELS[req.whoAmI] || "?").charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                            {WHO_LABELS[req.whoAmI] || req.whoAmI}
                          </span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            {req.gender}
                          </span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            {req.duration === "short_term"
                              ? "Short term"
                              : "Long term"}
                          </span>
                        </div>
                        <p className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1">
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
                        {req.bio && (
                          <p className="text-slate-400 dark:text-slate-500 text-xs mt-1.5 line-clamp-2">
                            {req.bio}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-end justify-between mt-3">
                      <div>
                        <span className="text-emerald-600 font-black text-base">
                          Rs {req.maxBudget?.toLocaleString()}
                        </span>
                        <span className="text-slate-400 text-xs">/mo max</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const url = `${window.location.origin}/view-request/${req._id}`;
                          if (navigator.share) {
                            navigator.share({
                              title: `Room request in ${req.lookingIn}`,
                              text: `Looking for a room in ${req.lookingIn} - Budget Rs ${req.maxBudget?.toLocaleString()}/mo`,
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
                ))}
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
