import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import { razorpayService } from '../../services/razorpayService';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  Lock, 
  AlertCircle 
} from 'lucide-react';
import { toast } from 'sonner';

export const Checkout = () => {
  const { 
    items, 
    subtotal, 
    discountAmount, 
    shippingCharge, 
    totalAmount, 
    coupon, 
    clearCart 
  } = useCart();

  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Review
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Shipping Address Form
  const [address, setAddress] = useState({
    fullName: userProfile?.fullName || currentUser?.displayName || '',
    email: userProfile?.email || currentUser?.email || '',
    phone: userProfile?.phone || '',
    houseNumber: '',
    street: '',
    locality: '',
    city: '',
    state: '',
    pincode: '',
    addressType: 'Home',
  });

  const [paymentMethod, setPaymentMethod] = useState('razorpay'); // 'razorpay' or 'cod'

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!address.fullName || !address.phone || !address.pincode || !address.city || !address.houseNumber) {
      setError('Please complete all required delivery address fields.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');

    const customerSnapshot = {
      name: address.fullName,
      email: address.email || 'guest@abnoorperfumes.com',
      phone: address.phone,
    };

    const itemsSnapshot = items.map(item => ({
      productId: item.productId,
      productName: item.productName,
      brandName: item.brandName,
      variantId: item.variantId,
      variantSize: item.variantSize,
      sku: item.sku,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    }));

    if (paymentMethod === 'razorpay') {
      // Process through Razorpay
      const tempOrderNumber = `ABN-${Date.now().toString().slice(-6)}`;

      await razorpayService.openCheckout({
        amount: totalAmount,
        orderNumber: tempOrderNumber,
        customer: customerSnapshot,
        onSuccess: async (paymentDetails) => {
          try {
            const createdOrder = await orderService.createOrder({
              userId: currentUser?.uid || 'guest',
              customerSnapshot,
              itemsSnapshot,
              addressSnapshot: address,
              subtotal,
              discount: discountAmount,
              couponCode: coupon?.code || null,
              shippingCharge,
              tax: 0,
              totalAmount,
              paymentMethod: 'razorpay',
              paymentStatus: 'paid',
              paymentDetails,
            });

            clearCart();
            navigate(`/order-success/${createdOrder.id}`);
          } catch (err) {
            setError('Payment was received, but order saving failed. Please contact concierge with payment ID.');
            setLoading(false);
          }
        },
        onFailure: (err) => {
          setLoading(false);
          setError(err.reason || 'Payment could not be completed. Please try again.');
        },
      });
    } else {
      // Cash on Delivery
      try {
        const createdOrder = await orderService.createOrder({
          userId: currentUser?.uid || 'guest',
          customerSnapshot,
          itemsSnapshot,
          addressSnapshot: address,
          subtotal,
          discount: discountAmount,
          couponCode: coupon?.code || null,
          shippingCharge,
          tax: 0,
          totalAmount,
          paymentMethod: 'cod',
          paymentStatus: 'pending_cod',
        });

        clearCart();
        navigate(`/order-success/${createdOrder.id}`);
      } catch (err) {
        setError('Failed to confirm Cash on Delivery order.');
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Checkout Progress Stepper */}
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-stone-500">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-brand-emerald font-bold' : ''}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-brand-emerald text-white' : 'bg-stone-200'}`}>1</span>
            <span>Delivery Address</span>
          </div>
          <div className="w-12 h-0.5 bg-stone-200" />
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-brand-emerald font-bold' : ''}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-brand-emerald text-white' : 'bg-stone-200'}`}>2</span>
            <span>Payment Method</span>
          </div>
          <div className="w-12 h-0.5 bg-stone-200" />
          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-brand-emerald font-bold' : ''}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 3 ? 'bg-brand-emerald text-white' : 'bg-stone-200'}`}>3</span>
            <span>Review & Complete</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Checkout Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* Left 2 Columns: Forms */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* STEP 1: Address Form */}
          {step === 1 && (
            <div className="bg-white rounded-3xl border border-stone-200/80 p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-stone-100">
                <MapPin className="w-5 h-5 text-brand-gold" />
                <h3 className="font-playfair text-xl font-bold text-brand-emerald">
                  Delivery Address & Recipient
                </h3>
              </div>

              <form onSubmit={handleAddressSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-600 font-bold uppercase tracking-wider mb-1">
                      Recipient Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      placeholder="e.g. Faisal Al-Noor"
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-emerald"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-600 font-bold uppercase tracking-wider mb-1">
                      Mobile Phone Number (for Delivery SMS) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-600 font-bold uppercase tracking-wider mb-1">
                    Email Address (for Digital Invoice) *
                  </label>
                  <input
                    type="email"
                    required
                    value={address.email}
                    onChange={(e) => setAddress({ ...address, email: e.target.value })}
                    placeholder="concierge@example.com"
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-emerald"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-600 font-bold uppercase tracking-wider mb-1">
                      Flat / Villa / House No. *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.houseNumber}
                      onChange={(e) => setAddress({ ...address, houseNumber: e.target.value })}
                      placeholder="e.g. Penthouse 14B, Royal Crest"
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-emerald"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-600 font-bold uppercase tracking-wider mb-1">
                      Street / Road *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      placeholder="e.g. Altamount Road"
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-stone-600 font-bold uppercase tracking-wider mb-1">
                      6-Digit PIN Code *
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={address.pincode}
                      onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                      placeholder="400026"
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-emerald"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-600 font-bold uppercase tracking-wider mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      placeholder="Mumbai"
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-emerald"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-600 font-bold uppercase tracking-wider mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      placeholder="Maharashtra"
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-brand-emerald hover:bg-brand-dark-forest text-brand-soft-gold rounded-xl font-bold uppercase tracking-widest transition shadow-lg flex items-center justify-center gap-2 mt-4"
                >
                  <span>Continue to Payment Method</span>
                  <ArrowRight className="w-4 h-4 text-brand-gold" />
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: Payment Method */}
          {step === 2 && (
            <div className="bg-white rounded-3xl border border-stone-200/80 p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-brand-gold" />
                  <h3 className="font-playfair text-xl font-bold text-brand-emerald">
                    Select Payment Method
                  </h3>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-stone-400 hover:text-brand-emerald underline"
                >
                  Edit Address
                </button>
              </div>

              <div className="space-y-4">
                {/* Razorpay Online */}
                <label
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`block p-5 rounded-2xl border cursor-pointer transition ${
                    paymentMethod === 'razorpay'
                      ? 'border-brand-emerald bg-brand-emerald/5 ring-2 ring-brand-emerald'
                      : 'border-stone-200 hover:border-brand-gold'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center border-brand-emerald">
                        {paymentMethod === 'razorpay' && <div className="w-2.5 h-2.5 rounded-full bg-brand-emerald" />}
                      </div>
                      <div>
                        <strong className="text-sm text-brand-emerald block">
                          Instant Online Payment (Razorpay Secure)
                        </strong>
                        <span className="text-xs text-stone-500">
                          UPI (Google Pay, PhonePe, Paytm), All Credit & Debit Cards, NetBanking.
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold font-mono">
                      PREMIER
                    </span>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`block p-5 rounded-2xl border cursor-pointer transition ${
                    paymentMethod === 'cod'
                      ? 'border-brand-emerald bg-brand-emerald/5 ring-2 ring-brand-emerald'
                      : 'border-stone-200 hover:border-brand-gold'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center border-stone-300">
                        {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-brand-emerald" />}
                      </div>
                      <div>
                        <strong className="text-sm text-brand-emerald block">
                          Cash on Delivery (COD)
                        </strong>
                        <span className="text-xs text-stone-500">
                          Pay in cash or UPI upon handover by Blue Dart Courier.
                        </span>
                      </div>
                    </div>
                  </div>
                </label>
              </div>

              <div className="flex gap-4 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-3.5 border border-stone-300 rounded-xl text-xs font-bold uppercase tracking-wider text-stone-600 hover:bg-stone-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 py-3.5 bg-brand-emerald hover:bg-brand-dark-forest text-brand-soft-gold rounded-xl font-bold text-xs uppercase tracking-widest transition shadow-lg flex items-center justify-center gap-2"
                >
                  <span>Review Order</span>
                  <ArrowRight className="w-4 h-4 text-brand-gold" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Review & Complete */}
          {step === 3 && (
            <div className="bg-white rounded-3xl border border-brand-gold/30 p-8 shadow-xl space-y-6">
              <div className="pb-4 border-b border-stone-200 flex justify-between items-center">
                <h3 className="font-playfair text-xl font-bold text-brand-emerald">
                  Final Order Confirmation
                </h3>
                <span className="text-xs text-brand-gold font-semibold uppercase tracking-wider">
                  Ready to Dispatch
                </span>
              </div>

              {/* Delivery Destination Summary */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-1">
                <div className="flex justify-between font-bold text-stone-800">
                  <span>Shipping Destination</span>
                  <button onClick={() => setStep(1)} className="text-brand-emerald underline">Change</button>
                </div>
                <div className="text-stone-600">
                  {address.fullName} • {address.phone}<br />
                  {address.houseNumber}, {address.street}, {address.city}, {address.state} - {address.pincode}
                </div>
              </div>

              {/* Payment Method Summary */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-1">
                <div className="flex justify-between font-bold text-stone-800">
                  <span>Selected Payment</span>
                  <button onClick={() => setStep(2)} className="text-brand-emerald underline">Change</button>
                </div>
                <div className="text-stone-600 font-semibold">
                  {paymentMethod === 'razorpay' ? 'Razorpay Secure (Online UPI / Cards)' : 'Cash on Delivery (COD)'}
                </div>
              </div>

              {/* Confirmation Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full py-4 bg-brand-gold hover:bg-brand-soft-gold text-brand-dark-forest rounded-xl font-bold text-xs uppercase tracking-widest transition shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>{loading ? 'Processing Royal Order...' : `Confirm & Pay ₹${totalAmount.toLocaleString('en-IN')}`}</span>
              </button>
            </div>
          )}

        </div>

        {/* Right Column: Order Summary */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-sm space-y-6 sticky top-24">
          <h4 className="font-playfair text-lg font-bold text-brand-emerald pb-3 border-b border-stone-100">
            Order Review ({items.length} Scents)
          </h4>

          <div className="divide-y divide-stone-100 max-h-60 overflow-y-auto pr-1">
            {items.map((item, i) => (
              <div key={i} className="py-3 first:pt-0 last:pb-0 flex items-center gap-3 text-xs">
                <img src={item.image} alt="" className="w-12 h-12 object-cover rounded-lg border border-stone-200" />
                <div className="flex-1 min-w-0">
                  <strong className="text-stone-800 block truncate">{item.productName}</strong>
                  <span className="text-[11px] text-stone-500">{item.variantSize} × {item.quantity}</span>
                </div>
                <span className="font-bold text-stone-800">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs text-stone-600 pt-4 border-t border-stone-100">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-stone-800">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Promotional Discount</span>
                <span className="font-bold">-₹{discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Luxury Delivery</span>
              <span className="font-bold text-stone-800">
                {shippingCharge === 0 ? <span className="text-emerald-700 uppercase font-bold text-[10px]">Free</span> : `₹${shippingCharge}`}
              </span>
            </div>

            <div className="flex justify-between pt-3 text-base font-bold text-brand-emerald border-t border-stone-200">
              <span>Total Payable</span>
              <span className="text-xl">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
