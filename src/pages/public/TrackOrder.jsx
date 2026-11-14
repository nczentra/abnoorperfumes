import React, { useState } from 'react';
import { orderService } from '../../services/orderService';
import { ORDER_STATUSES } from '../../constants/brand';
import { 
  PackageSearch, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  ShoppingBag,
  AlertCircle
} from 'lucide-react';

export const TrackOrder = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [contact, setContact] = useState('');
  const [order, setOrder] = useState(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderNumber || !contact) {
      setError('Please provide both Order Number and Email or Phone Number.');
      return;
    }

    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const found = await orderService.trackOrder(orderNumber, contact);
      if (found) {
        setOrder(found);
      } else {
        setOrder(null);
        setError('No order was found matching those credentials. Please check your order confirmation email or invoice.');
      }
    } catch (e) {
      setError('An error occurred while tracking your shipment.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIndex = (currentStatus) => {
    const steps = ['placed', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered'];
    return steps.indexOf(currentStatus);
  };

  const currentStepIdx = order ? getStatusIndex(order.orderStatus) : -1;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-emerald text-brand-soft-gold text-[10px] font-bold tracking-widest uppercase">
          <Truck className="w-3.5 h-3.5 text-brand-gold" />
          <span>CONCIERGE LOGISTICS</span>
        </div>
        <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-brand-emerald">
          Track Your Royal Shipment
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 font-light leading-relaxed">
          Monitor your flacon’s journey from our Mumbai distillation vaults to your private residence.
        </p>
      </div>

      {/* Lookup Form */}
      <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-sm max-w-2xl mx-auto">
        <form onSubmit={handleTrack} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-emerald mb-1.5">
                Order Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. ABN-2026-9842"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-emerald"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-emerald mb-1.5">
                Billing Email or Mobile *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. tariq@example.com"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-emerald"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-brand-emerald hover:bg-brand-dark-forest text-brand-soft-gold rounded-xl font-bold text-xs uppercase tracking-widest transition shadow-lg shadow-brand-emerald/20 flex items-center justify-center gap-2"
          >
            <PackageSearch className="w-4 h-4 text-brand-gold" />
            <span>{loading ? 'Tracking Shipment...' : 'Locate Shipment'}</span>
          </button>
        </form>

        <div className="pt-4 mt-4 border-t border-stone-100 text-[11px] text-stone-400 text-center">
          Sample order for demonstration: Number <strong>ABN-2026-9842</strong>, Email <strong>tariq.mansoor@example.com</strong>
        </div>
      </div>

      {/* Order Tracking Result Card */}
      {order && (
        <div className="bg-white rounded-3xl border border-brand-gold/30 p-8 shadow-xl space-y-8 animate-in fade-in duration-300">
          
          {/* Order Snapshot Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">
                CONFIRMED ORDER
              </span>
              <h3 className="font-playfair text-2xl font-bold text-brand-emerald">
                {order.orderNumber}
              </h3>
              <p className="text-xs text-stone-500">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' })}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block px-3 py-1 bg-brand-emerald/10 text-brand-emerald font-bold text-xs rounded-full uppercase tracking-wider mb-1">
                Status: {order.orderStatus.replace(/_/g, ' ')}
              </span>
              <div className="text-xs text-stone-500">
                Payment: <strong className="text-stone-800 capitalize">{order.paymentMethod} ({order.paymentStatus})</strong>
              </div>
            </div>
          </div>

          {/* Courier Details */}
          {order.courier && (
            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
              <div className="flex items-center gap-2 text-emerald-900">
                <Truck className="w-4 h-4 text-brand-gold" />
                <span>Courier: <strong>{order.courier}</strong></span>
              </div>
              <div className="font-mono text-emerald-800 font-bold">
                Tracking ID: {order.trackingNumber}
              </div>
            </div>
          )}

          {/* Visual Step-by-Step Progress Timeline */}
          <div className="py-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-emerald mb-6 text-center">
              Shipment Progress
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-[10px]">
              {[
                { key: 'placed', label: 'Order Placed' },
                { key: 'confirmed', label: 'Confirmed' },
                { key: 'processing', label: 'In Vault' },
                { key: 'packed', label: 'Sealed & Packed' },
                { key: 'shipped', label: 'Dispatched' },
                { key: 'out_for_delivery', label: 'Out for Delivery' },
                { key: 'delivered', label: 'Delivered' },
              ].map((step, idx) => {
                const isPassed = currentStepIdx >= idx;
                const isCurrent = currentStepIdx === idx;
                return (
                  <div key={step.key} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-2 transition-all ${
                      isCurrent
                        ? 'bg-brand-gold text-brand-dark-forest ring-4 ring-brand-gold/30'
                        : isPassed
                        ? 'bg-brand-emerald text-white'
                        : 'bg-stone-200 text-stone-400'
                    }`}>
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <span className={`font-semibold ${isPassed ? 'text-brand-emerald' : 'text-stone-400'}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ordered Fragrances */}
          <div className="space-y-3 pt-4 border-t border-stone-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-emerald">
              Fragrances in this Shipment
            </h4>
            <div className="divide-y divide-stone-100 bg-stone-50 rounded-2xl p-4">
              {order.itemsSnapshot?.map((item, i) => (
                <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt="" className="w-10 h-10 object-cover rounded-lg border border-stone-200" />
                    <div>
                      <strong className="text-stone-800 block">{item.productName}</strong>
                      <span className="text-[11px] text-stone-500">Volume: {item.variantSize} × {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-bold text-brand-emerald">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Destination Address */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs flex items-start gap-3">
            <MapPin className="w-4 h-4 text-brand-emerald shrink-0 mt-0.5" />
            <div>
              <strong className="text-stone-800 block font-semibold">Delivery Destination</strong>
              <div className="text-stone-600 mt-0.5">
                {order.addressSnapshot?.fullName} • {order.addressSnapshot?.phone}<br />
                {order.addressSnapshot?.houseNumber}, {order.addressSnapshot?.street}, {order.addressSnapshot?.locality}<br />
                {order.addressSnapshot?.city}, {order.addressSnapshot?.state} - {order.addressSnapshot?.pincode}
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
