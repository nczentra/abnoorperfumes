import React from 'react';
import { Link } from 'react-router-dom';

export const MonogramLogo = ({ variant = 'dark', className = '', showTagline = true }) => {
  const isLight = variant === 'light'; // For dark backgrounds

  return (
    <Link to="/" className={`inline-flex items-center gap-3 group transition-transform ${className}`}>
      {/* Monogram Crest in Blue, Black, White & Red */}
      <div className={`relative flex items-center justify-center w-11 h-11 rounded-xl border transition-all duration-300 shadow-md ${
        isLight 
          ? 'bg-[#0A192F] border-blue-400/60 group-hover:border-white' 
          : 'bg-[#0F2C59] border-blue-600/70 group-hover:border-blue-400'
      }`}>
        <div className="absolute inset-1 border border-blue-400/20 rounded-lg pointer-events-none" />
        <span className="font-playfair font-bold text-xl text-white tracking-tight">AB</span>
        {/* Red Luxury Accent Diamond */}
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-600 rounded-full border border-white shadow-sm" />
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-playfair font-bold tracking-[0.25em] text-lg leading-tight transition-colors ${
            isLight ? 'text-white group-hover:text-blue-300' : 'text-slate-900 group-hover:text-blue-900'
          }`}>
            AB NOOR
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block mb-0.5" />
        </div>
        <span className="text-[10px] tracking-[0.35em] font-bold text-blue-500 uppercase leading-tight">
          PERFUMES
        </span>
        {showTagline && (
          <span className={`text-[9px] font-cormorant italic tracking-wide transition-colors ${
            isLight ? 'text-blue-200/70' : 'text-slate-500'
          }`}>
            The Essence of Masculine Elegance
          </span>
        )}
      </div>
    </Link>
  );
};
