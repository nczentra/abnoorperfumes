import React from 'react';
import { Link } from 'react-router-dom';

export const MonogramLogo = ({ variant = 'dark', className = '', showTagline = true }) => {
  const isLight = variant === 'light'; // For dark backgrounds

  return (
    <Link to="/" className={`inline-flex items-center gap-3 group transition-transform ${className}`}>
      {/* Monogram Crest */}
      <div className={`relative flex items-center justify-center w-11 h-11 rounded-lg border transition-all duration-300 shadow-sm ${
        isLight 
          ? 'bg-brand-dark-forest border-brand-gold/60 group-hover:border-brand-gold' 
          : 'bg-brand-emerald border-brand-gold/70 group-hover:border-brand-gold'
      }`}>
        <div className="absolute inset-1 border border-brand-soft-gold/30 rounded-md pointer-events-none" />
        <span className="font-playfair font-bold text-xl text-brand-gold tracking-tight">AB</span>
        <span className="absolute -top-1 w-1.5 h-1.5 bg-brand-soft-gold rotate-45" />
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <span className={`font-playfair font-bold tracking-[0.25em] text-lg leading-tight transition-colors ${
          isLight ? 'text-white group-hover:text-brand-soft-gold' : 'text-brand-emerald group-hover:text-brand-dark-forest'
        }`}>
          AB NOOR
        </span>
        <span className="text-[10px] tracking-[0.35em] font-semibold text-brand-gold uppercase leading-tight">
          PERFUMES
        </span>
        {showTagline && (
          <span className={`text-[9px] font-cormorant italic tracking-wide transition-colors ${
            isLight ? 'text-brand-soft-gold/80' : 'text-brand-muted-grey'
          }`}>
            The Essence of Elegance
          </span>
        )}
      </div>
    </Link>
  );
};
