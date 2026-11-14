import React, { createContext, useContext, useState } from 'react';
import { toast } from 'sonner';

const CompareContext = createContext();

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};

export const CompareProvider = ({ children }) => {
  const [compareItems, setCompareItems] = useState([]);

  const addToCompare = (product) => {
    if (compareItems.some(p => p.id === product.id)) {
      toast.info(`${product.name} is already in comparison.`);
      return;
    }
    if (compareItems.length >= 3) {
      toast.error('You can compare a maximum of 3 perfumes simultaneously.');
      return;
    }
    setCompareItems(prev => [...prev, product]);
    toast.success(`Added ${product.name} to comparison.`);
  };

  const removeFromCompare = (productId) => {
    setCompareItems(prev => prev.filter(p => p.id !== productId));
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  const isInCompare = (productId) => {
    return compareItems.some(p => p.id === productId);
  };

  const value = {
    compareItems,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isInCompare,
  };

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
};
