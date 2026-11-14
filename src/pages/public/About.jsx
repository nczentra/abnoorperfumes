import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Crown, Droplet, ShieldCheck, Heart, ArrowRight } from 'lucide-react';

export const About = () => {
  return (
    <div className="space-y-16 pb-20">
      
      {/* Editorial Hero */}
      <section className="relative min-h-[50vh] flex items-center justify-center bg-brand-dark-forest text-white overflow-hidden py-20 px-4">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1920&q=90"
            alt="AB Noor Heritage"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-brand-dark-forest/80" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-gold">
            FOUNDED ON ARABIAN HERITAGE
          </span>
          <h1 className="font-playfair text-4xl sm:text-5xl font-bold leading-tight">
            The Essence of Elegance
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 font-light max-w-xl mx-auto leading-relaxed">
            For generations, the Noor family has guarded the rare alchemy of wild agarwood distillation, dawn-harvested Taif roses, and sacred incense resins.
          </p>
        </div>
      </section>

      {/* Heritage Story Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
        
        <div className="space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-widest text-brand-gold block">
            OUR GENESIS
          </span>
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-brand-emerald">
            A Legacy Rooted in Agarwood Forests & Mountain Mists
          </h2>
          <p>
            AB Noor Perfumes was born from an unyielding devotion to authentic Eastern olfaction. In an era dominated by synthetic aroma chemicals and mass-manufactured colognes, we chose the slower, reverent path of master perfumery.
          </p>
          <p>
            Our master distillers journey directly to the heart of the Aquilaria forests in Koh Kong, Cambodia, and the misty plateaus of Taif, Saudi Arabia. We forge personal partnerships with indigenous distillers who have tended copper alembic stills for over a century.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
          <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-2">
            <Droplet className="w-6 h-6 text-brand-gold" />
            <h4 className="font-playfair font-bold text-base text-brand-emerald">Uncut Purity</h4>
            <p className="text-xs text-stone-500">
              Our artisanal attars contain zero alcohol, phthalates, or fillers—just 100% concentrated botanical essence.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-2">
            <Crown className="w-6 h-6 text-brand-gold" />
            <h4 className="font-playfair font-bold text-base text-brand-emerald">Private Reserve</h4>
            <p className="text-xs text-stone-500">
              Our extraits are formulated at an extraordinary 35% to 40% oil concentration for majestic 24-hour longevity.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-2">
            <ShieldCheck className="w-6 h-6 text-brand-gold" />
            <h4 className="font-playfair font-bold text-base text-brand-emerald">Signed Authenticity</h4>
            <p className="text-xs text-stone-500">
              Each numbered flacon is inspected by our master nose and packaged in signature velvet-lined presentation boxes.
            </p>
          </div>
        </div>

        {/* Quote Callout */}
        <div className="p-8 bg-brand-emerald text-brand-soft-gold rounded-3xl border border-brand-gold/40 text-center space-y-3">
          <p className="font-playfair text-lg sm:text-xl italic">
            "A fragrance is the invisible garment that speaks of your dignity before you have uttered a single word."
          </p>
          <span className="text-[10px] uppercase tracking-widest text-brand-gold font-bold block">
            — Faisal Al-Noor, Master Nose & Founder
          </span>
        </div>

        <div className="text-center pt-8">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-emerald hover:bg-brand-dark-forest text-brand-soft-gold rounded-xl font-bold text-xs uppercase tracking-widest transition shadow-lg shadow-brand-emerald/20"
          >
            <span>Explore the Fragrance Collection</span>
            <ArrowRight className="w-4 h-4 text-brand-gold" />
          </Link>
        </div>

      </section>

    </div>
  );
};
