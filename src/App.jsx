<<<<<<< HEAD
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import SellerDashboard from './pages/SellerDashboard';
import CustomerDashboard from './pages/CustomerDashboard';

function App() {
  const [view, setView] = useState('landing');

  // Shared application state to simulate DB
  const [slots, setSlots] = useState([
    { id: '1', time: '09:00', isBooked: false },
    { id: '2', time: '10:00', isBooked: true },
    { id: '3', time: '11:00', isBooked: false },
    { id: '4', time: '14:00', isBooked: false },
    { id: '5', time: '15:00', isBooked: false },
  ]);

  const [holidays, setHolidays] = useState([]);

  return (
    <div className="font-sans text-gray-900 bg-gray-50 min-h-screen">
      <Navbar setView={setView} />

      <main>
        {view === 'landing' && <Landing setView={setView} />}
        {view === 'seller' && (
          <SellerDashboard
            slots={slots} setSlots={setSlots}
            holidays={holidays} setHolidays={setHolidays}
          />
        )}
        {view === 'customer' && (
          <CustomerDashboard
            slots={slots} setSlots={setSlots}
            holidays={holidays}
          />
        )}
      </main>
    </div>
=======
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./components/Landingpage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
      </Routes>
    </Router>
>>>>>>> be74b9acff48cdc11316beed9838b718fd6ed803
  );
}

export default App;