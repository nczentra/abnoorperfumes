import React from 'react';
import { Link } from 'react-router-dom';
import { MonogramLogo } from '../common/MonogramLogo';
import { 
  X, 
  ChevronRight, 
  ShoppingBag, 
  Heart, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
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
  const { currentUser, isAdmin, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const { totalItemCount } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#070B14]/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
        <div className="w-screen max-w-xs bg-[#070B14] text-white shadow-2xl flex flex-col border-r border-blue-900/40">
          
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

          {/* User Quick Bar */}
          <div className="p-4 bg-[#0A192F]/60 border-b border-white/10">
            {currentUser ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">
                    {currentUser.displayName || 'Gentleman Patron'}
                  </span>
                  {isAdmin && (
                    <span className="px-2 py-0.5 bg-red-600 text-white text-[9px] font-bold uppercase rounded-full">
                      Admin
                    </span>
                  )}
                </div>
                <span className="text-xs text-blue-300 font-mono block truncate">
                  {currentUser.email}
                </span>

                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    onClick={onClose}
                    className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white text-xs font-bold rounded-xl shadow-md transition mt-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Store Admin Dashboard</span>
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={onClose}
                  className="py-2 text-center bg-red-600 text-white rounded-xl font-bold text-xs uppercase"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={onClose}
                  className="py-2 text-center bg-blue-900/50 border border-blue-500/30 text-blue-200 rounded-xl font-bold text-xs uppercase"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 text-xs uppercase tracking-wider font-semibold">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={onClose}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-900/40 text-slate-200 hover:text-white transition"
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </Link>
              ))}
            </div>

            {/* Curated Men's Fragrance Collections */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest block px-3">
                Curated Collections
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
                    <span className="text-[11px] text-slate-400 leading-tight block">
                      {cat.desc}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Contact */}
          <div className="p-4 border-t border-white/10 text-xs text-slate-400 space-y-2">
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
