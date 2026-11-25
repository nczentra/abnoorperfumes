import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { MonogramLogo } from '../common/MonogramLogo';
import { SearchModal } from './SearchModal';
import { CartDrawer } from './CartDrawer';
import { MobileNavDrawer } from './MobileNavDrawer';
import { 
  Search, 
  Heart, 
  ShoppingBag, 
  User, 
  Menu, 
  ChevronDown, 
  ShieldCheck, 
  LogOut, 
  Compass,
  LayoutDashboard
} from 'lucide-react';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  const { currentUser, userProfile, isAdmin, logout, toggleRole } = useAuth();
  const { totalItemCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { compareItems } = useCompare();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsAccountDropdownOpen(false);
    setIsCategoryMenuOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { 
      name: 'Shop', 
      path: '/shop',
      hasDropdown: true,
    },
    { name: 'Royal Oud', path: '/category/oud' },
    { name: 'Leather & Woods', path: '/category/leather' },
    { name: 'Dark Amber', path: '/category/amber' },
    { name: 'Pure Attars', path: '/category/attars' },
    { name: 'Gift Coffrets', path: '/category/gift-sets' },
    { name: 'About Us', path: '/about' },
    { name: 'Scent Finder', path: '/fragrance-finder', icon: Compass },
  ];

  const categoryDropdownItems = [
    { name: 'Complete Men’s Catalogue', path: '/shop', desc: 'Browse all masculine extraits & attars' },
    { name: 'Royal Oud & Agarwood', path: '/category/oud', desc: 'Cambodian, Hindi, and Trat agarwood extraits' },
    { name: 'Smoked Leather & Tobacco', path: '/category/leather', desc: 'Cordovan leather, roasted coffee & birch smoke' },
    { name: 'Dark Amber & Frankincense', path: '/category/amber', desc: 'Sun-cured ambergris & Dhofari incense' },
    { name: 'Artisanal Pure Attars', path: '/category/attars', desc: '100% pure alcohol-free concentrated oils' },
    { name: 'Private Reserve Extrait', path: '/category/luxury', desc: '35-40% oil concentration crystal flacons' },
    { name: 'Gentlemen’s Discovery Sets', path: '/category/gift-sets', desc: 'Solid wood coffrets with gold filigree' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0A192F]/95 backdrop-blur-md shadow-2xl py-3 border-b border-blue-700/50 text-white'
            : 'bg-[#0F2C59] py-4 border-b border-blue-800/40 text-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Left: Mobile Menu Toggle & Brand Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-blue-100 hover:text-white rounded-lg transition"
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              <MonogramLogo variant="light" />
            </div>

            {/* Middle: Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-semibold uppercase tracking-widest text-blue-100">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                if (link.hasDropdown) {
                  return (
                    <div 
                      key={link.name} 
                      className="relative"
                      onMouseEnter={() => setIsCategoryMenuOpen(true)}
                      onMouseLeave={() => setIsCategoryMenuOpen(false)}
                    >
                      <Link
                        to={link.path}
                        className={`flex items-center gap-1 py-2 hover:text-white transition ${
                          isActive ? 'text-white font-bold' : 'text-blue-100'
                        }`}
                      >
                        <span>{link.name}</span>
                        <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                      </Link>

                      {/* Dropdown Menu */}
                      {isCategoryMenuOpen && (
                        <div className="absolute top-full left-0 w-80 bg-[#0F2C59] text-white rounded-2xl shadow-2xl border border-blue-400/40 p-3 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                          {categoryDropdownItems.map((item) => (
                            <Link
                              key={item.name}
                              to={item.path}
                              className="block p-3 rounded-xl hover:bg-blue-800/60 transition group"
                            >
                              <span className="font-playfair font-bold text-sm text-white group-hover:text-blue-200 block">
                                {item.name}
                              </span>
                              <span className="text-[11px] text-blue-200/80 font-normal leading-tight block mt-0.5">
                                {item.desc}
                              </span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`py-2 flex items-center gap-1.5 hover:text-white transition relative ${
                      isActive ? 'text-white font-bold' : 'text-blue-100'
                    }`}
                  >
                    {Icon && <Icon className="w-3.5 h-3.5 text-blue-300" />}
                    <span>{link.name}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white rounded-full shadow-sm" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Action Utilities */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition"
                title="Search fragrances"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Compare Button */}
              {compareItems.length > 0 && (
                <Link
                  to="/compare"
                  className="p-2.5 text-slate-300 hover:text-blue-400 hover:bg-white/5 rounded-xl transition relative hidden sm:flex"
                  title="Compare fragrances"
                >
                  <span className="text-xs font-bold font-mono">VS</span>
                  <span className="absolute -top-0.5 -right-0.5 bg-blue-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {compareItems.length}
                  </span>
                </Link>
              )}

              {/* Wishlist Button with Red Badge */}
              <Link
                to="/account/wishlist"
                className="p-2.5 text-slate-300 hover:text-red-400 hover:bg-white/5 rounded-xl transition relative"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger with Red Badge */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2.5 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition relative"
                title="Shopping Bag"
                aria-label="View shopping bag"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-lg shadow-red-600/40">
                    {totalItemCount}
                  </span>
                )}
              </button>

              {/* Account Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                  className={`p-2 sm:px-3 sm:py-2 flex items-center gap-2 rounded-xl text-xs font-semibold transition border ${
                    isAdmin
                      ? 'border-red-500/50 bg-red-950/30 text-red-200 hover:bg-red-900/40'
                      : 'border-white/10 hover:border-blue-500/40 hover:bg-white/5 text-slate-200'
                  }`}
                  aria-label="User Account"
                >
                  <User className="w-4 h-4 text-blue-400" />
                  {currentUser && (
                    <span className="hidden md:inline font-medium">
                      {currentUser.displayName?.split(' ')[0] || (isAdmin ? 'Admin' : 'Patron')}
                    </span>
                  )}
                  {isAdmin && (
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-ping hidden md:inline-block" />
                  )}
                  <ChevronDown className="w-3.5 h-3.5 opacity-60 hidden sm:inline" />
                </button>

                {/* Account Popover */}
                {isAccountDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-[#0F2C59] text-white rounded-2xl shadow-2xl border border-blue-400/40 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {currentUser ? (
                      <div className="p-3 border-b border-white/10 mb-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-sm block">
                            {currentUser.displayName || 'Gentleman Patron'}
                          </span>
                          {isAdmin && (
                            <span className="px-2 py-0.5 bg-red-600 text-white text-[9px] font-bold uppercase rounded-full">
                              Admin
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-blue-300 font-mono block mt-0.5">
                          {currentUser.email}
                        </span>
                      </div>
                    ) : (
                      <div className="p-3 border-b border-white/10 mb-2 text-center">
                        <span className="font-playfair font-bold text-sm text-white block">
                          House of AB Noor
                        </span>
                        <span className="text-xs text-slate-400 font-light block mb-3">
                          Sign in for orders & private reservations
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          <Link
                            to="/login"
                            className="py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold text-center block transition shadow-md shadow-red-600/30"
                          >
                            Sign In
                          </Link>
                          <Link
                            to="/register"
                            className="py-2 bg-blue-900/40 hover:bg-blue-900/80 border border-blue-500/30 text-blue-200 rounded-xl text-xs font-bold text-center block transition"
                          >
                            Register
                          </Link>
                        </div>
                      </div>
                    )}

                    {/* Nav Links inside Dropdown */}
                    <div className="space-y-1 text-xs">
                      {currentUser && (
                        <>
                          <Link
                            to="/account/overview"
                            className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-blue-900/50 hover:text-white transition"
                          >
                            <User className="w-4 h-4 text-blue-400" />
                            <span>Patron Account Portal</span>
                          </Link>
                          <Link
                            to="/account/orders"
                            className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-blue-900/50 hover:text-white transition"
                          >
                            <ShoppingBag className="w-4 h-4 text-blue-400" />
                            <span>My Orders & Invoices</span>
                          </Link>
                        </>
                      )}

                      {/* Store Admin Dashboard Access */}
                      {isAdmin ? (
                        <Link
                          to="/admin/dashboard"
                          className="flex items-center gap-2.5 p-2.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 hover:bg-red-900/50 font-bold transition my-1"
                        >
                          <LayoutDashboard className="w-4 h-4 text-red-400" />
                          <span>Store Admin Dashboard</span>
                        </Link>
                      ) : (
                        <Link
                          to="/login"
                          className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-blue-900/50 text-blue-300 transition"
                        >
                          <ShieldCheck className="w-4 h-4 text-blue-400" />
                          <span>Admin Login (abnoorperfumes@gmail.com)</span>
                        </Link>
                      )}

                      <Link
                        to="/about"
                        className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-blue-900/50 hover:text-white transition"
                      >
                        <ShieldCheck className="w-4 h-4 text-blue-400" />
                        <span>About Our Heritage</span>
                      </Link>

                      <Link
                        to="/track-order"
                        className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-blue-900/50 hover:text-white transition"
                      >
                        <Compass className="w-4 h-4 text-blue-400" />
                        <span>Track Consignment</span>
                      </Link>

                      {/* Quick Developer / Demo Role Toggle */}
                      <button
                        onClick={toggleRole}
                        className="w-full text-left p-2 rounded-lg bg-black/40 text-[10px] text-slate-400 hover:text-white transition block mt-1"
                        title="Toggle Admin/Customer role in dev mode"
                      >
                        [Quick Switch]: Currently {isAdmin ? 'Store Admin' : 'Patron'} (Click to toggle)
                      </button>

                      {currentUser && (
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-2.5 p-2.5 rounded-xl text-red-400 hover:bg-red-950/30 transition text-left pt-2 border-t border-white/10"
                        >
                          <LogOut className="w-4 h-4 text-red-500" />
                          <span>Sign Out</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </header>

      {/* Global Modals & Drawers */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CartDrawer />
      <MobileNavDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navLinks={navLinks}
        categoryItems={categoryDropdownItems}
      />
    </>
  );
};
