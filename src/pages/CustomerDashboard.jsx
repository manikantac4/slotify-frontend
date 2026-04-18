import React, { useState, useMemo } from 'react';
import PaymentModal from '../components/PaymentModal';

const CustomerDashboard = ({ slots, setSlots, holidays }) => {
  const [service, setService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  
  const [showPayment, setShowPayment] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [ticketDetails, setTicketDetails] = useState(null);

  const isHoliday = holidays.includes(selectedDate);

  const availableSlots = useMemo(() => {
    if (!selectedDate || isHoliday) return [];
    return slots.slice().sort((a, b) => a.time.localeCompare(b.time));
  }, [slots, selectedDate, isHoliday]);

  const handleConfirmClick = () => {
    if (!service || !selectedDate || !selectedSlotId) return;
    setShowPayment(true);
  };

  const handlePaymentSuccess = (paymentResponse) => {
    setShowPayment(false);
    
    // Mark slot as booked
    setSlots(prev => prev.map(s => 
      s.id === selectedSlotId ? { ...s, isBooked: true } : s
    ));
    
    const bookedSlot = slots.find(s => s.id === selectedSlotId);
    
    setTicketDetails({
      service,
      date: selectedDate,
      time: bookedSlot.time,
      price: 199,
      paymentId: paymentResponse.razorpay_payment_id
    });
    
    setBookingConfirmed(true);
  };

  if (bookingConfirmed && ticketDetails) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-gray-50 flex items-center justify-center p-6 animate-in fade-in duration-500">
        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full border border-gray-100 text-center animate-in zoom-in-95 duration-500 delay-100">
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Booking Confirmed!</h2>
          <p className="text-gray-500 mb-8 font-medium">Your service has been successfully scheduled.</p>
          
          <div className="bg-gray-50/80 rounded-2xl p-6 text-left space-y-4 border border-gray-100/50 shadow-inner">
            <div>
              <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Service</span>
              <span className="font-bold text-gray-900">{ticketDetails.service}</span>
            </div>
            <div>
              <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Date & Time</span>
              <span className="font-bold text-gray-900">{new Date(ticketDetails.date).toLocaleDateString()} at {ticketDetails.time}</span>
            </div>
            <div>
              <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Payment ID</span>
              <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block">{ticketDetails.paymentId}</span>
            </div>
          </div>

          <button 
            onClick={() => {
              setBookingConfirmed(false);
              setService('');
              setSelectedDate('');
              setSelectedSlotId(null);
            }}
            className="mt-8 text-blue-600 font-bold hover:text-blue-800 transition-colors uppercase tracking-wider text-sm px-6 py-2 rounded-full hover:bg-blue-50"
          >
            Book Another Service
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50 px-6 animate-in fade-in duration-300">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Book a Service</h1>
        <p className="text-gray-500 mb-10 text-lg">Follow the steps below to secure your appointment securely.</p>
        
        <div className="space-y-6">
          {/* Step 1 */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-lg">1</div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Select Service</h2>
            </div>
            <select 
              value={service} 
              onChange={(e) => setService(e.target.value)}
              className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 font-medium"
            >
              <option value="" disabled>Choose a service...</option>
              <option value="Salon">Salon</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Repair">Repair</option>
            </select>
          </div>

          {/* Step 2 */}
          <div className={`bg-white p-8 rounded-3xl shadow-sm border border-gray-100 transition-all duration-300 ${!service ? 'opacity-50 pointer-events-none filter grayscale-[50%]' : 'hover:shadow-md'}`}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-lg">2</div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Select Date</h2>
            </div>
            <input 
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedSlotId(null);
              }}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 font-medium"
            />
          </div>

          {/* Step 3 */}
          <div className={`bg-white p-8 rounded-3xl shadow-sm border border-gray-100 transition-all duration-300 ${!selectedDate ? 'opacity-50 pointer-events-none filter grayscale-[50%]' : 'hover:shadow-md'}`}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-lg">3</div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Available Slots</h2>
            </div>
            
            {selectedDate && isHoliday ? (
               <div className="p-6 bg-red-50 border border-red-100 text-red-600 rounded-xl text-center font-bold">
                 The seller is not available on this date (Holiday). Please select another date.
               </div>
            ) : selectedDate && !isHoliday ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {availableSlots.length === 0 && <p className="text-gray-500 font-medium col-span-full">No slots available for this date.</p>}
                {availableSlots.map(slot => {
                  const isSelected = selectedSlotId === slot.id;
                  const isDisabled = slot.isBooked;

                  return (
                    <button
                      key={slot.id}
                      disabled={isDisabled}
                      onClick={() => setSelectedSlotId(slot.id)}
                      className={`
                        py-4 px-2 rounded-xl font-bold text-sm border-2 transition-all block text-center
                        ${isDisabled 
                          ? 'bg-gray-100 border-gray-100 text-gray-400 cursor-not-allowed opacity-70' 
                          : isSelected 
                            ? 'bg-blue-600 border-blue-600 text-white shadow-md transform scale-[1.02]' 
                            : 'bg-white border-blue-100 text-blue-600 hover:border-blue-600 hover:bg-blue-50'}
                      `}
                    >
                      {slot.time}
                    </button>
                  )
                })}
              </div>
            ) : null}
          </div>

          <div className="pt-6 flex justify-end">
            <button 
              onClick={handleConfirmClick}
              disabled={!service || !selectedDate || !selectedSlotId}
              className="bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-50 disabled:hover:bg-[#2563eb] text-white font-bold py-4 px-12 rounded-xl shadow-lg transition-all hover:shadow-xl text-lg hover:-translate-y-0.5 disabled:transform-none disabled:cursor-not-allowed"
            >
              Proceed to Booking
            </button>
          </div>
        </div>
      </div>

      {showPayment && (
        <PaymentModal 
          bookingDetails={{
            service,
            date: selectedDate,
            time: slots.find(s => s.id === selectedSlotId)?.time,
            price: 199
          }}
          onPaymentSuccess={handlePaymentSuccess}
          onCancel={() => setShowPayment(false)}
        />
      )}
    </div>
  );
}

export default CustomerDashboard;
