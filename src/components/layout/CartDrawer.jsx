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
        className="absolute inset-0 bg-brand-dark-forest/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-brand-gold/30">
          
          {/* Header */}
          <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-brand-dark-forest text-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-gold" />
              <h3 className="font-playfair text-lg font-bold tracking-wide">
                Your Luxury Cart ({totalItemCount})
              </h3>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-stone-300 hover:text-white rounded-lg hover:bg-white/10 transition"
              title="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-stone-50 p-4 border-b border-stone-200 text-xs">
            {isFreeShipping ? (
              <div className="flex items-center gap-2 text-emerald-800 font-medium">
                <Sparkles className="w-4 h-4 text-brand-gold shrink-0" />
                <span>You qualify for <strong>Complimentary Royal Express Delivery</strong>!</span>
              </div>
            ) : (
              <div>
                <p className="text-stone-700 mb-1.5">
                  Add <strong className="text-brand-emerald">₹{amountNeededForFreeShipping.toLocaleString('en-IN')}</strong> more for <strong>Complimentary Luxury Delivery</strong>
                </p>
                <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-brand-gold h-full transition-all duration-500 rounded-full"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-stone-100">
            {items.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-stone-100 border border-brand-gold/40 flex items-center justify-center mx-auto text-brand-gold">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-playfair text-lg text-brand-emerald font-semibold">
                  Your cart is empty
                </h4>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Immerse yourself in our exquisite Arabian fragrances, rare ouds, and royal attars.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/shop');
                  }}
                  className="px-6 py-2.5 bg-brand-emerald hover:bg-brand-dark-forest text-brand-soft-gold text-xs font-semibold uppercase tracking-wider rounded-lg transition"
                >
                  Discover Fragrances
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={`${item.productId}-${item.variantId}`} className="py-4 flex gap-4 group">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-20 h-20 object-cover rounded-lg border border-stone-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase tracking-wider text-brand-gold font-semibold block">
                      {item.brandName || 'AB Noor'}
                    </span>
                    <h5 className="text-sm font-semibold text-brand-emerald truncate">
                      {item.productName}
                    </h5>
                    <div className="text-xs text-stone-500 mt-0.5">
                      Flacon Size: <span className="font-medium text-stone-800">{item.variantSize}</span>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-stone-200 rounded-md bg-stone-50">
                        <button
                          onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                          className="p-1 hover:text-brand-emerald transition text-stone-500"
                          title="Decrease"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                          className="p-1 hover:text-brand-emerald transition text-stone-500"
                          title="Increase"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Price & Remove */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-brand-emerald">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.productId, item.variantId)}
                          className="text-stone-400 hover:text-rose-600 transition p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout button */}
          {items.length > 0 && (
            <div className="p-5 border-t border-stone-200 bg-stone-50 space-y-3">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-800">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount ({coupon?.code})</span>
                    <span className="font-semibold">
                      -₹{discountAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-stone-800">
                    {shippingCharge === 0 ? (
                      <span className="text-emerald-700 uppercase font-bold text-[10px] tracking-wider">Free</span>
                    ) : (
                      `₹${shippingCharge}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-bold text-brand-emerald pt-2 border-t border-stone-200">
                  <span>Estimated Total</span>
                  <span className="text-base text-brand-emerald">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3.5 px-4 bg-brand-emerald hover:bg-brand-dark-forest text-brand-soft-gold rounded-xl font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-brand-emerald/20 transition-all hover:scale-[1.01]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-brand-gold" />
              </button>

              <div className="text-center">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/cart');
                  }}
                  className="text-xs text-stone-500 hover:text-brand-emerald font-medium underline transition"
                >
                  View Full Cart & Apply Coupons
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
