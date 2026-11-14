import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { orderService } from '../../services/orderService';
import { ShoppingBag, Heart, MapPin, Truck, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

export const AccountOverview = () => {
  const { currentUser, userProfile } = useAuth();
  const { wishlistCount } = useWishlist();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getOrders({ userId: currentUser?.uid }).then(res => {
      setOrders(res);
      setLoading(false);
    });
  }, [currentUser]);

  const deliveredOrders = orders.filter(o => o.orderStatus === 'delivered');
  const pendingOrders = orders.filter(o => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled');

  return (
    <div className="space-y-8">
      
      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Total Orders</span>
            <div className="p-2 bg-emerald-50 rounded-lg text-brand-emerald">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-playfair text-brand-emerald">{orders.length}</div>
          <span className="text-[11px] text-stone-500">{deliveredOrders.length} fulfilled • {pendingOrders.length} active</span>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Saved in Wishlist</span>
            <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-playfair text-brand-emerald">{wishlistCount}</div>
          <Link to="/account/wishlist" className="text-[11px] text-brand-gold hover:underline font-semibold block">
            View private wishlist →
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Saved Addresses</span>
            <div className="p-2 bg-amber-50 rounded-lg text-brand-gold">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-playfair text-brand-emerald">
            {userProfile?.addresses?.length || 1}
          </div>
          <Link to="/account/addresses" className="text-[11px] text-brand-gold hover:underline font-semibold block">
            Manage shipping addresses →
          </Link>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div>
            <h3 className="font-playfair text-xl font-bold text-brand-emerald">
              Recent Flacon Purchases
            </h3>
            <span className="text-xs text-stone-400 font-light">
              Track active dispatches and view itemized invoices
            </span>
          </div>
          <Link
            to="/account/orders"
            className="text-xs font-bold text-brand-emerald hover:text-brand-gold flex items-center gap-1 transition"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-stone-400">Loading purchase history...</div>
        ) : orders.length > 0 ? (
          <div className="divide-y divide-stone-100">
            {orders.slice(0, 3).map((order) => (
              <div key={order.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div>
                  <strong className="text-brand-emerald block text-sm font-semibold">{order.orderNumber}</strong>
                  <span className="text-stone-400">
                    Placed on {new Date(order.createdAt).toLocaleDateString()} • {order.itemsSnapshot?.length || 1} Scents
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800">
                    {order.orderStatus.replace(/_/g, ' ')}
                  </span>
                  <span className="font-bold text-stone-800 text-sm">
                    ₹{order.totalAmount?.toLocaleString('en-IN')}
                  </span>
                  <Link
                    to="/account/orders"
                    className="p-2 border border-stone-200 rounded-lg hover:border-brand-gold text-stone-600 transition"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center space-y-3">
            <ShoppingBag className="w-8 h-8 text-stone-300 mx-auto" />
            <p className="text-xs text-stone-500">You have not placed any orders yet.</p>
            <Link
              to="/shop"
              className="inline-block px-5 py-2 bg-brand-emerald text-brand-soft-gold text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-brand-dark-forest transition"
            >
              Explore Catalogue
            </Link>
          </div>
        )}
      </div>

    </div>
  );
};
