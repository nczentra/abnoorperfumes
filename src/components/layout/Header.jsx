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
  Menu, 
  ChevronDown, 
  Compass,
  ArrowRight,
  ShieldCheck,
  User
} from 'lucide-react';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);

  const { isAdmin } = useAuth();
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

  // Close menus on route change
  useEffect(() => {
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
            
            {/* Left: Mobile Menu Trigger & Simple Logo */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-blue-100 hover:text-white rounded-xl hover:bg-white/10 transition"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <MonogramLogo variant="light" />
            </div>

            {/* Center: Formal Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8 xl:gap-10 text-xs font-semibold uppercase tracking-[0.16em]">
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

            {/* Right: Formal Action Utilities (Search, Wishlist, Bag - No user clutter) */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-blue-100 hover:text-white hover:bg-white/10 rounded-xl transition"
                title="Search fragrances"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                to="/account/wishlist"
                className="p-2 text-blue-100 hover:text-white hover:bg-white/10 rounded-xl transition relative"
                title="Wishlist"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Bag with red count badge */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2 text-blue-100 hover:text-white hover:bg-white/10 rounded-xl transition relative"
                title="Shopping Bag"
                aria-label="Shopping bag"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItemCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md shadow-red-600/40">
                    {totalItemCount}
                  </span>
                )}
              </button>

              {/* Sleek 1-Click Sign In / Admin Link */}
              <Link
                to="/login"
                className="p-2 text-blue-100 hover:text-white hover:bg-white/10 rounded-xl transition"
                title="Sign In / Admin"
                aria-label="Sign In or Create Account"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Administrator Shortcut (Only visible if already authenticated as Admin) */}
              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-900/60 hover:bg-blue-900 border border-blue-400/50 rounded-xl text-xs font-bold text-white transition ml-1"
                  title="Store Admin Dashboard"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
                  <span>Admin</span>
                </Link>
              )}

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
