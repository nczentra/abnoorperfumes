import React, { createContext, useContext, useState, useEffect } from 'react';
import { BRAND } from '../constants/brand';
import { couponService } from '../services/couponService';
import { toast } from 'sonner';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

const CART_STORAGE_KEY = 'ab_noor_shopping_cart';
const APPLIED_COUPON_KEY = 'ab_noor_applied_coupon';

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [coupon, setCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from storage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      const savedCoupon = localStorage.getItem(APPLIED_COUPON_KEY);
      if (savedCoupon) {
        setCoupon(JSON.parse(savedCoupon));
      }
    } catch (e) {
      console.warn('Failed to load cart from storage:', e);
    }
  }, []);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save cart:', e);
    }
  }, [items]);

  // Recalculate discount whenever subtotal or coupon changes
  const subtotal = items.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

  useEffect(() => {
    if (coupon) {
      couponService.validateCoupon(coupon.code, subtotal).then(result => {
        if (result.valid) {
          setDiscountAmount(result.discountAmount);
        } else {
          setCoupon(null);
          setDiscountAmount(0);
          localStorage.removeItem(APPLIED_COUPON_KEY);
        }
      });
    } else {
      setDiscountAmount(0);
    }
  }, [subtotal, coupon]);

  // Add product variant to cart
  const addToCart = (product, variant, quantity = 1) => {
    const vId = variant ? variant.id : (product.variants?.[0]?.id || 'v-default');
    const vSize = variant ? variant.size : (product.variants?.[0]?.size || '50ml');
    const price = variant ? (variant.discountPrice || variant.sellingPrice) : (product.variants?.[0]?.discountPrice || product.variants?.[0]?.sellingPrice || 4999);
    const originalPrice = variant ? variant.sellingPrice : (product.variants?.[0]?.sellingPrice || price);
    const sku = variant ? variant.sku : (product.variants?.[0]?.sku || product.slug);

    setItems(prevItems => {
      const existingIdx = prevItems.findIndex(i => i.productId === product.id && i.variantId === vId);
      if (existingIdx > -1) {
        const next = [...prevItems];
        next[existingIdx].quantity += quantity;
        return next;
      } else {
        return [
          ...prevItems,
          {
            productId: product.id,
            productName: product.name,
            brandName: product.brandName,
            slug: product.slug,
            image: product.mainImage || product.images?.[0],
            variantId: vId,
            variantSize: vSize,
            sku,
            price: Number(price),
            originalPrice: Number(originalPrice),
            quantity,
          },
        ];
      }
    });

    toast.success(`Added ${product.name} (${vSize}) to your luxury cart`, {
      description: 'Handcrafted and packaged with care.',
    });
  };

  // Remove from cart
  const removeFromCart = (productId, variantId) => {
    setItems(prev => prev.filter(i => !(i.productId === productId && i.variantId === variantId)));
    toast.info('Item removed from cart');
  };

  // Update quantity
  const updateQuantity = (productId, variantId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    setItems(prev => 
      prev.map(i => {
        if (i.productId === productId && i.variantId === variantId) {
          return { ...i, quantity: newQuantity };
        }
        return i;
      })
    );
  };

  // Clear cart
  const clearCart = () => {
    setItems([]);
    setCoupon(null);
    setDiscountAmount(0);
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(APPLIED_COUPON_KEY);
  };

  // Apply Coupon
  const applyCoupon = async (code) => {
    const result = await couponService.validateCoupon(code, subtotal);
    if (result.valid) {
      setCoupon(result.coupon);
      setDiscountAmount(result.discountAmount);
      localStorage.setItem(APPLIED_COUPON_KEY, JSON.stringify(result.coupon));
      toast.success(result.message);
      return { success: true };
    } else {
      toast.error(result.message);
      return { success: false, message: result.message };
    }
  };

  // Remove Coupon
  const removeCoupon = () => {
    setCoupon(null);
    setDiscountAmount(0);
    localStorage.removeItem(APPLIED_COUPON_KEY);
    toast.info('Coupon removed');
  };

  // Shipping Calculations
  const shippingThreshold = BRAND.shipping.freeThreshold; // e.g. ₹2,499
  const isFreeShipping = subtotal >= shippingThreshold || subtotal === 0;
  const shippingCharge = isFreeShipping ? 0 : BRAND.shipping.standardCost;
  const amountNeededForFreeShipping = Math.max(0, shippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / shippingThreshold) * 100));

  const totalAmount = Math.max(0, subtotal - discountAmount + shippingCharge);
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    items,
    totalItemCount,
    subtotal,
    discountAmount,
    shippingCharge,
    isFreeShipping,
    amountNeededForFreeShipping,
    freeShippingProgress,
    totalAmount,
    coupon,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
