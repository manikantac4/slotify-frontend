import React, { useState } from 'react';

const SellerDashboard = ({ slots, setSlots, holidays, setHolidays }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [newTime, setNewTime] = useState('');
  const [newHoliday, setNewHoliday] = useState('');

  const addSlot = () => {
    if (!newTime) return;
    const newSlot = {
      id: Date.now().toString(),
      time: newTime,
      isBooked: false,
    };
    setSlots([...slots, newSlot].sort((a, b) => a.time.localeCompare(b.time)));
    setNewTime('');
  };

  const removeSlot = (id) => {
    setSlots(slots.filter(s => s.id !== id));
  };

  const addHoliday = () => {
    if (!newHoliday) return;
    if (!holidays.includes(newHoliday)) {
      setHolidays([...holidays, newHoliday].sort());
    }
    setNewHoliday('');
  };

  const removeHoliday = (date) => {
    setHolidays(holidays.filter(h => h !== date));
  };

  const totalSlots = slots.length;
  const bookedSlots = slots.filter(s => s.isBooked).length;

  return (
    <div className="min-h-screen pt-16 bg-gray-50 flex animate-in fade-in duration-300">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col gap-2 shadow-sm min-h-[calc(100vh-4rem)]">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 mt-2 px-2">Seller Menu</h2>
        <button 
          onClick={() => setActiveTab('dashboard')} 
          className={`text-left px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          Dashboard
        </button>
        <button 
          onClick={() => setActiveTab('slots')} 
          className={`text-left px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'slots' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          Manage Slots
        </button>
        <button 
          onClick={() => setActiveTab('holidays')} 
          className={`text-left px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'holidays' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          Holidays
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'dashboard' && (
            <div className="animate-in slide-in-from-bottom-2 duration-300">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Seller Dashboard</h1>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                  <h3 className="text-gray-500 font-medium mb-2 uppercase tracking-wide text-xs">Shop Info</h3>
                  <p className="text-2xl font-bold text-gray-900">Premium Sparkle Salon</p>
                  <p className="text-sm text-green-600 font-medium mt-3 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span> Active & Accepting Bookings
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
                    <h3 className="text-gray-500 font-medium mb-2 text-xs uppercase tracking-wide">Total Slots</h3>
                    <p className="text-4xl font-black text-gray-900">{totalSlots}</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
                    <h3 className="text-gray-500 font-medium mb-2 text-xs uppercase tracking-wide">Booked</h3>
                    <p className="text-4xl font-black text-blue-600">{bookedSlots}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'slots' && (
            <div className="animate-in slide-in-from-bottom-2 duration-300">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Slots</h1>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Add a New Slot</h3>
                <div className="flex gap-4 max-w-md">
                  <input 
                    type="time" 
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="flex-1 p-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 font-medium block"
                  />
                  <button onClick={addSlot} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-colors shadow-sm">
                    Add Slot
                  </button>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-6 text-lg">Current Availability (Daily Schedule)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {slots.length === 0 && <p className="text-gray-500 text-sm col-span-full">No slots added yet.</p>}
                  {slots.map(slot => (
                    <div key={slot.id} className="relative group border border-gray-200 rounded-xl p-5 flex flex-col items-center justify-center bg-gray-50 hover:bg-white hover:border-blue-200 hover:shadow-md transition-all">
                      <span className="font-extrabold text-gray-800 text-lg">{slot.time}</span>
                      <span className={`text-[10px] uppercase font-bold mt-2 tracking-wider px-2 py-0.5 rounded-full ${slot.isBooked ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                        {slot.isBooked ? 'Booked' : 'Available'}
                      </span>
                      <button 
                        onClick={() => removeSlot(slot.id)}
                        className="absolute -top-2.5 -right-2.5 bg-red-100 text-red-600 w-7 h-7 rounded-full text-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm hover:bg-red-600 hover:text-white"
                        title="Remove Slot"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'holidays' && (
            <div className="animate-in slide-in-from-bottom-2 duration-300">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Holidays</h1>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
                <h3 className="font-bold text-gray-900 mb-2 text-lg">Block a Date</h3>
                <p className="text-sm text-gray-500 mb-6">Select a date. On this date, none of your slots will be available to customers.</p>
                <div className="flex gap-4 max-w-md">
                  <input 
                    type="date" 
                    value={newHoliday}
                    onChange={(e) => setNewHoliday(e.target.value)}
                    className="flex-1 p-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 font-medium"
                  />
                  <button onClick={addHoliday} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-colors shadow-sm">
                    Add Holiday
                  </button>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-6 text-lg">Blocked Dates</h3>
                <div className="space-y-3">
                  {holidays.length === 0 && <p className="text-gray-500 text-sm">No holidays scheduled.</p>}
                  {holidays.map(date => (
                    <div key={date} className="flex items-center justify-between p-5 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-sm transition-all">
                      <span className="font-medium text-gray-800">
                        {new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                      <button onClick={() => removeHoliday(date)} className="text-red-500 text-sm font-bold hover:text-red-700 transition-colors uppercase tracking-wider">
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
