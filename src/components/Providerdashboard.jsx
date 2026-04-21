import React, { useState, useRef, useEffect } from 'react';
import {
  Store,
  LogOut,
  MapPin,
  Phone,
  Mail,
  Clock,
  CalendarDays,
  Tag,
  ChevronDown,
  AlertCircle,
  Zap,
  CheckCircle2,
  AlertCircle as AlertWarning,
  XCircle,
  RefreshCw,
} from 'lucide-react';
import API from '../api/axios'; // Your existing axios instance
import { useNavigate } from 'react-router-dom'; 
// ============================================================================
// STATUS CONFIGURATION
// ============================================================================

const STATUS_CONFIG = {
  confirmed: {
    label: 'Confirmed',
    badge: 'bg-emerald-100 text-emerald-800',
    dot: 'bg-emerald-500',
    icon: CheckCircle2,
  },
  pending: {
    label: 'Pending',
    badge: 'bg-yellow-100 text-yellow-800',
    dot: 'bg-yellow-400',
    icon: AlertWarning,
  },
  cancelled: {
    label: 'Cancelled',
    badge: 'bg-red-100 text-red-700',
    dot: 'bg-red-400',
    icon: XCircle,
  },
};

const SLOT_STYLE = {
  available: 'bg-yellow-50 text-yellow-800 border border-yellow-200 hover:bg-yellow-100',
  booked: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
  past: 'bg-gray-100 text-gray-400 border border-gray-100',
};

const AVATAR_COLORS = [
  'bg-yellow-100 text-yellow-800',
  'bg-purple-100 text-purple-800',
  'bg-blue-100 text-blue-800',
  'bg-pink-100 text-pink-800',
  'bg-teal-100 text-teal-800',
  'bg-red-100 text-red-800',
  'bg-green-100 text-green-800',
];

const avatarColor = (index) => AVATAR_COLORS[index % AVATAR_COLORS.length];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const formatDateForAPI = (date = new Date()) => {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
};

const getDayOffsetDate = (dayIndex = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + dayIndex);
  return formatDateForAPI(date);
};

const mergeSlotswithBookings = (slots, bookings, date) => {
  if (!slots || !bookings) return slots || [];
  
  const now = new Date();
  
  return slots.map((time) => {
    // Create a date-time object to compare
    const slotTime = new Date(`${date}T${time}`);
    
    // Check if slot is in the past
    const isPast = slotTime < now;
    
    // Check if slot is booked
    const isBooked = bookings?.some((b) => b.time === time);
    
    // Determine state
    let state = 'available';
    if (isPast) state = 'past';
    else if (isBooked) state = 'booked';
    
    return { time, state };
  });
};

const getDateString = (dayIndex = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + dayIndex);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
};

// ============================================================================
// PROFILE DROPDOWN COMPONENT
// ============================================================================

