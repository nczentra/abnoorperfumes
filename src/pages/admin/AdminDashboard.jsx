import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reportService } from '../../services/reportService';
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Plus,
  Boxes,
  TrendingUp
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reportService.getDashboardAnalytics().then(analytics => {
      setData(analytics);
      setLoading(false);
    });
  }, []);

  const COLORS = ['#103B2D', '#C6A15B', '#E5D3A3', '#0B2119', '#154E3C', '#B08845'];

  if (loading || !data) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-2 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-stone-500">Aggregating store metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-brand-emerald">
            Store Executive Overview
          </h1>
          <p className="text-xs text-stone-500 font-light">
            Real-time analytics, revenue, orders, and inventory metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 shadow-md shadow-red-600/30"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Add New Flacon</span>
          </Link>

          <Link
            to="/admin/inventory"
            className="px-4 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition flex items-center gap-1.5"
          >
            <Boxes className="w-4 h-4 text-blue-600" />
            <span>Manage Stock</span>
          </Link>
        </div>
      </div>

      {/* 4 Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Revenue */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold uppercase tracking-wider">
            <span>Total Sales Revenue</span>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-800">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-playfair text-brand-emerald">
            ₹{data.totalRevenue?.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-stone-500">
            Today's Revenue: <strong className="text-stone-800">₹{data.todaySales?.toLocaleString('en-IN')}</strong>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold uppercase tracking-wider">
            <span>Total Orders Placed</span>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-800">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-playfair text-brand-emerald">
            {data.totalOrders}
          </div>
          <div className="text-[11px] text-stone-500">
            Pending Dispatch: <strong className="text-amber-700">{data.pendingOrders}</strong> • Fulfilled: <strong>{data.deliveredOrders}</strong>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold uppercase tracking-wider">
            <span>Active Formulations</span>
            <div className="p-2 bg-purple-50 rounded-lg text-purple-800">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-playfair text-brand-emerald">
            {data.totalProducts}
          </div>
          <div className="text-[11px] text-stone-500">
            Avg Order Value: <strong>₹{data.avgOrderValue?.toLocaleString('en-IN')}</strong>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold uppercase tracking-wider">
            <span>Inventory Attention</span>
            <div className="p-2 bg-rose-50 rounded-lg text-rose-800">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-playfair text-rose-700">
            {data.lowStockCount}
          </div>
          <div className="text-[11px] text-stone-500">
            Low stock thresholds ({data.outOfStockCount} out of stock)
          </div>
        </div>

      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 7-Day Revenue Trend (Bar Chart) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-stone-200/80 p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-stone-100">
            <h3 className="font-playfair font-bold text-base text-brand-emerald">
              7-Day Daily Revenue Trend
            </h3>
            <span className="text-[11px] text-stone-400 font-mono">Last 7 Days</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.last7Days}>
                <XAxis dataKey="day" stroke="#777" fontSize={11} />
                <YAxis stroke="#777" fontSize={11} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip 
                  formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#0B2119', color: '#fff', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="revenue" fill="#103B2D" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales by Category (Pie Chart) */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-stone-100">
            <h3 className="font-playfair font-bold text-base text-brand-emerald">
              Sales by Realm
            </h3>
            <span className="text-[11px] text-stone-400 font-mono">Categories</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {data.salesByCategory?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.salesByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {data.salesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Revenue']}
                    contentStyle={{ backgroundColor: '#0B2119', color: '#fff', borderRadius: '12px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-stone-400">Category data will populate with sales.</div>
            )}
          </div>
        </div>

      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <h3 className="font-playfair text-lg font-bold text-brand-emerald">
              Recent Store Orders
            </h3>
            <p className="text-xs text-stone-400">Orders requiring packing and fulfillment.</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-brand-emerald hover:text-brand-gold flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-stone-100">
            <thead className="text-[11px] font-bold uppercase tracking-wider text-stone-500 bg-stone-50/50">
              <tr>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Patron</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {data.recentOrders?.map((order) => (
                <tr key={order.id} className="hover:bg-stone-50/60 transition">
                  <td className="py-3.5 px-4 font-bold text-brand-emerald">
                    {order.orderNumber}
                  </td>
                  <td className="py-3.5 px-4 text-stone-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <strong className="text-stone-800 block">{order.customerSnapshot?.name}</strong>
                    <span className="text-stone-400 text-[10px]">{order.customerSnapshot?.phone}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-stone-800">
                    ₹{order.totalAmount?.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                      {order.orderStatus.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      to="/admin/orders"
                      className="text-brand-emerald font-semibold hover:text-brand-gold underline"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
