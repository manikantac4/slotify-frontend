import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  MapPin, Phone, Mail, Clock, CalendarDays, ChevronDown,
  AlertCircle, CheckCircle2, XCircle, RefreshCw, ArrowLeft,
  Store, LogOut, User, Edit3, Save, X, Star, Zap, Tag,
  ChevronRight, Search, Loader2, CheckCheck, Calendar,
} from 'lucide-react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

// ============================================================================
// CONSTANTS & CONFIG
// ============================================================================

const BOOKING_STATUS = {
  confirmed: {
    label: 'Confirmed', badge: 'bg-blue-100 text-blue-800', dot: 'bg-blue-500', icon: CheckCircle2,
  },
  pending: {
    label: 'Pending', badge: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-400', icon: AlertCircle,
  },
  cancelled: {
    label: 'Cancelled', badge: 'bg-red-100 text-red-700', dot: 'bg-red-400', icon: XCircle,
  },
  completed: {
    label: 'Completed', badge: 'bg-emerald-100 text-emerald-800', dot: 'bg-emerald-500', icon: CheckCheck,
  },
};

const AVATAR_COLORS = [
  'bg-blue-100 text-blue-800', 'bg-indigo-100 text-indigo-800',
  'bg-sky-100 text-sky-800',   'bg-cyan-100 text-cyan-800',
  'bg-violet-100 text-violet-800', 'bg-purple-100 text-purple-800',
];
const avatarColor = (i) => AVATAR_COLORS[i % AVATAR_COLORS.length];

// ============================================================================
// HELPERS
// ============================================================================

const formatDateForAPI = (date = new Date()) => date.toISOString().split('T')[0];

const getDayOffsetDate = (dayIndex = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + dayIndex);
  return formatDateForAPI(d);
};

const getDateLabel = (dayIndex = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + dayIndex);
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
};

const getDayTabLabel = (i) => ['Today', 'Tomorrow', '+2 Days', '+3 Days', '+4 Days'][i] || `+${i} Days`;

const isUpcoming = (date, time) => {
  if (!date || !time) return false;
  return new Date(`${date}T${time}`) > new Date();
};

// ============================================================================
// PROFILE DROPDOWN
// ============================================================================

