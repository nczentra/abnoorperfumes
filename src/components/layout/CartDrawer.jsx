import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';

export const CartDrawer = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
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
    coupon,
  } = useCart();

  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0A192F]/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-blue-900/40">
          
          {/* Header in Royal Navy Blue */}
          <div className="p-5 border-b border-blue-800/50 flex items-center justify-between bg-[#0F2C59] text-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-red-500" />
              <h3 className="font-playfair text-lg font-bold tracking-wide">
                Your Luxury Bag ({totalItemCount})
              </h3>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
              title="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-slate-50 p-4 border-b border-slate-200 text-xs">
            {isFreeShipping ? (
              <div className="flex items-center gap-2 text-blue-900 font-semibold">
                <Sparkles className="w-4 h-4 text-red-600 shrink-0" />
                <span>You qualify for <strong>Complimentary Royal Express Delivery</strong>!</span>
              </div>
            ) : (
              <div>
                <p className="text-slate-700 mb-1.5">
                  Add <strong className="text-red-600">₹{amountNeededForFreeShipping.toLocaleString('en-IN')}</strong> more for <strong>Complimentary Luxury Delivery</strong>
                </p>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-playfair text-lg text-slate-900 font-semibold">
                  Your bag is empty
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Immerse yourself in our masculine extraits de parfum, rare agarwoods, and artisanal attars.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/shop');
                  }}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md shadow-red-600/30"
                >
                  Discover Fragrances
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={`${item.productId}-${item.variantSize}`} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                  {/* Flacon Thumbnail */}
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-16 h-20 object-cover rounded-xl border border-slate-200 bg-slate-50 shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h5 className="font-playfair font-bold text-sm text-slate-900 line-clamp-1">
                          {item.productName}
                        </h5>
                        <button
                          onClick={() => removeFromCart(item.productId, item.variantSize)}
                          className="text-slate-400 hover:text-red-600 transition p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-xs text-blue-600 font-semibold block">
                        Size: {item.variantSize}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50 text-xs">
                        <button
                          onClick={() => updateQuantity(item.productId, item.variantSize, item.quantity - 1)}
                          className="p-1 hover:bg-slate-200 transition text-slate-600"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.variantSize, item.quantity + 1)}
                          className="p-1 hover:bg-slate-200 transition text-slate-600"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <span className="font-bold text-sm text-slate-900">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary with Vibrant Red Button */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-red-600 font-semibold">
                    <span>Privilege Code ({coupon?.code})</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>White-Glove Shipping</span>
                  <span className="font-semibold text-slate-900">
                    {shippingCharge === 0 ? 'Complimentary' : `₹${shippingCharge}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Estimated Total</span>
                  <span className="text-red-600">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Red Checkout CTA */}
              <button
                onClick={handleCheckout}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
