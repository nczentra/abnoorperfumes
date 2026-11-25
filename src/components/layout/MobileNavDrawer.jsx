import React from 'react';
import { Link } from 'react-router-dom';
import { MonogramLogo } from '../common/MonogramLogo';
import { 
  X, 
  ChevronRight, 
  ShoppingBag, 
  Heart, 
  Phone, 
  Mail, 
  Compass, 
  ShieldCheck,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

export const MobileNavDrawer = ({
  isOpen,
  onClose,
  navLinks,
  categoryItems,
}) => {
  const { isAdmin } = useAuth();
  const { wishlistCount } = useWishlist();
  const { totalItemCount } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0A192F]/85 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
        <div className="w-screen max-w-xs bg-[#0A192F] text-white shadow-2xl flex flex-col border-r border-blue-700/50">
          
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <MonogramLogo variant="light" />
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg transition"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Cart & Wishlist Utility on Mobile */}
          <div className="p-3 bg-[#0F2C59]/60 border-b border-white/10 flex items-center justify-around text-xs">
            <Link
              to="/account/wishlist"
              onClick={onClose}
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-white/10 text-blue-100 transition"
            >
              <Heart className="w-4 h-4 text-red-400" />
              <span>Wishlist ({wishlistCount})</span>
            </Link>
            <Link
              to="/cart"
              onClick={onClose}
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-white/10 text-blue-100 transition"
            >
              <ShoppingBag className="w-4 h-4 text-blue-300" />
              <span>Bag ({totalItemCount})</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 text-xs uppercase tracking-wider font-semibold">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={onClose}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-900/40 text-blue-100 hover:text-white transition"
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </Link>
              ))}
            </div>

            {/* Curated Men's Fragrance Collections */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest block px-3">
                Fragrance Collections
              </span>
              <div className="space-y-1 normal-case">
                {categoryItems.map((cat) => (
                  <Link
                    key={cat.name}
                    to={cat.path}
                    onClick={onClose}
                    className="block p-3 rounded-xl hover:bg-blue-900/30 transition"
                  >
                    <span className="font-playfair font-bold text-sm text-white block">
                      {cat.name}
                    </span>
                    <span className="text-[11px] text-blue-200/70 leading-tight block">
                      {cat.desc}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {isAdmin && (
              <div className="pt-4 border-t border-white/10">
                <Link
                  to="/admin/dashboard"
                  onClick={onClose}
                  className="flex items-center gap-2 p-3 bg-blue-900/70 border border-blue-400/40 rounded-xl text-white font-bold transition"
                >
                  <LayoutDashboard className="w-4 h-4 text-blue-300" />
                  <span>Store Administration</span>
                </Link>
              </div>
            )}
          </div>

          {/* Footer Contact */}
          <div className="p-4 border-t border-white/10 text-xs text-blue-200/70 space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-red-500" />
              <span>abnoorperfumes@gmail.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-400" />
              <span>+91 98765 43210</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
