import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MonogramLogo } from '../common/MonogramLogo';
import { BRAND } from '../../constants/brand';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Instagram, 
  Facebook, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  ArrowRight,
  Crown
} from 'lucide-react';
import { toast } from 'sonner';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setSubscribed(true);
    toast.success('Welcome to AB Noor Private Circle', {
      description: 'Your 10% exclusive welcome code WELCOME10 is ready.',
    });
    setEmail('');
  };

  return (
    <footer className="bg-[#0A192F] text-slate-200 pt-16 pb-8 border-t border-blue-800/40 relative overflow-hidden">
      
      {/* Background Ornament Watermark */}
      <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none transform translate-x-1/4 translate-y-1/4">
        <svg width="600" height="600" viewBox="0 0 200 200" fill="currentColor" className="text-blue-600">
          <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="2" fill="none" />
          <polygon points="100,20 180,100 100,180 20,100" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Feature Pillars in Blue & Red Accents */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-white/10 text-center md:text-left">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-600/50 flex items-center justify-center text-blue-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-white uppercase tracking-wider">Artisanal Distillation</h5>
              <p className="text-[11px] text-slate-400">Authentic wild agarwood & uncut attars</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-600/50 flex items-center justify-center text-blue-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-white uppercase tracking-wider">Complimentary Express</h5>
              <p className="text-[11px] text-slate-400">Insured express delivery above ₹2,499</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-600/50 flex items-center justify-center text-blue-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-white uppercase tracking-wider">Signed Authenticity</h5>
              <p className="text-[11px] text-slate-400">Hand-certified master formulation</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-600/50 flex items-center justify-center text-red-500 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-white uppercase tracking-wider">Luxury Presentation</h5>
              <p className="text-[11px] text-slate-400">Crystalline flacon sealed with red wax</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-white/10">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <MonogramLogo variant="light" />
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mt-3">
              AB Noor Perfumes honors seven generations of Arabian olfactory mastery. We craft commanding extraits de parfum, vintage Dehn Al Oud, and pure concentrated attars designed for the discerning gentleman.
            </p>
            <div className="pt-2 text-xs space-y-1.5 text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{BRAND.address.line1}, {BRAND.address.city}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{BRAND.phone} (VIP Concierge)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-400 shrink-0" />
                <span>{BRAND.email}</span>
              </div>
            </div>
          </div>

          {/* Curated Men's Collections */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400 mb-4">
              Men's Collections
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/category/oud" className="hover:text-red-400 transition">
                  Rare Dehn Al Oud
                </Link>
              </li>
              <li>
                <Link to="/category/leather" className="hover:text-red-400 transition">
                  Smoked Leather & Tobacco
                </Link>
              </li>
              <li>
                <Link to="/category/amber" className="hover:text-red-400 transition">
                  Dark Amber & Frankincense
                </Link>
              </li>
              <li>
                <Link to="/category/attars" className="hover:text-red-400 transition">
                  Pure Artisanal Attars
                </Link>
              </li>
              <li>
                <Link to="/category/luxury" className="hover:text-red-400 transition">
                  Private Reserve Extraits
                </Link>
              </li>
              <li>
                <Link to="/category/gift-sets" className="hover:text-red-400 transition">
                  Gentlemen's Coffrets
                </Link>
              </li>
            </ul>
          </div>

          {/* Concierge & Discovery */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400 mb-4">
              Concierge
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/about" className="hover:text-red-400 transition font-semibold text-white">
                  About Our Heritage
                </Link>
              </li>
              <li>
                <Link to="/fragrance-finder" className="hover:text-red-400 transition">
                  Gentleman's Scent Quiz
                </Link>
              </li>
              <li>
                <Link to="/fragrance-guide" className="hover:text-red-400 transition">
                  Fragrance Families Guide
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-red-400 transition">
                  Track Consignment
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-red-400 transition">
                  VIP Concierge Contact
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-red-400 transition text-red-400 font-bold">
                  Store Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column with Red Button */}
          <div className="space-y-4">
            <h5 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
              The Private Reserve Club
            </h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              Subscribe to receive private invitations to limited vintage agarwood distillations and 10% off your first flacon.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="gentleman@example.com"
                className="w-full px-3.5 py-2.5 bg-[#0F2C59]/80 border border-blue-500/40 rounded-xl text-xs text-white placeholder-blue-200/50 focus:outline-none focus:border-white transition"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-red-600/30 flex items-center justify-center gap-1.5"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Policies */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} AB Noor Perfumes. The Essence of Masculine Elegance. All Rights Reserved.
          </div>

          <div className="flex items-center gap-5">
            <Link to="/privacy-policy" className="hover:text-slate-300 transition">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-300 transition">Terms of Service</Link>
            <Link to="/shipping-policy" className="hover:text-slate-300 transition">Shipping</Link>
            <Link to="/refund-policy" className="hover:text-slate-300 transition">Returns</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
