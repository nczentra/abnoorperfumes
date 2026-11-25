import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MonogramLogo } from '../components/common/MonogramLogo';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  Crown, 
  ShoppingBag, 
  Boxes, 
  TicketPercent, 
  Star, 
  Image, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';

export const AdminLayout = () => {
  const { currentUser, userProfile, logout, toggleRole } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products & Variants', path: '/admin/products', icon: Package },
    { name: 'Orders & Shipments', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Categories', path: '/admin/categories', icon: Tags },
    { name: 'Perfume Houses (Brands)', path: '/admin/brands', icon: Crown },
    { name: 'Inventory & Stock Logs', path: '/admin/inventory', icon: Boxes },
    { name: 'Coupons & Discounts', path: '/admin/coupons', icon: TicketPercent },
    { name: 'Customer Reviews', path: '/admin/reviews', icon: Star },
    { name: 'Promotional Banners', path: '/admin/banners', icon: Image },
    { name: 'Analytics & Reports', path: '/admin/reports', icon: BarChart3 },
    { name: 'Store Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      
      {/* Top Navbar in Royal Blue & Crisp White */}
      <header className="bg-[#0F2C59] text-white border-b border-blue-800/50 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <MonogramLogo variant="light" showTagline={false} />
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-red-600 text-white font-bold text-[10px] uppercase tracking-wider ml-2 shadow-sm">
            Master Store Administration
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <Link
            to="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-blue-900/40 hover:bg-blue-900/70 text-blue-200 border border-blue-500/30 rounded-lg transition"
            title="View Public Storefront in new tab"
          >
            <span>Live Boutique</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center gap-2 pl-3 border-l border-white/20">
            <div className="text-right hidden md:block">
              <strong className="text-white block font-semibold leading-tight text-xs">
                {userProfile?.fullName || 'AB Noor Admin'}
              </strong>
              <span className="text-[10px] text-blue-300 font-mono">abnoorperfumes@gmail.com</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-white/10 transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar Nav in Deep Midnight Navy */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-20 w-64 bg-[#0A192F] text-white flex flex-col justify-between border-r border-blue-900/40 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0 top-14' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="p-4 space-y-1 overflow-y-auto">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400 block px-3 py-2">
              Management Modules
            </span>

            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                    isActive
                      ? 'bg-[#0F2C59] text-white font-bold shadow-md border-l-4 border-red-600 border-r border-t border-b border-blue-500/50'
                      : 'text-slate-300 hover:bg-blue-900/40 hover:text-white'
                  }`
                }
              >
                <item.icon className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>

          <div className="p-4 border-t border-white/10 text-[11px] text-slate-400 text-center">
            AB Noor Fragrance Engine v1.0.0
          </div>
        </aside>

        {/* Main Admin Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
};
