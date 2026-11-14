import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  ShieldCheck, 
  LogOut, 
  Sparkles,
  LayoutDashboard
} from 'lucide-react';

export const CustomerLayout = () => {
  const { currentUser, userProfile, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Account Overview', path: '/account/overview', icon: LayoutDashboard },
    { name: 'My Orders & Invoices', path: '/account/orders', icon: ShoppingBag },
    { name: 'Bespoke Wishlist', path: '/account/wishlist', icon: Heart },
    { name: 'Saved Addresses', path: '/account/addresses', icon: MapPin },
    { name: 'Profile Information', path: '/account/profile', icon: User },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Top Banner */}
      <div className="bg-brand-dark-forest rounded-3xl p-6 sm:p-8 text-white border border-brand-gold/30 shadow-xl mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold">
            ROYAL PATRON PRIVILEGES
          </span>
          <h1 className="font-playfair text-2xl sm:text-3xl font-bold mt-1">
            Welcome, {userProfile?.fullName || currentUser?.displayName || 'Royal Patron'}
          </h1>
          <p className="text-xs text-stone-300 font-light">
            Tier: Private Circle Member • {userProfile?.email || currentUser?.email}
          </p>
        </div>

        {isAdmin && (
          <NavLink
            to="/admin/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-gold text-brand-dark-forest font-bold text-xs uppercase tracking-wider rounded-xl shadow hover:bg-brand-soft-gold transition"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Store Admin Portal</span>
          </NavLink>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Sidebar Nav */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-4 shadow-sm space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-brand-emerald text-brand-soft-gold shadow-sm font-bold'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-brand-emerald'
                }`
              }
            >
              <item.icon className="w-4 h-4 text-brand-gold shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}

          <div className="pt-2 border-t border-stone-100 mt-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold text-stone-400 hover:text-rose-600 hover:bg-rose-50/50 transition"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Content Outlet */}
        <div className="lg:col-span-3">
          <Outlet />
        </div>

      </div>

    </div>
  );
};
