import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

const WISHLIST_STORAGE_KEY = 'ab_noor_wishlist';

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (saved) {
        setWishlist(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load wishlist:', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Failed to save wishlist:', e);
    }
  }, [wishlist]);

  const isInWishlist = (productId) => {
    return wishlist.some(p => p.id === productId);
  };

  const addToWishlist = (product) => {
    if (!isInWishlist(product.id)) {
      setWishlist(prev => [...prev, product]);
      toast.success(`Saved to your luxury wishlist`, {
        description: product.name,
      });
    }
  };

  const removeFromWishlist = (productId) => {
    setWishlist(prev => prev.filter(p => p.id !== productId));
    toast.info('Removed from wishlist');
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem(WISHLIST_STORAGE_KEY);
  };

  const value = {
    wishlist,
    wishlistCount: wishlist.length,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};
