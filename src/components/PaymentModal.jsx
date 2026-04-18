import React, { useState } from 'react';

const PaymentModal = ({ bookingDetails, onPaymentSuccess, onCancel }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRazorpay = async () => {
    setIsProcessing(true);
    
    // Simulate loading external script and processing
    setTimeout(() => {
      // Create a dummy Razorpay-like popup for demo UI
      const mockSuccessResponse = {
        razorpay_payment_id: "pay_" + Math.random().toString(36).substr(2, 9),
      };
      
      setIsProcessing(false);
      onPaymentSuccess(mockSuccessResponse);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Complete Payment</h3>
            <p className="text-sm text-gray-500 mt-1">Secure checkout via Razorpay</p>
          </div>
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
            ₹
          </div>
        </div>
        
        <div className="p-8">
          <div className="mb-8 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Service</span>
              <span className="font-bold text-gray-900">{bookingDetails.service}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Date</span>
              <span className="font-bold text-gray-900">{bookingDetails.date ? new Date(bookingDetails.date).toLocaleDateString() : ''}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Time</span>
              <span className="font-bold text-gray-900">{bookingDetails.time}</span>
            </div>
            <div className="border-t border-dashed border-gray-200 pt-4 mt-2 flex justify-between items-center">
              <span className="font-bold text-gray-500 uppercase tracking-widest text-xs">Total Amount</span>
              <span className="font-black text-blue-600 text-2xl">₹{bookingDetails.price}</span>
            </div>
          </div>

          <div className="space-y-3">
            <button 
              onClick={handleRazorpay}
              disabled={isProcessing}
              className="w-full relative flex items-center justify-center p-4 bg-[#3395FF] hover:bg-[#2B80DE] text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-75 disabled:hover:shadow-md disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing secure payment...' : 'Pay with Razorpay'}
              {isProcessing && (
                <div className="absolute right-4 w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
            </button>
            <button 
              onClick={onCancel}
              disabled={isProcessing}
              className="w-full p-4 text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              Cancel Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
