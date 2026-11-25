import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
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
  LayoutDashboard,
  PackageCheck,
  ArrowRight
} from 'lucide-react';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);

  const { currentUser, isAdmin, logout } = useAuth();
  const { totalItemCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change or outside click
  useEffect(() => {
    setIsAccountDropdownOpen(false);
    setIsShopMenuOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Clean, formal, curated navigation
  const navLinks = [
    { 
      name: 'Shop Fragrances', 
      path: '/shop',
      hasDropdown: true,
    },
    { name: 'Best Sellers', path: '/shop?sort=popularity' },
    { name: 'Scent Finder', path: '/fragrance-finder', icon: Compass },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const fragranceCategories = [
    { name: 'Royal Oud & Woods', path: '/category/oud', desc: 'Rare vintage Cambodian & Hindi agarwood' },
    { name: 'Smoked Leather & Tobacco', path: '/category/leather', desc: 'Cordovan leather & cured tobacco accords' },
    { name: 'Dark Amber & Frankincense', path: '/category/amber', desc: 'Precious ambergris & Dhofari resins' },
    { name: 'Artisanal Pure Attars', path: '/category/attars', desc: '100% uncut concentrated perfume oils' },
    { name: 'Private Reserve Extraits', path: '/category/luxury', desc: 'High concentration 35-40% master flacons' },
    { name: 'Gentlemen’s Coffrets', path: '/category/gift-sets', desc: 'Handcrafted luxury presentation gift boxes' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0A192F]/95 backdrop-blur-md shadow-xl py-3 border-b border-blue-800/40 text-white'
            : 'bg-[#0F2C59] py-4 border-b border-blue-900/50 text-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Left: Mobile Menu Trigger & Formal Logo */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-blue-100 hover:text-white rounded-xl hover:bg-white/10 transition"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <MonogramLogo variant="light" />
            </div>

            {/* Center: Formal Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8 xl:gap-10 text-xs font-semibold uppercase tracking-[0.18em]">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path || (link.hasDropdown && location.pathname.startsWith('/category'));
                
                if (link.hasDropdown) {
                  return (
                    <div 
                      key={link.name} 
                      className="relative py-2"
                      onMouseEnter={() => setIsShopMenuOpen(true)}
                      onMouseLeave={() => setIsShopMenuOpen(false)}
                    >
                      <Link
                        to={link.path}
                        className={`flex items-center gap-1.5 transition-colors ${
                          isActive ? 'text-white font-bold' : 'text-blue-100 hover:text-white'
                        }`}
                      >
                        <span>{link.name}</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isShopMenuOpen ? 'rotate-180 text-white' : 'opacity-70'}`} />
                      </Link>

                      {/* Formal Shop Flyout Menu */}
                      {isShopMenuOpen && (
                        <div className="absolute top-full -left-6 w-96 bg-[#0A192F] text-white rounded-2xl shadow-2xl border border-blue-700/50 p-4 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                          <div className="px-3 py-1.5 border-b border-white/10 mb-2 flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
                              Olfactory Realms
                            </span>
                            <Link
                              to="/shop"
                              className="text-[11px] font-semibold text-blue-200 hover:text-white flex items-center gap-1 transition"
                            >
                              <span>All Fragrances</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>

                          <div className="grid grid-cols-1 gap-1">
                            {fragranceCategories.map((item) => (
                              <Link
                                key={item.name}
                                to={item.path}
                                className="p-2.5 rounded-xl hover:bg-blue-900/60 transition group flex flex-col"
                              >
                                <span className="font-playfair font-bold text-sm text-white group-hover:text-blue-200 transition-colors">
                                  {item.name}
                                </span>
                                <span className="text-[11px] text-blue-200/70 font-normal leading-tight mt-0.5">
                                  {item.desc}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {isActive && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white rounded-full shadow-sm" />
                      )}
                    </div>
                  );
                }

                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`py-2 flex items-center gap-1.5 transition-colors relative ${
                      isActive ? 'text-white font-bold' : 'text-blue-100 hover:text-white'
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

            {/* Right: Formal Action Utilities */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Search Trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 text-blue-100 hover:text-white hover:bg-white/10 rounded-xl transition"
                title="Search fragrances"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Trigger */}
              <Link
                to="/account/wishlist"
                className="p-2.5 text-blue-100 hover:text-white hover:bg-white/10 rounded-xl transition relative"
                title="Your Wishlist"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Bag Trigger with Red Button badge */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2.5 text-blue-100 hover:text-white hover:bg-white/10 rounded-xl transition relative"
                title="Luxury Shopping Bag"
                aria-label="Shopping bag"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItemCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md shadow-red-600/40">
                    {totalItemCount}
                  </span>
                )}
              </button>

              {/* Account Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                  className={`px-3 py-2 flex items-center gap-2 rounded-xl text-xs font-semibold tracking-wider uppercase transition border ${
                    isAdmin
                      ? 'border-blue-400/60 bg-blue-900/50 text-white hover:bg-blue-900/80'
                      : 'border-white/20 hover:border-white/40 hover:bg-white/10 text-white'
                  }`}
                  aria-label="User Account"
                >
                  <User className="w-4 h-4 text-blue-300" />
                  <span className="hidden md:inline font-medium capitalize text-[13px]">
                    {currentUser ? (currentUser.displayName?.split(' ')[0] || 'My Account') : 'Account'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-70 hidden sm:inline" />
                </button>

                {/* Formal Account Popover */}
                {isAccountDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-[#0A192F] text-white rounded-2xl shadow-2xl border border-blue-700/50 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
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
                        <span className="text-xs text-blue-300 font-mono block mt-0.5 truncate">
                          {currentUser.email}
                        </span>
                      </div>
                    ) : (
                      <div className="p-3 border-b border-white/10 mb-2 text-center">
                        <span className="font-playfair font-bold text-sm text-white block">
                          House of AB Noor
                        </span>
                        <p className="text-[11px] text-blue-200/80 font-light mt-1 mb-3">
                          Sign in to access your luxury bag, order history, and exclusive allocations.
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <Link
                            to="/login"
                            className="py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold text-center block transition shadow-md shadow-red-600/30 uppercase tracking-wider"
                          >
                            Sign In
                          </Link>
                          <Link
                            to="/register"
                            className="py-2.5 bg-blue-900/50 hover:bg-blue-900/80 border border-blue-400/40 text-blue-100 rounded-xl text-xs font-bold text-center block transition uppercase tracking-wider"
                          >
                            Register
                          </Link>
                        </div>
                      </div>
                    )}

                    {/* Navigation Menu in Dropdown */}
                    <div className="space-y-1 text-xs">
                      {currentUser && (
                        <>
                          <Link
                            to="/account/overview"
                            className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-blue-900/50 hover:text-white transition"
                          >
                            <User className="w-4 h-4 text-blue-300" />
                            <span>My Account</span>
                          </Link>
                          <Link
                            to="/account/orders"
                            className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-blue-900/50 hover:text-white transition"
                          >
                            <ShoppingBag className="w-4 h-4 text-blue-300" />
                            <span>Orders & Invoices</span>
                          </Link>
                        </>
                      )}

                      <Link
                        to="/track-order"
                        className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-blue-900/50 hover:text-white transition"
                      >
                        <PackageCheck className="w-4 h-4 text-blue-300" />
                        <span>Track Order Consignment</span>
                      </Link>

                      {/* Store Administration Shortcut */}
                      {isAdmin ? (
                        <Link
                          to="/admin/dashboard"
                          className="flex items-center gap-2.5 p-2.5 rounded-xl bg-blue-900/60 border border-blue-500/40 text-blue-100 hover:bg-blue-900 transition font-bold my-1"
                        >
                          <LayoutDashboard className="w-4 h-4 text-blue-300" />
                          <span>Store Administration</span>
                        </Link>
                      ) : (
                        <Link
                          to="/login"
                          className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-blue-900/50 text-blue-200 transition"
                        >
                          <ShieldCheck className="w-4 h-4 text-blue-300" />
                          <span>Admin Portal Login</span>
                        </Link>
                      )}

                      {currentUser && (
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-2.5 p-2.5 rounded-xl text-red-300 hover:bg-red-950/40 transition text-left pt-2 border-t border-white/10 mt-1"
                        >
                          <LogOut className="w-4 h-4 text-red-400" />
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
        categoryItems={fragranceCategories}
      />
    </>
  );
};
