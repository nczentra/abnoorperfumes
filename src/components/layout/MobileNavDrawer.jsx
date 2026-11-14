import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MonogramLogo } from '../common/MonogramLogo';
import { 
  X, 
  Home, 
  Sparkles, 
  Compass, 
  Scale, 
  Heart, 
  ShoppingBag, 
  User, 
  ShieldCheck, 
  LogOut, 
  LogIn,
  PackageSearch,
  BookOpen
} from 'lucide-react';

export const MobileNavDrawer = ({ isOpen, onClose }) => {
  const { currentUser, isAdmin, logout, toggleRole } = useAuth();

  if (!isOpen) return null;

  const categories = [
    { name: "All Men's Perfumes", path: '/shop' },
    { name: 'Royal Oud & Agarwood', path: '/category/oud' },
    { name: 'Smoked Leather & Tobacco', path: '/category/leather' },
    { name: 'Dark Amber & Frankincense', path: '/category/amber' },
    { name: 'Artisanal Pure Attars', path: '/category/attars' },
    { name: "Gentlemen's Discovery Coffrets", path: '/category/gift-sets' },
    { name: 'Private Reserve Extrait', path: '/category/luxury' },
    { name: 'Executive Citrus Woods', path: '/category/fresh' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
      <div 
        className="absolute inset-0 bg-brand-dark-forest/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pr-12">
        <div className="w-80 bg-brand-dark-forest text-brand-ivory shadow-2xl flex flex-col border-r border-brand-gold/30">
          
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <MonogramLogo variant="light" showTagline={false} />
            <button
              onClick={onClose}
              className="p-1.5 text-stone-300 hover:text-white rounded-lg hover:bg-white/10 transition"
              title="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6 text-sm">
            <div className="space-y-1">
              <Link
                to="/"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-brand-soft-gold hover:bg-white/5 transition"
              >
                <Home className="w-4 h-4 text-brand-gold" />
                <span>Home</span>
              </Link>
              <Link
                to="/shop"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white hover:bg-white/5 transition font-semibold"
              >
                <ShoppingBag className="w-4 h-4 text-brand-gold" />
                <span>Shop Catalogue</span>
              </Link>
              <Link
                to="/fragrance-finder"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-brand-soft-gold hover:bg-white/5 transition"
              >
                <Compass className="w-4 h-4 text-brand-gold" />
                <span>Fragrance Finder Quiz</span>
              </Link>
              <Link
                to="/compare"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white hover:bg-white/5 transition"
              >
                <Scale className="w-4 h-4 text-brand-gold" />
                <span>Compare Perfumes</span>
              </Link>
              <Link
                to="/track-order"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white hover:bg-white/5 transition"
              >
                <PackageSearch className="w-4 h-4 text-brand-gold" />
                <span>Track Your Order</span>
              </Link>
            </div>

            <div className="pt-4 border-t border-white/10">
              <span className="text-[10px] font-bold tracking-[0.2em] text-brand-gold uppercase block mb-2 px-3">
                Gentlemen's Collections
              </span>
              <div className="space-y-0.5">
                {categories.map((cat) => (
                  <Link
                    key={cat.path}
                    to={cat.path}
                    onClick={onClose}
                    className="block px-3 py-2 text-stone-300 hover:text-brand-soft-gold hover:bg-white/5 rounded-lg transition text-xs"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-1">
              <Link
                to="/about"
                onClick={onClose}
                className="block px-3 py-1.5 text-xs text-stone-300 hover:text-white"
              >
                Our Arabian Heritage
              </Link>
              <Link
                to="/blog"
                onClick={onClose}
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-stone-300 hover:text-white"
              >
                <BookOpen className="w-3.5 h-3.5 text-brand-gold" />
                <span>The Fragrance Journal</span>
              </Link>
              <Link
                to="/contact"
                onClick={onClose}
                className="block px-3 py-1.5 text-xs text-stone-300 hover:text-white"
              >
                Concierge & Contact
              </Link>
            </div>
          </div>

          <div className="p-4 border-t border-white/10 bg-black/20 space-y-2">
            {currentUser ? (
              <>
                <Link
                  to="/account"
                  onClick={onClose}
                  className="flex items-center gap-2 px-3 py-2 bg-brand-emerald/70 border border-brand-gold/30 rounded-lg text-xs font-semibold text-brand-soft-gold"
                >
                  <User className="w-4 h-4 text-brand-gold" />
                  <span>My Account ({currentUser.displayName || 'Patron'})</span>
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    onClick={onClose}
                    className="flex items-center gap-2 px-3 py-2 bg-amber-950/60 border border-brand-gold/50 rounded-lg text-xs font-semibold text-brand-gold"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}

                <button
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-xs text-stone-400 hover:text-rose-400 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={onClose}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 border border-brand-gold/40 text-brand-soft-gold rounded-lg text-xs font-semibold hover:bg-white/5 transition"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Log In</span>
                </Link>
                <Link
                  to="/register"
                  onClick={onClose}
                  className="flex items-center justify-center py-2 px-3 bg-brand-gold text-brand-dark-forest rounded-lg text-xs font-bold hover:bg-brand-soft-gold transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