function ProfileDropdown({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function close(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  if (!user) return null;

  const initials = user.name
    ?.split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'U';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-all duration-200 hover:border-gray-300 hover:shadow-sm"
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-sm">
          {initials}
        </div>
        <span className="text-sm font-semibold text-gray-700 hidden sm:block truncate max-w-[120px]">
          {user.name || 'User'}
        </span>
        <ChevronDown
          size={14}
          className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="px-5 pt-5 pb-4 border-b border-gray-100 bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-3 border-white flex items-center justify-center text-base font-bold text-white shadow-md">
                {initials}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 mt-0.5 capitalize">{user.role}</p>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="px-5 py-4 flex flex-col gap-3">
            {user.email && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Mail size={13} className="text-blue-600" />
                </div>
                <span className="text-xs text-gray-600 truncate">{user.email}</span>
              </div>
            )}
            {user.phone && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                  <Phone size={13} className="text-green-600" />
                </div>
                <span className="text-xs text-gray-600">{user.phone}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
            <button
              onClick={() => {
                onLogout();
                setOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors duration-150"
            >
              <LogOut size={13} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// BOOKING CARD COMPONENT
// ============================================================================

function BookingCard({ booking, index }) {
  const statusConfig = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
  const IconComponent = statusConfig.icon;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3.5 flex items-center justify-between hover:border-gray-300 hover:bg-gray-50/50 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-center gap-3 flex-1">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ring-2 ring-white shadow-sm ${avatarColor(
            index
          )}`}
        >
          {booking.userName?.slice(0, 2).toUpperCase() || 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900">{booking.userName}</p>
          <p className="text-xs text-gray-400 mt-0.5 truncate">{booking.service?.name || 'Service'}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <Clock size={10} className="text-gray-400 flex-shrink-0" />
            <span className="text-xs text-gray-500 font-medium">{booking.time}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
        <span
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap ${statusConfig.badge}`}
        >
          <IconComponent size={12} />
          {statusConfig.label}
        </span>
      </div>
    </div>
  );
}

// ============================================================================
// SLOT CHIP COMPONENT
// ============================================================================

function SlotChip({ slot, isLoading }) {
  if (isLoading) {
    return <div className="rounded-xl px-3 py-2 text-xs font-bold bg-gray-200 animate-pulse" />;
  }

  return (
    <div
      className={`rounded-xl px-3 py-2 text-xs font-bold text-center transition-all duration-200 cursor-default ${SLOT_STYLE[slot.state]}`}
      title={`Slot: ${slot.time} - ${slot.state}`}
    >
      {slot.time}
    </div>
  );
}

// ============================================================================
// STAT CARD COMPONENT
// ============================================================================

function StatCard({ icon: Icon, iconBg, iconColor, value, label, isLoading }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 flex items-center gap-4 hover:border-gray-300 hover:shadow-md transition-all duration-200 hover:bg-gray-50/30">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ring-2 ring-white shadow-sm ${iconBg}`}>
        <Icon size={20} className={iconColor} />
      </div>
      <div className="flex-1">
        {isLoading ? (
          <>
            <div className="h-6 bg-gray-200 rounded w-12 animate-pulse mb-2" />
            <div className="h-3 bg-gray-100 rounded w-20 animate-pulse" />
          </>
        ) : (
          <>
            <p className="text-2xl font-bold text-gray-900 leading-none">{value}</p>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide font-medium">{label}</p>
          </>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// SERVICE LIST COMPONENT
// ============================================================================

function ServicesList({ services, isLoading }) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-xl h-16 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
          <AlertCircle size={22} className="text-gray-300" />
        </div>
        <p className="text-sm font-semibold text-gray-400">No services added</p>
        <p className="text-xs text-gray-300 mt-1">Add services to your profile</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {services.map((service, index) => (
        <div
          key={service.id || index}
          className="bg-white border border-gray-100 rounded-xl px-4 py-3 flex items-center justify-between hover:border-gray-300 hover:shadow-sm transition-all duration-200 group"
        >
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">{service.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {service.duration} min • ₹{service.price}
            </p>
          </div>
          <Tag size={16} className="text-gray-300 group-hover:text-gray-400 transition-colors" />
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// DAY SELECTOR COMPONENT
// ============================================================================

function DaySelector({ selectedDay, onDayChange, isLoading }) {
  const days = ['Today', 'Tomorrow', '+2 Days', '+3 Days', '+4 Days'];

  return (
    <div className="flex gap-2 mb-5 overflow-x-auto pb-2">
      {days.map((day, index) => (
        <button
          key={index}
          onClick={() => onDayChange(index)}
          disabled={isLoading}
          className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
            selectedDay === index
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl'
              : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {day}
        </button>
      ))}
    </div>
  );
}

// ============================================================================
// MAIN DASHBOARD COMPONENT
// ============================================================================

export default function ProviderDashboard() {
  // State
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [slots, setSlots] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedDay, setSelectedDay] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  // Get auth data from localStorage
 const uid = localStorage.getItem('userId');

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!uid) {
        window.location.href = '/login';
        return;
      }

      const date = getDayOffsetDate(selectedDay);

      // Fetch user, slots, and bookings in parallel
      // Note: Services come from slots API, no separate API call needed
      

const [userRes, slotsRes, bookingsRes] = await Promise.all([
  API.get(`/user/${uid}`),
  API.get(`/shop/slots/${uid}`, { params: { dayIndex: selectedDay } }), // ✅ FIXED
  API.get(`/bookings/${uid}`, { params: { date } }), // ✅ FIXED
]);

      // Set user
      setUser(userRes.data);

      // Get slots, services, and bookings from responses
      const { slots: rawSlots, services } = slotsRes.data;
      const bookingsData = bookingsRes.data || [];

      // Merge slots with bookings (now includes past slot detection)
      const mergedSlots = mergeSlotswithBookings(rawSlots, bookingsData, date);

      setSlots(mergedSlots);
      setBookings(bookingsData);
      setServices(services || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('shopId');
      } else {
        setError(err.response?.data?.message || 'Failed to load dashboard. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on mount and when selectedDay changes
  useEffect(() => {
  fetchData();
}, [selectedDay, uid]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('shopId');
    window.location.href = '/login';
  };

  // Calculate stats
  const bookedCount = slots.filter((s) => s.state === 'booked').length;
  const availableCount = slots.filter((s) => s.state === 'available').length;

  // Error state
  if (error && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-red-200 p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6 text-sm">{error}</p>
          <div className="flex gap-3">
            <button
              onClick={() => fetchData()}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw size={16} />
              Retry
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans">
      {/* ─── NAVBAR ─────────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <Store size={18} className="text-white" />
            </div>
            <div>
              <span className="text-base font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard
              </span>
              <p className="text-xs text-gray-400">Provider</p>
            </div>
          </div>

          {/* Right */}
          {/* Right */}
<div className="flex items-center gap-3">

  {/* 🔥 PROFILE BUTTON */}
  <button
    onClick={() => navigate("/profile")}
    className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition flex items-center gap-2"
  >
    Profile
  </button>

  {/* EXISTING DROPDOWN */}
  <ProfileDropdown user={user} onLogout={handleLogout} />

</div>
        </div>
      </header>

      {/* ─── MAIN ──────────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},
            {user?.name ? ` ${user.name.split(' ')[0]}` : ''} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-2">{getDateString(selectedDay)}</p>
        </div>

        {/* Day Selector */}
        <DaySelector selectedDay={selectedDay} onDayChange={setSelectedDay} isLoading={loading} />

        {/* Top Section: Bookings + Slots */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 mb-6">
          {/* LEFT — Today's Bookings */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <CalendarDays size={18} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Bookings</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{getDateString(selectedDay)}</p>
                </div>
              </div>
              <span className="text-xs font-bold bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-3 py-1.5 rounded-full">
                {bookings.length} total
              </span>
            </div>

            {loading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-2xl h-20 animate-pulse" />
                ))}
              </div>
            ) : bookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                  <AlertCircle size={24} className="text-gray-300" />
                </div>
                <p className="text-sm font-semibold text-gray-500">No bookings today</p>
                <p className="text-xs text-gray-400 mt-1">Your schedule is clear</p>
              </div>
            ) : (
              <div className="space-y-2">
                {bookings.map((booking, index) => (
                  <BookingCard key={booking.id || index} booking={booking} index={index} />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — Today's Slots */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center">
                <Clock size={18} className="text-yellow-600" />
              </div>
              <h2 className="text-sm font-bold text-gray-900">Time Slots</h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 gap-2">
                {[...Array(8)].map((_, i) => (
                  <SlotChip key={i} slot={{ time: '' }} isLoading={true} />
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2 mb-5">
                  {slots.map((slot) => (
                    <SlotChip key={slot.time} slot={slot} isLoading={loading} />
                  ))}
                </div>

                {/* Legend */}
                <div className="border-t border-gray-100 pt-4 space-y-2 mb-4">
                  {[
                    { label: 'Available', style: 'bg-yellow-100 border border-yellow-200' },
                    { label: 'Booked', style: 'bg-emerald-100 border border-emerald-200' },
                    { label: 'Past', style: 'bg-gray-100 border border-gray-100' },
                  ].map((l) => (
                    <div key={l.label} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-sm flex-shrink-0 ${l.style}`} />
                      <span className="text-xs text-gray-500 font-medium">{l.label}</span>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl px-4 py-3 flex items-center justify-between">
                  <span className="text-xs text-yellow-700 font-semibold">
                    {bookedCount} booked · {availableCount} open
                  </span>
                  <span className="text-xs font-bold text-yellow-800">{slots.length} total</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bottom Section: Stats + Services */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <StatCard
            icon={CalendarDays}
            iconBg="bg-gradient-to-br from-blue-100 to-blue-50"
            iconColor="text-blue-600"
            value={bookings.length}
            label="Total Bookings"
            isLoading={loading}
          />
          <StatCard
            icon={Zap}
            iconBg="bg-gradient-to-br from-yellow-100 to-yellow-50"
            iconColor="text-yellow-600"
            value={bookedCount + availableCount}
            label="Total Slots"
            isLoading={loading}
          />
          <StatCard
            icon={Tag}
            iconBg="bg-gradient-to-br from-purple-100 to-purple-50"
            iconColor="text-purple-600"
            value={services.length}
            label="Services"
            isLoading={loading}
          />
        </div>

        {/* Services Section */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
              <Tag size={18} className="text-purple-600" />
            </div>
            <h2 className="text-sm font-bold text-gray-900">Services Offered</h2>
          </div>
          <ServicesList services={services} isLoading={loading} />
        </div>
      </main>
    </div>
  );
}