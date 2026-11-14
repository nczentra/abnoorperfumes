import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from '../layouts/PublicLayout';
import { CustomerLayout } from '../layouts/CustomerLayout';
import { AdminLayout } from '../layouts/AdminLayout';

// Route Guards
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';

// Public Pages
import { Home } from '../pages/public/Home';
import { Shop } from '../pages/public/Shop';
import { CategoryPage } from '../pages/public/CategoryPage';
import { ProductDetail } from '../pages/public/ProductDetail';
import { FragranceFinder } from '../pages/public/FragranceFinder';
import { ComparePage } from '../pages/public/ComparePage';
import { CartPage } from '../pages/public/CartPage';
import { Checkout } from '../pages/public/Checkout';
import { OrderSuccess } from '../pages/public/OrderSuccess';
import { TrackOrder } from '../pages/public/TrackOrder';
import { About } from '../pages/public/About';
import { Contact } from '../pages/public/Contact';
import { FAQ } from '../pages/public/FAQ';
import { FragranceGuide } from '../pages/public/FragranceGuide';
import { BlogList } from '../pages/public/BlogList';
import { BlogDetail } from '../pages/public/BlogDetail';
import { PolicyPages } from '../pages/public/PolicyPages';

// Auth Pages
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import { ForgotPassword } from '../pages/auth/ForgotPassword';

// Customer Pages
import { AccountOverview } from '../pages/customer/AccountOverview';
import { CustomerOrders } from '../pages/customer/CustomerOrders';
import { CustomerWishlist } from '../pages/customer/CustomerWishlist';
import { CustomerAddresses } from '../pages/customer/CustomerAddresses';
import { CustomerProfile } from '../pages/customer/CustomerProfile';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminProducts } from '../pages/admin/AdminProducts';
import { AdminOrders } from '../pages/admin/AdminOrders';
import { AdminCategories } from '../pages/admin/AdminCategories';
import { AdminBrands } from '../pages/admin/AdminBrands';
import { AdminInventory } from '../pages/admin/AdminInventory';
import { AdminCoupons } from '../pages/admin/AdminCoupons';
import { AdminReviews } from '../pages/admin/AdminReviews';
import { AdminBanners } from '../pages/admin/AdminBanners';
import { AdminReports } from '../pages/admin/AdminReports';
import { AdminSettings } from '../pages/admin/AdminSettings';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/best-sellers" element={<Shop />} />
        <Route path="/new-arrivals" element={<Shop />} />
        <Route path="/offers" element={<Shop />} />
        <Route path="/fragrance-finder" element={<FragranceFinder />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success/:orderId" element={<OrderSuccess />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/fragrance-guide" element={<FragranceGuide />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/privacy-policy" element={<PolicyPages />} />
        <Route path="/terms" element={<PolicyPages />} />
        <Route path="/shipping-policy" element={<PolicyPages />} />
        <Route path="/return-policy" element={<PolicyPages />} />
        <Route path="/cancellation-policy" element={<PolicyPages />} />
      </Route>

      {/* Authentication */}
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Customer Account Portal */}
      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <PublicLayout />
          </ProtectedRoute>
        }
      >
        <Route element={<CustomerLayout />}>
          <Route index element={<Navigate to="/account/overview" replace />} />
          <Route path="overview" element={<AccountOverview />} />
          <Route path="orders" element={<CustomerOrders />} />
          <Route path="wishlist" element={<CustomerWishlist />} />
          <Route path="addresses" element={<CustomerAddresses />} />
          <Route path="profile" element={<CustomerProfile />} />
        </Route>
      </Route>

      {/* Admin Dashboard */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="brands" element={<AdminBrands />} />
        <Route path="inventory" element={<AdminInventory />} />
        <Route path="coupons" element={<AdminCoupons />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="banners" element={<AdminBanners />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
