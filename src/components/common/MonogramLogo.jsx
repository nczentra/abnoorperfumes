import React from 'react';
import { Link } from 'react-router-dom';

export const MonogramLogo = ({ variant = 'light', className = '', showTagline = false }) => {
  const isLight = variant === 'light'; // Light text for dark/blue backgrounds

  return (
    <Link 
      to="/" 
      className={`inline-flex items-center gap-2.5 shrink-0 select-none group ${className}`}
      aria-label="AB Noor Perfumes"
    >
      {/* Simple, Elegant Monogram Mark */}
      <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center font-playfair font-bold text-sm tracking-tight shadow-sm shrink-0 border transition-transform group-hover:scale-105 ${
        isLight 
          ? 'bg-white text-[#0F2C59] border-white' 
          : 'bg-[#0F2C59] text-white border-blue-900'
      }`}>
        AB
      </div>

      {/* Clean Brand Name */}
      <div className="flex flex-col leading-none shrink-0">
        <span className={`font-playfair font-bold tracking-[0.16em] text-base sm:text-lg transition-colors whitespace-nowrap ${
          isLight ? 'text-white' : 'text-slate-900'
        }`}>
          AB NOOR
        </span>
        <span className="text-[9px] tracking-[0.3em] font-bold uppercase text-blue-300 mt-0.5 whitespace-nowrap">
          PERFUMES
        </span>
        {showTagline && (
          <span className={`text-[10px] font-cormorant italic mt-1 whitespace-nowrap ${
            isLight ? 'text-blue-200/80' : 'text-slate-500'
          }`}>
            The Essence of Masculine Elegance
          </span>
        )}
      </div>
    </Link>
  );
};
