import React, { useState } from 'react';
import { Truck, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export const PinCodeChecker = () => {
  const [pincode, setPincode] = useState('');
  const [result, setResult] = useState(null);
  const [checking, setChecking] = useState(false);

  const handleCheck = (e) => {
    e.preventDefault();
    if (!pincode || pincode.trim().length !== 6 || !/^\d+$/.test(pincode)) {
      setResult({
        serviceable: false,
        message: 'Please enter a valid 6-digit Indian PIN code.',
      });
      return;
    }

    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      // Realistic check simulation
      const codeNum = parseInt(pincode, 10);
      const isExpressCity = pincode.startsWith('40') || pincode.startsWith('11') || pincode.startsWith('56') || pincode.startsWith('60') || pincode.startsWith('50') || pincode.startsWith('70');
      
      setResult({
        serviceable: true,
        deliveryTime: isExpressCity ? '1 - 2 Business Days' : '3 - 4 Business Days',
        courier: 'Blue Dart Luxury Fragrance Express',
        codAvailable: true,
        freeDelivery: true,
      });
    }, 500);
  };

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <Truck className="w-4 h-4 text-brand-emerald" />
        <span className="text-sm font-semibold text-brand-emerald">
          Delivery & Availability Check
        </span>
      </div>

      <form onSubmit={handleCheck} className="flex gap-2">
        <input
          type="text"
          maxLength={6}
          placeholder="Enter 6-digit PIN code"
          value={pincode}
          onChange={(e) => {
            setPincode(e.target.value);
            setResult(null);
          }}
          className="flex-1 px-3 py-2 text-sm bg-white border border-stone-300 rounded focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald"
        />
        <button
          type="submit"
          disabled={checking}
          className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-brand-emerald hover:bg-brand-dark-forest transition-colors rounded disabled:opacity-60"
        >
          {checking ? 'Checking...' : 'Check'}
        </button>
      </form>

      {result && (
        <div className="mt-3 pt-3 border-t border-stone-200 text-xs space-y-1">
          {result.serviceable ? (
            <>
              <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Delivery is available to PIN {pincode}
              </div>
              <div className="flex items-center gap-1.5 text-stone-600">
                <Clock className="w-3.5 h-3.5 text-brand-gold" />
                Estimated delivery in <strong className="text-stone-800">{result.deliveryTime}</strong>
              </div>
              <div className="text-stone-500">
                Cash on Delivery (COD) & Complimentary Insurance included.
              </div>
            </>
          ) : (
            <div className="flex items-center gap-1.5 text-rose-700">
              <AlertCircle className="w-3.5 h-3.5" />
              {result.message}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
