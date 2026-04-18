import React, { useState } from 'react';

const Landing = ({ setView }) => {
  const [service, setService] = useState('Salon');
  const [date, setDate] = useState('');

  const navigateToCustomer = () => {
    setView('customer');
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col items-center animate-in fade-in duration-500">
      {/* Hero */}
      <section className="w-full max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 mt-8">
          Book Services in <span className="text-blue-600">Seconds</span>
        </h1>
        <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto">
          Choose your slot, avoid conflicts, and confirm instantly. 
          The smartest way to manage your time and appointments.
        </p>

        {/* Main Action Card */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-4 animate-in slide-in-from-bottom-2 duration-500 delay-150">
          <div className="flex-1 w-full text-left">
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Service</label>
            <select 
              value={service} 
              onChange={(e) => setService(e.target.value)}
              className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-gray-700 font-medium"
            >
              <option value="Salon">Salon</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Repair">Repair</option>
            </select>
          </div>
          <div className="flex-1 w-full text-left">
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Date</label>
            <input 
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-gray-700 font-medium"
            />
          </div>
          <div className="flex-shrink-0 w-full md:w-auto mt-5 md:mt-0 pt-1">
            <button 
              onClick={navigateToCustomer}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-xl shadow-md transition-all hover:shadow-lg"
            >
              Check Availability
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="w-full max-w-5xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl font-bold mb-6">⚡</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Booking</h3>
            <p className="text-gray-500 font-medium leading-relaxed">No more back-and-forth emails. See live availability and secure your slot right away.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl font-bold mb-6">🗓️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Management</h3>
            <p className="text-gray-500 font-medium leading-relaxed">Sellers have absolute control over their schedules, blocking out holidays and break times.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl font-bold mb-6">🔄</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Real-Time Sync</h3>
            <p className="text-gray-500 font-medium leading-relaxed">Double bookings are a thing of the past with our real-time synchronization engine.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full text-center py-16 pb-24">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">Start Booking Smarter Today</h2>
        <button onClick={navigateToCustomer} className="bg-gray-900 hover:bg-black text-white font-medium py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105">
          Get Started ✨
        </button>
      </section>
    </div>
  );
};

export default Landing;
