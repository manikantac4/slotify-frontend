import React from 'react';

const Navbar = ({ setView }) => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" 
          onClick={() => setView('landing')}
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">
            S
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">Slotify</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView('seller')} 
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Seller Portal
          </button>
          <button 
            onClick={() => setView('customer')} 
            className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors shadow-sm cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