function ProfileDropdown({ user, onLogout, onProfile }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  if (!user) return null;
  const initials = user.name?.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase() || 'U';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-all duration-200 hover:border-blue-300 hover:shadow-sm"
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-sm">
          {initials}
        </div>
        <span className="text-sm font-semibold text-gray-700 hidden sm:block truncate max-w-[120px]">{user.name || 'User'}</span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden">
          <div className="px-5 pt-5 pb-4 border-b border-gray-100 bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-base font-bold text-white shadow-md">
                {initials}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 mt-0.5 capitalize">{user.role || 'Customer'}</p>
              </div>
            </div>
          </div>
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
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex flex-col gap-1.5">
            <button
              onClick={() => { onProfile(); setOpen(false); }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors duration-150"
            >
              <User size={13} /> My Profile
            </button>
            <button
              onClick={() => { onLogout(); setOpen(false); }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors duration-150"
            >
              <LogOut size={13} /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// STAT CARD
// ============================================================================

function StatCard({ icon: Icon, iconBg, iconColor, value, label, isLoading }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl px-4 sm:px-5 py-4 flex items-center gap-3 sm:gap-4 hover:border-blue-200 hover:shadow-md transition-all duration-200">
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ring-2 ring-white shadow-sm ${iconBg}`}>
        <Icon size={18} className={iconColor} />
      </div>
      <div className="flex-1">
        {isLoading ? (
          <><div className="h-6 bg-gray-200 rounded w-10 animate-pulse mb-1.5" /><div className="h-3 bg-gray-100 rounded w-20 animate-pulse" /></>
        ) : (
          <><p className="text-xl sm:text-2xl font-bold text-gray-900 leading-none">{value}</p>
          <p className="text-[10px] sm:text-xs text-gray-400 mt-1 uppercase tracking-wide font-medium">{label}</p></>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// BOOKING CARD (dashboard list)
// ============================================================================

function BookingCard({ booking, index }) {
  const upcoming = isUpcoming(booking.date, booking.time);
  // FIX: fallback to 'pending' only if status is truly missing; support all known statuses
  const cfg = BOOKING_STATUS[booking.status] ?? BOOKING_STATUS.pending;
  const Icon = cfg.icon;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3.5 flex items-center justify-between hover:border-blue-200 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ring-2 ring-white shadow-sm ${avatarColor(index)}`}>
          {booking.shopName?.slice(0, 2).toUpperCase() || 'SH'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate">{booking.shopName || 'Shop'}</p>
          <p className="text-xs text-gray-400 mt-0.5 truncate">{booking.service?.name || 'Service'}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <div className="flex items-center gap-1">
              <Calendar size={10} className="text-gray-400 flex-shrink-0" />
              <span className="text-xs text-gray-500 font-medium">{booking.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={10} className="text-gray-400 flex-shrink-0" />
              <span className="text-xs text-gray-500 font-medium">{booking.time}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0 ml-2">
        <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${cfg.badge}`}>
          <Icon size={11} />{cfg.label}
        </span>
        {booking.service?.price && (
          <span className="text-xs font-bold text-blue-600">₹{booking.service.price}</span>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// SHOP CARD
// ============================================================================

function ShopCard({ shop, onView }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-blue-200 hover:shadow-lg transition-all duration-200 group flex flex-col">
      {/* Image */}
      <div className="h-36 sm:h-40 bg-gradient-to-br from-blue-50 to-indigo-100 flex-shrink-0 relative overflow-hidden">
        {shop.shopImage && !imgError ? (
          <img src={shop.shopImage} alt={shop.shopName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={() => setImgError(true)} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Store size={36} className="text-blue-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        {shop.rating && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
            <Star size={10} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold text-gray-800">{shop.rating}</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="px-4 py-3.5 flex flex-col gap-2 flex-1">
        <h3 className="text-sm font-bold text-gray-900 truncate">{shop.shopName || 'Shop Name'}</h3>
        {shop.location && (
          <div className="flex items-center gap-1.5">
            <MapPin size={11} className="text-blue-500 flex-shrink-0" />
            <span className="text-xs text-gray-500 truncate">{shop.location}</span>
          </div>
        )}
        {shop.phone && (
          <div className="flex items-center gap-1.5">
            <Phone size={11} className="text-blue-500 flex-shrink-0" />
            <span className="text-xs text-gray-500">{shop.phone}</span>
          </div>
        )}
        <button
          onClick={() => onView(shop)}
          className="mt-auto w-full py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-1.5"
        >
          View & Book <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// SHOP DETAIL / BOOKING FLOW PAGE
// ============================================================================

function ShopDetailPage({ shop, userId, userName, userPhone, onBack, onBookingSuccess }) {
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slots, setSlots] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // FIX: removed unused `bookedSlots` state

  const fetchSlots = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setSelectedSlot(null);

      const date = getDayOffsetDate(selectedDay);
      const [slotsRes, bookingsRes] = await Promise.all([
        API.get(`/shop/slots/${shop.ownerId}`, { params: { dayIndex: selectedDay } }),
        API.get(`/bookings/${shop.ownerId}`, { params: { date } }),
      ]);

      const { slots: rawSlots, services: svcList } = slotsRes.data;
      const bookingsData = bookingsRes.data || [];
      const bookedTimes = bookingsData.map((b) => b.time);

      const now = new Date();
      const merged = (rawSlots || []).map((time) => {
        const slotTime = new Date(`${date}T${time}`);
        const isPast = slotTime < now;
        const isBooked = bookedTimes.includes(time);
        return { time, state: isPast ? 'past' : isBooked ? 'booked' : 'available' };
      });

      setSlots(merged);
      setServices(svcList || []);
    } catch (e) {
      setError('Failed to load slots. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [shop.ownerId, selectedDay]);

  useEffect(() => { fetchSlots(); }, [fetchSlots]);

  const handleConfirmBooking = async () => {
    if (!selectedService || !selectedSlot) return;

    // FIX: guard against missing userId before making the API call
    if (!userId) {
      setError('User session not found. Please log in again.');
      return;
    }

    try {
      setBooking(true);
      setError(null);
      await API.post('/bookings/create', {
        ownerId: shop.ownerId,
        userId,
        userName,
        phone: userPhone || '',
        service: { name: selectedService.name, price: selectedService.price },
        date: getDayOffsetDate(selectedDay),
        time: selectedSlot,
      });
      setSuccess(true);
      setTimeout(() => { onBookingSuccess(); }, 2200);
    } catch (e) {
      setError(e.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-5 animate-bounce">
          <CheckCircle2 size={40} className="text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Booking Confirmed! 🎉</h2>
        <p className="text-sm text-gray-500">Your appointment has been booked successfully.</p>
        <p className="text-xs text-gray-400 mt-1">Redirecting to dashboard…</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back + Shop header */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack} className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
          <ArrowLeft size={16} className="text-gray-600" />
        </button>
        <div>
          <h2 className="text-base font-bold text-gray-900">{shop.shopName}</h2>
          {shop.location && (
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin size={11} className="text-blue-500" />
              <span className="text-xs text-gray-500">{shop.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── STEP 1: Date ── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 mb-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3.5">
          <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">1</div>
          <h3 className="text-sm font-bold text-gray-900">Select Date</h3>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[0,1,2,3,4].map((i) => (
            <button
              key={i}
              onClick={() => { setSelectedDay(i); setSelectedSlot(null); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all duration-200 ${
                selectedDay === i
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                  : 'bg-gray-50 border border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              {getDayTabLabel(i)}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2.5 ml-0.5">{getDateLabel(selectedDay)}</p>
      </div>

      {/* ── STEP 2: Service ── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 mb-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3.5">
          <div className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 ${selectedService ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
          <h3 className="text-sm font-bold text-gray-900">Select Service</h3>
        </div>
        {loading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_,i) => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : services.length === 0 ? (
          <p className="text-xs text-gray-400 py-4 text-center">No services available</p>
        ) : (
          <div className="space-y-2">
            {services.map((svc, i) => (
              <button
                key={svc._id || svc.name || i}
                onClick={() => setSelectedService(svc)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 text-left ${
                  selectedService?.name === svc.name
                    ? 'border-blue-400 bg-blue-50 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50/40'
                }`}
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900">{svc.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{svc.duration} min</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-blue-600">₹{svc.price}</span>
                  {selectedService?.name === svc.name && <CheckCircle2 size={16} className="text-blue-500" />}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── STEP 3: Time Slot ── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 mb-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3.5">
          <div className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 ${selectedSlot ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
          <h3 className="text-sm font-bold text-gray-900">Select Time Slot</h3>
        </div>
        {loading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {[...Array(8)].map((_,i) => <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : slots.length === 0 ? (
          <p className="text-xs text-gray-400 py-4 text-center">No slots available for this day</p>
        ) : (
          <>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4">
              {slots.map((slot) => {
                const isSelected = selectedSlot === slot.time;
                const disabled = slot.state !== 'available';
                return (
                  <button
                    key={slot.time}
                    disabled={disabled}
                    onClick={() => !disabled && setSelectedSlot(slot.time)}
                    className={`py-2.5 rounded-xl text-xs font-bold text-center transition-all duration-200 border ${
                      disabled
                        ? slot.state === 'booked'
                          ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed line-through'
                          : 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                        : isSelected
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-transparent shadow-md scale-105'
                          : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300'
                    }`}
                  >
                    {slot.time}
                  </button>
                );
              })}
            </div>
            {/* Legend */}
            <div className="flex items-center gap-4 flex-wrap">
              {[
                { color: 'bg-blue-100 border border-blue-200', label: 'Available' },
                { color: 'bg-gray-100 border border-gray-100', label: 'Booked' },
                { color: 'bg-gray-50 border border-gray-100', label: 'Past' },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className={`w-3 h-3 rounded-sm ${l.color}`} />
                  <span className="text-xs text-gray-400">{l.label}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── STEP 4: Confirm ── */}
      {selectedService && selectedSlot && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 sm:p-5 mb-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">4</div>
            <h3 className="text-sm font-bold text-gray-900">Confirm Booking</h3>
          </div>
          <div className="bg-white rounded-xl border border-blue-100 p-4 mb-4 space-y-2.5">
            {[
              { label: 'Shop',    value: shop.shopName },
              { label: 'Service', value: `${selectedService.name} — ₹${selectedService.price}` },
              { label: 'Date',    value: getDateLabel(selectedDay) },
              { label: 'Time',    value: selectedSlot },
              { label: 'Name',    value: userName },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-xs text-gray-400 font-medium">{label}</span>
                <span className="text-xs font-semibold text-gray-800">{value}</span>
              </div>
            ))}
          </div>
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
              <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
              <span className="text-xs text-red-700">{error}</span>
            </div>
          )}
          <button
            onClick={handleConfirmBooking}
            disabled={booking}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {booking ? <><Loader2 size={16} className="animate-spin" /> Booking…</> : <><CheckCircle2 size={16} /> Confirm Booking</>}
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// PROFILE PAGE
// ============================================================================

// FIX: accept userId as a prop instead of reading from localStorage inside component
function ProfilePage({ user, userId, onBack, onSave }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  const initials = form.name.split(' ').slice(0,2).map((n) => n[0]).join('').toUpperCase() || 'U';

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      await API.put(`/user/${userId}`, { name: form.name, email: form.email, phone: form.phone });
      setSaved(true);
      setEditing(false);
      onSave({ ...user, ...form });
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to save. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
          <ArrowLeft size={16} className="text-gray-600" />
        </button>
        <h2 className="text-base font-bold text-gray-900">My Profile</h2>
      </div>

      {/* Avatar block */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 mb-4 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg mb-3">
          {initials}
        </div>
        <p className="text-base font-bold text-gray-900">{form.name || 'Your Name'}</p>
        <p className="text-xs text-gray-500 mt-0.5 capitalize">{user?.role || 'Customer'}</p>
      </div>

      {/* Details card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-900">Personal Info</h3>
          {!editing ? (
            <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
              <Edit3 size={12} /> Edit
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={() => { setEditing(false); setForm({ name: user?.name||'', email: user?.email||'', phone: user?.phone||'' }); setError(null); }} className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors">
                <X size={12} /> Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-1 text-xs font-semibold text-white bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60">
                {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          )}
        </div>

        {saved && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 mb-4">
            <CheckCircle2 size={14} className="text-emerald-600" />
            <span className="text-xs font-semibold text-emerald-700">Profile updated successfully!</span>
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 mb-4">
            <AlertCircle size={14} className="text-red-500" />
            <span className="text-xs text-red-700">{error}</span>
          </div>
        )}

        <div className="space-y-4">
          {[
            { key: 'name', label: 'Full Name', icon: User, type: 'text', placeholder: 'Enter your name' },
            { key: 'email', label: 'Email Address', icon: Mail, type: 'email', placeholder: 'Enter your email' },
            { key: 'phone', label: 'Phone Number', icon: Phone, type: 'tel', placeholder: 'Enter your phone' },
          ].map(({ key, label, icon: Icon, type, placeholder }) => (
            <div key={key}>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">{label}</label>
              {editing ? (
                <div className="flex items-center gap-2.5 border border-blue-300 rounded-xl px-3.5 py-2.5 bg-blue-50/40 focus-within:border-blue-400 focus-within:bg-blue-50 transition-all">
                  <Icon size={14} className="text-blue-500 flex-shrink-0" />
                  <input
                    type={type}
                    value={form[key]}
                    onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-300"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2.5 border border-gray-100 rounded-xl px-3.5 py-2.5 bg-gray-50">
                  <Icon size={14} className="text-blue-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{form[key] || <span className="text-gray-300">{placeholder}</span>}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN CUSTOMER DASHBOARD
// ============================================================================

export default function CustomerDashboard() {
  // ── views: 'dashboard' | 'shop' | 'profile'
  const [view, setView] = useState('dashboard');
  const [selectedShop, setSelectedShop] = useState(null);

  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [bookingTab, setBookingTab] = useState('upcoming'); // 'upcoming' | 'completed'

  // FIX: useNavigate is imported but was unused — kept for potential future use (e.g. navigate('/login'))
  const navigate = useNavigate();
  const uid = localStorage.getItem('userId');

  // ── Fetch dashboard data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!uid) { navigate('/login'); return; }

      const [userRes, bookingsRes, shopsRes] = await Promise.all([
        API.get(`/user/${uid}`),
        API.get(`/bookings/user/${uid}`),
        API.get('/shop/all'),
      ]);

      setUser(userRes.data);
      setBookings(bookingsRes.data || []);
      setShops(shopsRes.data || []);
    } catch (e) {
      if (e.response?.status === 401) {
        setError('Session expired. Please log in again.');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
      } else {
        setError(e.response?.data?.message || 'Failed to load. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [uid, navigate]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleLogout = () => {
    ['authToken','userId','shopId'].forEach((k) => localStorage.removeItem(k));
    navigate('/login');
  };

  // ── Derived
  const upcomingBookings  = bookings.filter((b) => isUpcoming(b.date, b.time));
  const completedBookings = bookings.filter((b) => !isUpcoming(b.date, b.time));
  const shownBookings     = bookingTab === 'upcoming' ? upcomingBookings : completedBookings;

  const filteredShops = shops.filter((s) =>
    !search ||
    s.shopName?.toLowerCase().includes(search.toLowerCase()) ||
    s.location?.toLowerCase().includes(search.toLowerCase())
  );

  // ── Error screen
  if (error && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-blue-200 p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6 text-sm">{error}</p>
          <div className="flex gap-3">
            <button onClick={fetchData} className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 text-sm">
              <RefreshCw size={15} /> Retry
            </button>
            <button onClick={handleLogout} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors text-sm">
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 font-sans">

      {/* ── NAVBAR ── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('dashboard')}>
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Zap size={18} className="text-white" />
            </div>
            <div>
              <span className="text-base font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Slotify</span>
              <p className="text-xs text-gray-400">Customer</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setView('profile')}
              className="px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-150 flex items-center gap-1.5"
            >
              <User size={15} /><span className="hidden sm:inline">Profile</span>
            </button>
            <ProfileDropdown user={user} onLogout={handleLogout} onProfile={() => setView('profile')} />
          </div>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* ─ PROFILE VIEW ─ */}
        {view === 'profile' && (
          <ProfilePage
            user={user}
            userId={uid}
            onBack={() => setView('dashboard')}
            onSave={(updated) => setUser(updated)}
          />
        )}

        {/* ─ SHOP DETAIL VIEW ─ */}
        {view === 'shop' && selectedShop && (
          <ShopDetailPage
            shop={selectedShop}
            userId={uid}
            userName={user?.name || ''}
            userPhone={user?.phone || ''}
            onBack={() => setView('dashboard')}
            onBookingSuccess={() => { setView('dashboard'); fetchData(); }}
          />
        )}

        {/* ─ DASHBOARD VIEW ─ */}
        {view === 'dashboard' && (
          <>
            {/* Greeting */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}
                {user?.name ? `, ${user.name.split(' ')[0]}` : ''} 👋
              </h1>
              <p className="text-sm text-gray-500 mt-1">{getDateLabel(0)}</p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <StatCard icon={CalendarDays} iconBg="bg-gradient-to-br from-blue-100 to-blue-50" iconColor="text-blue-600" value={bookings.length} label="Total Bookings" isLoading={loading} />
              <StatCard icon={Clock} iconBg="bg-gradient-to-br from-indigo-100 to-indigo-50" iconColor="text-indigo-600" value={upcomingBookings.length} label="Upcoming" isLoading={loading} />
              <div className="col-span-2 sm:col-span-1">
                <StatCard icon={Store} iconBg="bg-gradient-to-br from-sky-100 to-sky-50" iconColor="text-sky-600" value={shops.length} label="Shops Available" isLoading={loading} />
              </div>
            </div>

            {/* ── MY BOOKINGS ── */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm mb-6 sm:mb-8">
              <div className="flex items-center justify-between mb-4 sm:mb-5 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                    <CalendarDays size={17} className="text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-gray-900">My Bookings</h2>
                    <p className="text-xs text-gray-400 mt-0.5">{shownBookings.length} {bookingTab}</p>
                  </div>
                </div>
                {/* Tab toggle */}
                <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                  {['upcoming','completed'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setBookingTab(tab)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-200 ${
                        bookingTab === tab ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {loading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_,i) => <div key={i} className="bg-gray-100 rounded-2xl h-20 animate-pulse" />)}
                </div>
              ) : shownBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-3">
                    <CalendarDays size={22} className="text-blue-300" />
                  </div>
                  <p className="text-sm font-semibold text-gray-400">No {bookingTab} bookings</p>
                  <p className="text-xs text-gray-300 mt-1">
                    {bookingTab === 'upcoming' ? 'Book a service from the shops below' : 'Completed bookings will appear here'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {shownBookings.map((b, i) => <BookingCard key={b._id} booking={b} index={i} />)}
                </div>
              )}
            </div>

            {/* ── SHOPS LIST ── */}
            <div>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center">
                    <Store size={17} className="text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-gray-900">Explore Shops</h2>
                    <p className="text-xs text-gray-400 mt-0.5">{filteredShops.length} shops nearby</p>
                  </div>
                </div>
                {/* Search */}
                <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 bg-white hover:border-blue-300 focus-within:border-blue-400 transition-all duration-200 w-full sm:w-auto sm:min-w-[220px]">
                  <Search size={13} className="text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search shops or location…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 bg-transparent text-xs text-gray-700 outline-none placeholder:text-gray-300"
                  />
                  {search && <button onClick={() => setSearch('')}><X size={13} className="text-gray-300 hover:text-gray-500" /></button>}
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {[...Array(8)].map((_,i) => (
                    <div key={i} className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                      <div className="h-36 bg-gray-100 animate-pulse" />
                      <div className="p-4 space-y-2">
                        <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
                        <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
                        <div className="h-8 bg-gray-100 rounded-xl animate-pulse mt-3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredShops.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                    <Store size={26} className="text-blue-300" />
                  </div>
                  <p className="text-sm font-semibold text-gray-400">No shops found</p>
                  <p className="text-xs text-gray-300 mt-1">{search ? 'Try a different search' : 'Shops will appear here'}</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {filteredShops.map((shop, i) => (
                    <ShopCard
                      // FIX: use _id (MongoDB convention) with index fallback
                      key={shop._id || shop.id || i}
                      shop={shop}
                      onView={(s) => { setSelectedShop(s); setView('shop'); }}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}