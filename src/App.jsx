import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { CompareProvider } from './context/CompareContext';
import { AppRoutes } from './routes/AppRoutes';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <CompareProvider>
            <AppRoutes />
            <Toaster 
              position="top-right" 
              richColors 
              toastOptions={{
                style: {
                  background: '#0B2119',
                  color: '#FFFFFF',
                  border: '1px solid #C6A15B',
                  borderRadius: '12px',
                },
              }}
            />
          </CompareProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
