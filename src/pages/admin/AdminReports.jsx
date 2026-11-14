import React, { useState, useEffect } from 'react';
import { reportService } from '../../services/reportService';
import { orderService } from '../../services/orderService';
import { BarChart3, Download, Calendar, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export const AdminReports = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getOrders().then(res => {
      setOrders(res);
      setLoading(false);
    });
  }, []);

  const handleExport = () => {
    const csv = reportService.exportOrdersToCSV(orders);
    reportService.downloadCSV(csv, `AB_Noor_Financial_Report_${new Date().toISOString().split('T')[0]}.csv`);
    toast.success('Financial report downloaded.');
  };

  const totalRev = orders.filter(o => o.orderStatus !== 'cancelled').reduce((s, o) => s + (Number(o.totalAmount) || 0), 0);
  const paidCount = orders.filter(o => o.paymentStatus === 'paid').length;
  const codCount = orders.filter(o => o.paymentMethod === 'cod').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-2xl font-bold text-brand-emerald">
            Financial & Sales Reports
          </h1>
          <p className="text-xs text-stone-500">
            Export transaction histories, sales reconciliation, and revenue audit trails.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="px-4 py-2.5 bg-brand-emerald text-brand-soft-gold rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-brand-dark-forest transition flex items-center gap-2 shadow"
        >
          <Download className="w-4 h-4 text-brand-gold" />
          <span>Download Master Report (CSV)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-stone-400">Net Sales Volume</span>
          <div className="text-2xl font-bold font-playfair text-brand-emerald">₹{totalRev.toLocaleString('en-IN')}</div>
          <span className="text-[11px] text-stone-500">Across {orders.length} lifetime orders</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-stone-400">Prepaid Razorpay Orders</span>
          <div className="text-2xl font-bold font-playfair text-brand-emerald">{paidCount}</div>
          <span className="text-[11px] text-emerald-700 font-semibold">100% digitally reconciled</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-stone-400">Cash on Delivery Orders</span>
          <div className="text-2xl font-bold font-playfair text-brand-emerald">{codCount}</div>
          <span className="text-[11px] text-stone-500">Subject to courier cash remittance</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-sm space-y-4">
        <h3 className="font-playfair text-lg font-bold text-brand-emerald pb-2 border-b border-stone-100">
          Reconciliation Ledger
        </h3>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left divide-y divide-stone-100">
            <thead className="text-[10px] font-bold uppercase text-stone-500 bg-stone-50">
              <tr>
                <th className="py-2.5 px-3">Transaction Date</th>
                <th className="py-2.5 px-3">Order Number</th>
                <th className="py-2.5 px-3">Patron Name</th>
                <th className="py-2.5 px-3">Method</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="py-2 px-3 text-stone-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="py-2 px-3 font-mono font-bold text-brand-emerald">{o.orderNumber}</td>
                  <td className="py-2 px-3">{o.customerSnapshot?.name}</td>
                  <td className="py-2 px-3 uppercase">{o.paymentMethod}</td>
                  <td className="py-2 px-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100">
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right font-bold">₹{o.totalAmount?.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
