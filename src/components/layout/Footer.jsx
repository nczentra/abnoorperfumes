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
  ArrowRight 
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
    <footer className="bg-brand-dark-forest text-stone-300 pt-16 pb-8 border-t border-brand-gold/30 relative overflow-hidden">
      {/* Background Ornament Watermark */}
      <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none transform translate-x-1/4 translate-y-1/4">
        <svg width="600" height="600" viewBox="0 0 200 200" fill="currentColor" className="text-brand-gold">
          <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="2" fill="none" />
          <polygon points="100,20 180,100 100,180 20,100" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Feature Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-white/10 text-center md:text-left">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-brand-gold/40 flex items-center justify-center text-brand-gold shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-white uppercase tracking-wider">Artisanal Distillation</h5>
              <p className="text-[11px] text-stone-400">Authentic rare oud and 100% pure oils</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-brand-gold/40 flex items-center justify-center text-brand-gold shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-white uppercase tracking-wider">Complimentary Delivery</h5>
              <p className="text-[11px] text-stone-400">Express insured delivery above ₹2,499</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-brand-gold/40 flex items-center justify-center text-brand-gold shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-white uppercase tracking-wider">Royal Authenticity</h5>
              <p className="text-[11px] text-stone-400">Hand-signed certificate of formulation</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-brand-gold/40 flex items-center justify-center text-brand-gold shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-white uppercase tracking-wider">Luxury Presentation</h5>
              <p className="text-[11px] text-stone-400">Signature emerald box with gold wax seal</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-white/10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <MonogramLogo variant="light" />
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm mt-3">
              AB Noor Perfumes honors seven generations of Arabian olfactory mastery. We craft transcendent extraits de parfum, vintage Dehn Al Oud, and pure concentrated attars that linger like poetry upon your skin.
            </p>
            <div className="pt-2 text-xs space-y-1.5 text-stone-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-gold shrink-0" />
                <span>{BRAND.address.line1}, {BRAND.address.city}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-gold shrink-0" />
                <span>{BRAND.phone} (VIP Concierge)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-gold shrink-0" />
                <span>{BRAND.email}</span>
              </div>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold mb-4">
              Collections
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/category/oud" className="hover:text-brand-soft-gold transition">
                  Rare Dehn Al Oud
                </Link>
              </li>
              <li>
                <Link to="/category/men" className="hover:text-brand-soft-gold transition">
                  Smoked Leather & Woods
                </Link>
              </li>
              <li>
                <Link to="/category/arabian" className="hover:text-brand-soft-gold transition">
                  Dark Amber & Frankincense
                </Link>
              </li>
              <li>
                <Link to="/category/attars" className="hover:text-brand-soft-gold transition">
                  Pure Artisanal Attars
                </Link>
              </li>
              <li>
                <Link to="/category/luxury" className="hover:text-brand-soft-gold transition">
                  Private Reserve Extraits
                </Link>
              </li>
              <li>
                <Link to="/category/gift-sets" className="hover:text-brand-soft-gold transition">
                  Gentlemen's Coffrets
                </Link>
              </li>
            </ul>
          </div>

          {/* Concierge & Discovery */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold mb-4">
              Concierge
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/fragrance-finder" className="hover:text-brand-soft-gold transition flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-brand-gold" />
                  <span>Fragrance Finder</span>
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-brand-soft-gold transition">
                  Compare Perfumes
                </Link>
              </li>
              <li>
                <Link to="/fragrance-guide" className="hover:text-brand-soft-gold transition">
                  Fragrance Guide & Notes
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-brand-soft-gold transition">
                  Track Your Shipment
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-brand-soft-gold transition">
                  Our Distillation Heritage
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-brand-soft-gold transition">
                  The Fragrance Journal
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-brand-soft-gold transition">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-soft-gold transition">
                  Contact Master Perfumers
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold mb-2">
              The Royal Circle
            </h5>
            <p className="text-xs text-stone-400 mb-3 leading-relaxed">
              Subscribe to receive private invitations to limited batch harvests and receive 10% off your initial purchase.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white/5 border border-brand-gold/30 rounded-lg text-white placeholder-stone-500 focus:outline-none focus:border-brand-gold"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-3 bg-brand-gold hover:bg-brand-soft-gold text-brand-dark-forest rounded-lg font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5"
              >
                <span>Join Circle</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="pt-4 flex items-center gap-3 text-stone-400">
              <span className="text-[11px]">Follow us:</span>
              <a href={BRAND.socials.instagram} target="_blank" rel="noreferrer" className="hover:text-brand-gold transition" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href={BRAND.socials.facebook} target="_blank" rel="noreferrer" className="hover:text-brand-gold transition" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Policies & Copyright Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-stone-400 gap-4">
          <div>
            © {new Date().getFullYear()} {BRAND.name}. All Rights Reserved. The Essence of Elegance.
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-stone-400">
            <Link to="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-white transition">Terms of Service</Link>
            <span>•</span>
            <Link to="/shipping-policy" className="hover:text-white transition">Shipping Policy</Link>
            <span>•</span>
            <Link to="/return-policy" className="hover:text-white transition">Returns & Exchanges</Link>
            <span>•</span>
            <Link to="/cancellation-policy" className="hover:text-white transition">Cancellation Policy</Link>
          </div>

          {/* Secure Payment Badges */}
          <div className="flex items-center gap-2 text-stone-400 text-[10px]">
            <span className="px-2 py-0.5 border border-white/20 rounded bg-white/5 font-mono">RAZORPAY SECURE</span>
            <span className="px-2 py-0.5 border border-white/20 rounded bg-white/5 font-mono">UPI / CARDS</span>
            <span className="px-2 py-0.5 border border-white/20 rounded bg-white/5 font-mono">COD</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
