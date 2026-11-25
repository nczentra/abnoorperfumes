import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Crown, 
  Droplet, 
  ShieldCheck, 
  Flame, 
  ArrowRight, 
  MapPin, 
  Award, 
  CheckCircle2, 
  Compass, 
  Clock 
} from 'lucide-react';

export const About = () => {
  return (
    <div className="space-y-20 pb-24 overflow-hidden bg-white">
      
      {/* 1. Dramatic Editorial Hero Section */}
      <section className="relative min-h-[55vh] flex items-center justify-center bg-[#070B14] text-white overflow-hidden py-24 px-4">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1920&q=90"
            alt="AB Noor Heritage"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/80 to-transparent" />
          <div className="absolute inset-0 bg-blue-950/40 mix-blend-multiply" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-5 animate-in fade-in duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/90 border border-blue-500/30 text-blue-300 text-[11px] font-bold tracking-[0.25em] uppercase">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span>THE HOUSE OF AB NOOR PERFUMES</span>
          </div>

          <h1 className="font-playfair text-4xl sm:text-6xl font-bold leading-tight tracking-tight text-white">
            Commanding Heritage. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-red-500">
              Masculine Distinction.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
            Crafted for kings, dignitaries, and men of decisive authority. We preserve the ancient, uncut alchemy of vintage Cambodian oud, cordovan leather, and royal pure attars.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              to="/shop"
              className="px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition shadow-lg shadow-red-600/30 flex items-center gap-2"
            >
              <span>Explore Men's Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/fragrance-finder"
              className="px-8 py-3.5 bg-blue-900/40 hover:bg-blue-900/70 border border-blue-500/30 text-blue-200 rounded-xl font-bold text-xs uppercase tracking-widest transition"
            >
              Consult Master Nose
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Heritage Story: The Genesis */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-600">
              <Compass className="w-4 h-4 text-blue-600" />
              <span>THE GENESIS & CRAFTSMANSHIP</span>
            </div>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-slate-900 leading-snug">
              Born from Sacred Stills, <br />
              <span className="text-blue-900">Aged in Solitude.</span>
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed font-light">
              AB Noor Perfumes was born from an uncompromising rebellion against the ephemeral, synthetic fragrances of mass commercial perfumery. We believe a man's signature scent is not a casual accessory—it is his silent declaration of command.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed font-light">
              Headquartered at Colaba Promenade in Mumbai, we journey directly to the secluded wild Aquilaria forests in Koh Kong, Cambodia, Assam, and the rocky plateaus of Taif. Each batch of Dehn Al Oud is slowly cohobated in heavy copper alembic stills, aging undisturbed in dark amber glass for up to twenty-five years before meeting the bottle.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-50 border-l-4 border-red-600 rounded-r-xl">
                <span className="font-playfair text-2xl font-bold text-slate-900 block">25+ Yrs</span>
                <span className="text-xs text-slate-500 uppercase font-semibold">Vintage Agarwood Reserve</span>
              </div>
              <div className="p-4 bg-slate-50 border-l-4 border-blue-600 rounded-r-xl">
                <span className="font-playfair text-2xl font-bold text-slate-900 block">0% Alcohol</span>
                <span className="text-xs text-slate-500 uppercase font-semibold">In Our Pure Royal Attars</span>
              </div>
            </div>
          </div>

          {/* Visual Showcase */}
          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-100 relative group">
              <img
                src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=85"
                alt="Artisan Flacon"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-red-400">Master Formulation</span>
                <h4 className="font-playfair text-xl font-bold">The Sovereign Private Reserve</h4>
                <p className="text-xs text-slate-300">Each flacon is hand-filled, sealed with red lacquer, and numbered.</p>
              </div>
            </div>
            {/* Floating Luxury Accent */}
            <div className="absolute -bottom-6 -left-6 bg-[#070B14] text-white p-5 rounded-2xl shadow-xl border border-blue-900/50 hidden sm:block max-w-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500 flex items-center justify-center text-red-500">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-xs uppercase tracking-wider text-white">Signed Authenticity</h5>
                  <p className="text-[11px] text-slate-400">Inspected by Master Nose Faisal Al-Noor</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Three Pillars of Distinction */}
      <section className="bg-slate-50 py-16 border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-red-600 block">
              OUR CREED
            </span>
            <h3 className="font-playfair text-3xl font-bold text-slate-900">
              The Three Pillars of Distinction
            </h3>
            <p className="text-xs text-slate-500">
              Every drop that bears the AB Noor crest adheres to three non-negotiable standards of artisanal nobility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-500/40 transition-all duration-300 space-y-4 relative group">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                <Droplet className="w-6 h-6" />
              </div>
              <h4 className="font-playfair text-xl font-bold text-slate-900">Uncut Concentrated Purity</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-light">
                We never dilute our pure attars with mineral oils, dipropylene glycol (DPG), or chemical fixatives. What touches your skin is 100% uncut aromatic oil that blooms over 24+ hours.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-500/40 transition-all duration-300 space-y-4 relative group">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                <Flame className="w-6 h-6" />
              </div>
              <h4 className="font-playfair text-xl font-bold text-slate-900">Extrait Concentration (40%)</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-light">
                Standard department store colognes hold 8-12% perfume oil. AB Noor Extraits de Parfum contain between 35% and 40% pure oil concentration for unparalleled projection and commanding sillage.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-500/40 transition-all duration-300 space-y-4 relative group">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                <Crown className="w-6 h-6" />
              </div>
              <h4 className="font-playfair text-xl font-bold text-slate-900">French Glass & Magnetic Flacons</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-light">
                Weighted French crystalline glass, solid zinc-alloy magnetic caps with custom AB engraving, and precision micro-atomizers that emit a fine, velvety mist.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Global Sourcing Journey */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-red-600 block">BOTANICAL EXPEDITIONS</span>
          <h3 className="font-playfair text-3xl font-bold text-slate-900">The Sourcing Odyssey</h3>
          <p className="text-xs text-slate-500">Every ingredient has a birthplace, harvested only during peak olfactory seasons.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              place: 'Koh Kong, Cambodia',
              ingredient: 'Wild 25-Year Dehn Al Oud',
              desc: 'Deep, resinous, dark leather and balsamic honey undertones.',
            },
            {
              place: 'Salalah, Oman',
              ingredient: 'Royal Green Hojari Frankincense',
              desc: 'Harvested from sacred Boswellia sacra trees with silver-green tears.',
            },
            {
              place: 'Mysore, Karnataka',
              ingredient: 'Santalum Album Sandalwood',
              desc: 'Creamy, vintage, buttery wood aged over three decades.',
            },
            {
              place: 'Pampore, Kashmir',
              ingredient: 'Grade-A Mongra Saffron',
              desc: 'Hand-picked deep crimson stigmas offering warm bittersweet spice.',
            },
          ].map((item, idx) => (
            <div key={idx} className="p-6 bg-slate-900 text-white rounded-2xl border border-blue-900/40 space-y-2">
              <div className="flex items-center gap-2 text-red-400 text-xs font-bold">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>{item.place}</span>
              </div>
              <h5 className="font-playfair font-bold text-base text-white">{item.ingredient}</h5>
              <p className="text-xs text-slate-400 font-light leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Master Nose Quote in Deep Navy & Crimson */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="bg-[#0A192F] text-white p-8 sm:p-12 rounded-3xl border border-blue-500/30 text-center space-y-4 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <Crown className="w-8 h-8 text-blue-400 mx-auto" />
          <p className="font-playfair text-xl sm:text-2xl italic leading-relaxed text-slate-100 max-w-2xl mx-auto">
            "A man's fragrance is his armor. It commands respect across the boardroom and lingers long after he has departed the room."
          </p>
          <div className="pt-2">
            <span className="text-xs uppercase tracking-widest text-red-500 font-bold block">
              — Faisal Al-Noor
            </span>
            <span className="text-[11px] text-slate-400 font-light">Founder & Master Nose, AB Noor Perfumes</span>
          </div>
        </div>
      </section>

      {/* 6. Call to Action */}
      <section className="text-center space-y-4 pt-6">
        <h3 className="font-playfair text-2xl font-bold text-slate-900">
          Discover Your Signature Olfactory Identity
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Explore our private extraits, aged attars, and discovery coffrets curated exclusively for gentlemen.
        </p>
        <div className="pt-2">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-9 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition shadow-xl shadow-red-600/30"
          >
            <span>Explore The Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
};
