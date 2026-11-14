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
  Sparkles, 
  ShieldCheck, 
  LogOut, 
  Scale,
  Compass
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
            ? 'bg-brand-dark-forest/95 backdrop-blur-md shadow-xl py-3 border-b border-brand-gold/20'
            : 'bg-brand-dark-forest py-4 border-b border-brand-gold/15'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Left: Mobile Menu Toggle & Brand Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-stone-300 hover:text-brand-soft-gold rounded-lg transition"
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              <MonogramLogo variant="light" />
            </div>

            {/* Center: Desktop Navigation Bar */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
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
                        className={`flex items-center gap-1 px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition-colors ${
                          isActive
                            ? 'text-brand-soft-gold font-bold'
                            : 'text-stone-200 hover:text-brand-soft-gold hover:bg-white/5'
                        }`}
                      >
                        <span>{link.name}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-brand-gold" />
                      </Link>

                      {/* Dropdown Menu */}
                      {isCategoryMenuOpen && (
                        <div className="absolute top-full left-0 w-80 bg-brand-dark-forest border border-brand-gold/30 rounded-xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                          <div className="text-[10px] uppercase tracking-widest text-brand-gold font-bold px-3 py-1.5 border-b border-white/10 mb-1">
                            Gentlemen's Collections
                          </div>
                          {categoryDropdownItems.map((item) => (
                            <Link
                              key={item.path}
                              to={item.path}
                              className="block p-2.5 rounded-lg hover:bg-white/5 transition group"
                            >
                              <div className="text-xs font-semibold text-white group-hover:text-brand-soft-gold transition">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-stone-400 group-hover:text-stone-300 transition">
                                {item.desc}
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`flex items-center gap-1 px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition-colors ${
                      isActive
                        ? 'text-brand-soft-gold font-bold bg-white/5'
                        : 'text-stone-200 hover:text-brand-soft-gold hover:bg-white/5'
                    }`}
                  >
                    {link.icon && <link.icon className="w-3.5 h-3.5 text-brand-gold" />}
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right: Actions (Search, Compare, Wishlist, Account, Cart) */}
            <div className="flex items-center gap-1 sm:gap-2">
              
              {/* Search Icon */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-stone-300 hover:text-brand-soft-gold rounded-full hover:bg-white/5 transition"
                title="Search Fragrances"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Compare Icon */}
              {compareItems.length > 0 && (
                <Link
                  to="/compare"
                  className="relative p-2 text-stone-300 hover:text-brand-soft-gold rounded-full hover:bg-white/5 transition hidden sm:inline-flex"
                  title="Compare Fragrances"
                >
                  <Scale className="w-5 h-5 text-brand-gold" />
                  <span className="absolute -top-1 -right-1 bg-brand-gold text-brand-dark-forest font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {compareItems.length}
                  </span>
                </Link>
              )}

              {/* Wishlist Icon */}
              <Link
                to="/account/wishlist"
                className="relative p-2 text-stone-300 hover:text-brand-soft-gold rounded-full hover:bg-white/5 transition"
                title="Your Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-gold text-brand-dark-forest font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Account Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                  className="p-2 text-stone-300 hover:text-brand-soft-gold rounded-full hover:bg-white/5 transition flex items-center gap-1"
                  title="Account"
                >
                  <User className="w-5 h-5" />
                  {currentUser && (
                    <span className="hidden xl:inline text-xs font-medium text-stone-200">
                      {currentUser.displayName?.split(' ')[0] || 'Patron'}
                    </span>
                  )}
                </button>

                {isAccountDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-brand-dark-forest border border-brand-gold/30 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in duration-150 text-xs">
                    {currentUser ? (
                      <>
                        <div className="p-3 border-b border-white/10 mb-1">
                          <div className="font-semibold text-white truncate">
                            {currentUser.displayName || 'Gentleman Patron'}
                          </div>
                          <div className="text-[11px] text-brand-soft-gold truncate">
                            {currentUser.email}
                          </div>
                        </div>

                        <Link
                          to="/account/overview"
                          onClick={() => setIsAccountDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-stone-200 hover:text-brand-soft-gold hover:bg-white/5 rounded-lg transition"
                        >
                          <User className="w-4 h-4 text-brand-gold" />
                          <span>Patron Dashboard</span>
                        </Link>

                        <Link
                          to="/account/orders"
                          onClick={() => setIsAccountDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-stone-200 hover:text-brand-soft-gold hover:bg-white/5 rounded-lg transition"
                        >
                          <ShoppingBag className="w-4 h-4 text-brand-gold" />
                          <span>My Orders & Invoices</span>
                        </Link>

                        {isAdmin && (
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setIsAccountDropdownOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-brand-gold bg-amber-950/40 border border-brand-gold/30 rounded-lg my-1 font-semibold hover:bg-amber-950/70 transition"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            <span>Store Admin Dashboard</span>
                          </Link>
                        )}

                        <div className="border-t border-white/10 my-1" />

                        <button
                          onClick={() => {
                            logout();
                            setIsAccountDropdownOpen(false);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-stone-400 hover:text-rose-400 hover:bg-white/5 rounded-lg transition"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Log Out</span>
                        </button>
                      </>
                    ) : (
                      <div className="p-2 space-y-2">
                        <div className="text-center pb-2 border-b border-white/10">
                          <p className="text-[11px] text-stone-300 mb-2">
                            Welcome to AB Noor Pour Homme
                          </p>
                          <Link
                            to="/login"
                            onClick={() => setIsAccountDropdownOpen(false)}
                            className="block w-full py-2 bg-brand-gold text-brand-dark-forest font-bold rounded-lg text-center hover:bg-brand-soft-gold transition"
                          >
                            Sign In
                          </Link>
                        </div>
                        <div className="text-center text-[11px] text-stone-400">
                          New patron?{' '}
                          <Link
                            to="/register"
                            onClick={() => setIsAccountDropdownOpen(false)}
                            className="text-brand-soft-gold hover:underline font-semibold"
                          >
                            Create an Account
                          </Link>
                        </div>
                      </div>
                    )}

                    {/* Quick Dev Switcher */}
                    <div className="pt-2 mt-1 border-t border-white/10 text-center">
                      <button
                        onClick={toggleRole}
                        className="text-[10px] text-stone-400 hover:text-brand-gold underline"
                      >
                        [Dev] Role: {isAdmin ? 'Admin' : 'Customer'} (Click to switch)
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Luxury Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 px-3 py-2 bg-brand-emerald hover:bg-brand-emerald/80 text-brand-soft-gold border border-brand-gold/40 rounded-lg text-xs font-semibold transition ml-1 shadow-md shadow-brand-emerald/30 group"
                title="View Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4 text-brand-gold group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Cart</span>
                <span className="bg-brand-gold text-brand-dark-forest font-bold text-[10px] px-1.5 py-0.5 rounded-full">
                  {totalItemCount}
                </span>
              </button>

            </div>
          </div>
        </div>
      </header>

      {/* Global Overlays & Drawers */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CartDrawer />
      <MobileNavDrawer isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
};
