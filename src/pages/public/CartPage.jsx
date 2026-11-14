import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Tag, 
  X 
} from 'lucide-react';

export const CartPage = () => {
  const {
    items,
    totalItemCount,
    subtotal,
    discountAmount,
    shippingCharge,
    isFreeShipping,
    amountNeededForFreeShipping,
    freeShippingProgress,
    totalAmount,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    coupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const navigate = useNavigate();

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    await applyCoupon(couponInput);
    setCouponLoading(false);
    setCouponInput('');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-stone-100 border border-brand-gold/40 flex items-center justify-center mx-auto text-brand-gold">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-playfair text-3xl font-bold text-brand-emerald">
          Your Luxury Cart is Empty
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 font-light max-w-sm mx-auto leading-relaxed">
          You have not added any perfumes to your shopping cart yet. Discover our rare agarwood and artisanal attar collections.
        </p>
        <div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-emerald hover:bg-brand-dark-forest text-brand-soft-gold rounded-xl font-bold text-xs uppercase tracking-widest transition shadow-lg shadow-brand-emerald/20"
          >
            <span>Discover Fragrances</span>
            <ArrowRight className="w-4 h-4 text-brand-gold" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-gold">
            ROYAL SHOPPING BAG
          </span>
          <h1 className="font-playfair text-3xl font-bold text-brand-emerald mt-1">
            Shopping Cart ({totalItemCount} Fragrances)
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-stone-400 hover:text-rose-600 font-medium transition"
        >
          Clear Cart
        </button>
      </div>

      {/* Free Shipping Alert Bar */}
      <div className="bg-stone-50 border border-brand-gold/30 rounded-2xl p-4">
        {isFreeShipping ? (
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-brand-gold" />
            <span>Congratulations! Your order qualifies for <strong>Complimentary Royal Express Delivery</strong>.</span>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-stone-700">
              Add <strong className="text-brand-emerald">₹{amountNeededForFreeShipping.toLocaleString('en-IN')}</strong> more to unlock <strong>Complimentary Luxury Delivery</strong>.
            </p>
            <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-brand-gold h-full rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 2-Column Layout: Items Table & Price Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* Left Column: Items List */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-sm divide-y divide-stone-100">
          {items.map((item) => (
            <div key={`${item.productId}-${item.variantId}`} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              
              {/* Image */}
              <img
                src={item.image}
                alt={item.productName}
                className="w-24 h-24 object-cover rounded-xl border border-stone-200 shrink-0"
              />

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold block">
                  {item.brandName || 'AB Noor Signature'}
                </span>
                <Link to={`/product/${item.slug}`} className="font-playfair font-bold text-base text-brand-emerald hover:underline">
                  {item.productName}
                </Link>
                <div className="text-xs text-stone-500 mt-1">
                  Flacon Volume: <span className="font-semibold text-stone-800">{item.variantSize}</span>
                </div>
                <div className="text-xs text-stone-400 font-mono mt-0.5">
                  SKU: {item.sku}
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50">
                <button
                  onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                  className="p-2 text-stone-500 hover:text-brand-emerald transition"
                  title="Decrease"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-xs font-bold text-stone-800">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                  className="p-2 text-stone-500 hover:text-brand-emerald transition"
                  title="Increase"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Total & Delete */}
              <div className="text-right sm:min-w-[120px]">
                <div className="font-bold text-base text-brand-emerald">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </div>
                <button
                  onClick={() => removeFromCart(item.productId, item.variantId)}
                  className="text-stone-400 hover:text-rose-600 transition p-1 text-xs inline-flex items-center gap-1 mt-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Right Column: Order Summary & Coupon */}
        <div className="space-y-6 sticky top-24">
          
          {/* Coupon Box */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-emerald flex items-center gap-2">
              <Tag className="w-4 h-4 text-brand-gold" />
              <span>Royal Promotional Code</span>
            </h4>

            {coupon ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <strong className="text-emerald-900 block font-mono font-bold">{coupon.code}</strong>
                  <span className="text-emerald-700 text-[11px]">{coupon.description}</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-stone-400 hover:text-rose-600 p-1"
                  title="Remove coupon"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. WELCOME10, NOORROYAL"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl font-mono focus:outline-none focus:border-brand-emerald"
                />
                <button
                  type="submit"
                  disabled={couponLoading || !couponInput.trim()}
                  className="px-4 py-2 bg-brand-emerald hover:bg-brand-dark-forest text-brand-soft-gold text-xs font-bold uppercase tracking-wider rounded-xl transition disabled:opacity-50"
                >
                  {couponLoading ? '...' : 'Apply'}
                </button>
              </form>
            )}

            <div className="text-[11px] text-stone-400">
              Try code <strong>WELCOME10</strong> (10% off) or <strong>NOORROYAL</strong> (₹500 off)
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-white rounded-3xl border border-brand-gold/40 p-6 sm:p-8 shadow-xl space-y-4">
            <h3 className="font-playfair text-xl font-bold text-brand-emerald">
              Order Summary
            </h3>

            <div className="space-y-2 text-xs text-stone-600 divide-y divide-stone-100">
              <div className="flex justify-between pb-2">
                <span>Subtotal ({totalItemCount} items)</span>
                <span className="font-bold text-stone-800">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between py-2 text-emerald-700">
                  <span>Coupon Discount ({coupon?.code})</span>
                  <span className="font-bold">-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between py-2">
                <span>Luxury Express Shipping</span>
                <span className="font-bold text-stone-800">
                  {shippingCharge === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase text-[10px]">Free</span>
                  ) : (
                    `₹${shippingCharge}`
                  )}
                </span>
              </div>

              <div className="flex justify-between pt-3 text-base font-bold text-brand-emerald">
                <span>Estimated Total</span>
                <span className="text-xl text-brand-emerald">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-brand-emerald hover:bg-brand-dark-forest text-brand-soft-gold font-bold text-xs uppercase tracking-widest rounded-xl transition shadow-xl shadow-brand-emerald/20 flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 text-brand-gold" />
            </button>

            <div className="pt-2 text-center text-[11px] text-stone-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-gold" />
              <span>256-Bit SSL Encrypted Razorpay Checkout</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
