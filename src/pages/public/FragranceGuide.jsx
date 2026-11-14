import React from 'react';
import { Link } from 'react-router-dom';
import { CONCENTRATIONS, FRAGRANCE_FAMILIES } from '../../constants/brand';
import { Sparkles, Droplet, Clock, Flame, ArrowRight } from 'lucide-react';

export const FragranceGuide = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-gold">
          OLFACTORY MASTERCLASS
        </span>
        <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-brand-emerald">
          The Art of Fine Perfumery Guide
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 font-light leading-relaxed">
          Demystifying fragrance concentrations, olfactory pyramids, and the ancient art of Arabian attar application.
        </p>
      </div>

      {/* Section 1: Concentrations Breakdown */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="font-playfair text-2xl font-bold text-brand-emerald">
            1. Understanding Concentrations
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            The ratio of aromatic perfume oils to high-grade carrier solvent determines longevity and depth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CONCENTRATIONS.slice(0, 3).map((c) => (
            <div key={c.id} className="p-6 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold block">
                {c.oilPercentage} Essential Oils
              </span>
              <h3 className="font-playfair text-lg font-bold text-brand-emerald">
                {c.name}
              </h3>
              <div className="text-xs text-stone-600 flex items-center gap-1.5 font-medium">
                <Clock className="w-4 h-4 text-brand-gold" />
                <span>Longevity: {c.longevity}</span>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed font-light">
                {c.id === 'extrait' 
                  ? 'The pinnacle of luxury perfumery. Formulated with up to 40% oil for intense presence and intimate warmth.'
                  : c.id === 'attar'
                  ? '100% alcohol-free concentrated oil traditional to the Middle East, applied via dip wand directly to pulse points.'
                  : 'Balanced projection and daily versatility, projecting brightly with sparkling top notes for over 10 hours.'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Fragrance Families */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="font-playfair text-2xl font-bold text-brand-emerald">
            2. The Seven Fragrance Families
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Find the aromatic universe that harmonizes with your natural body chemistry.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FRAGRANCE_FAMILIES.map((f) => (
            <div key={f.id} className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <h4 className="font-playfair font-bold text-sm text-brand-emerald">
                {f.name}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: How to Store & Care */}
      <div className="bg-brand-dark-forest text-white rounded-3xl p-8 sm:p-12 border border-brand-gold/30 shadow-2xl space-y-6">
        <h3 className="font-playfair text-2xl font-bold text-brand-soft-gold text-center">
          3. How to Store & Care for Fine Perfumes
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-stone-300 font-light leading-relaxed">
          <div className="space-y-2">
            <strong className="text-white block font-semibold text-sm">Avoid Direct Sunlight</strong>
            <p>UV radiation degrades precious natural molecules like rose absolute and agarwood resins. Store in a dark armoire or inside its presentation box.</p>
          </div>
          <div className="space-y-2">
            <strong className="text-white block font-semibold text-sm">Maintain Cool Temperature</strong>
            <p>Extreme heat can cause rapid evaporation and souring. Keep away from bathrooms or radiators; an ambient room temperature of 16-21°C is ideal.</p>
          </div>
          <div className="space-y-2">
            <strong className="text-white block font-semibold text-sm">Natural Maceration</strong>
            <p>Authentic natural extraits mature with age like fine vintage wine, developing deeper balsam and honey nuances over years.</p>
          </div>
        </div>

        <div className="text-center pt-4">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3 bg-brand-gold text-brand-dark-forest font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-brand-soft-gold transition shadow-lg"
          >
            <span>Explore Curated Scents</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  );
};
