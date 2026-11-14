import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import { reportService } from '../../services/reportService';
import { jsPDF } from 'jspdf';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Download, 
  Truck, 
  Eye, 
  X, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { toast } from 'sonner';

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Status update modal state
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('confirmed');
  const [courierName, setCourierName] = useState('Blue Dart Luxury Express');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [statusNote, setStatusNote] = useState('');

  const loadOrders = async () => {
    setLoading(true);
    const data = await orderService.getOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleOpenStatusModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    setCourierName(order.courier || 'Blue Dart Luxury Express');
    setTrackingNumber(order.trackingNumber || `BD-${Math.floor(100000000 + Math.random() * 900000000)}IN`);
    setStatusNote('');
    setUpdateModalOpen(true);
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    await orderService.updateOrderStatus(selectedOrder.id, newStatus, {
      courier: courierName,
      trackingNumber,
      note: statusNote || `Status updated to ${newStatus} by concierge staff.`,
    });

    toast.success(`Order #${selectedOrder.orderNumber} updated to ${newStatus}.`);
    setUpdateModalOpen(false);
    loadOrders();
  };

  const handleExportCSV = () => {
    const csv = reportService.exportOrdersToCSV(orders);
    reportService.downloadCSV(csv, `AB_Noor_Orders_${new Date().toISOString().split('T')[0]}.csv`);
    toast.success('Orders exported to CSV.');
  };

  const printInvoice = (order) => {
    const doc = new jsPDF();

    doc.setFillColor(16, 59, 45); // Emerald
    doc.rect(0, 0, 210, 35, 'F');

    doc.setFont('times', 'bold');
    doc.setTextColor(229, 211, 163);
    doc.setFontSize(22);
    doc.text('AB NOOR PERFUMES', 105, 18, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text('Store Administration Fulfillment Invoice', 105, 26, { align: 'center' });

    doc.setTextColor(23, 23, 23);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`Order Number: ${order.orderNumber}`, 14, 48);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 54);
    doc.text(`Payment: ${order.paymentMethod.toUpperCase()} (${order.paymentStatus})`, 14, 60);

    doc.setFont('helvetica', 'bold');
    doc.text('Shipping Address:', 120, 48);
    doc.setFont('helvetica', 'normal');
    doc.text(order.customerSnapshot?.name || 'Patron', 120, 54);
    doc.text(order.customerSnapshot?.phone || '', 120, 60);
    doc.text(`${order.addressSnapshot?.houseNumber}, ${order.addressSnapshot?.street}`, 120, 66);
    doc.text(`${order.addressSnapshot?.city}, ${order.addressSnapshot?.state} - ${order.addressSnapshot?.pincode}`, 120, 72);

    let y = 85;
    doc.line(14, y, 196, y);
    y += 8;
    (order.itemsSnapshot || []).forEach(item => {
      doc.text(`${item.productName} (${item.variantSize}) x ${item.quantity}`, 16, y);
      doc.text(`Rs. ${(item.price * item.quantity).toLocaleString('en-IN')}`, 160, y);
      y += 8;
    });

    y += 4;
    doc.line(14, y, 196, y);
    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.text(`Total: Rs. ${order.totalAmount?.toLocaleString('en-IN')}`, 160, y);

    doc.save(`Fulfillment_${order.orderNumber}.pdf`);
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerSnapshot?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerSnapshot?.phone?.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || o.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-2xl font-bold text-brand-emerald">
            Orders & Courier Logistics
          </h1>
          <p className="text-xs text-stone-500">
            Fulfill flacon shipments, update tracking numbers, and view customer order history.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 bg-white border border-stone-300 text-stone-700 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-stone-50 transition flex items-center gap-2 shadow-sm"
        >
          <Download className="w-4 h-4 text-brand-gold" />
          <span>Export Orders (CSV)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
          <Search className="w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search by Order #, Patron Name, or Phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs bg-transparent focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-stone-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold text-brand-emerald bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="placed">Placed</option>
            <option value="confirmed">Confirmed</option>
            <option value="packed">Packed</option>
            <option value="shipped">Shipped</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-stone-200">
            <thead className="bg-stone-50 text-[11px] font-bold uppercase tracking-wider text-stone-500">
              <tr>
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Patron & Contact</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Fulfillment Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-stone-50/60 transition">
                  <td className="py-3.5 px-4 font-bold text-brand-emerald">
                    {order.orderNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <strong className="text-stone-800 block">{order.customerSnapshot?.name}</strong>
                    <span className="text-stone-400 text-[10px]">{order.customerSnapshot?.phone}</span>
                  </td>
                  <td className="py-3.5 px-4 text-stone-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold">{order.itemsSnapshot?.length || 0} Flacons</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-stone-800">
                    ₹{order.totalAmount?.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="capitalize font-semibold block">{order.paymentMethod}</span>
                    <span className="text-[10px] text-stone-400">{order.paymentStatus}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                      {order.orderStatus.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenStatusModal(order)}
                      className="px-2.5 py-1 bg-brand-emerald text-brand-soft-gold rounded-lg font-bold text-[10px] uppercase hover:bg-brand-dark-forest transition"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => printInvoice(order)}
                      className="p-1.5 text-stone-500 hover:text-brand-emerald rounded-lg hover:bg-stone-100 transition"
                      title="Print Invoice"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Update Modal */}
      {updateModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-dark-forest/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl border border-brand-gold/40 space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-stone-200">
              <div>
                <h3 className="font-playfair text-lg font-bold text-brand-emerald">
                  Update Fulfillment Status
                </h3>
                <span className="text-xs text-stone-400">Order #{selectedOrder.orderNumber}</span>
              </div>
              <button onClick={() => setUpdateModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStatusUpdate} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-600 font-bold uppercase mb-1">New Fulfillment Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-emerald"
                >
                  <option value="placed">Order Placed</option>
                  <option value="confirmed">Confirmed by Concierge</option>
                  <option value="processing">In Preparation / Vault</option>
                  <option value="packed">Packed in Emerald Box</option>
                  <option value="shipped">Handed to Express Courier (Shipped)</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered to Patron</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-600 font-bold uppercase mb-1">Assigned Courier Partner</label>
                <input
                  type="text"
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  placeholder="e.g. Blue Dart Luxury Express"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-emerald"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-bold uppercase mb-1">Courier AWB / Tracking Number</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. BD-982348719IN"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono focus:outline-none focus:border-brand-emerald"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-bold uppercase mb-1">Fulfillment Note (Logged in History)</label>
                <textarea
                  rows={2}
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="e.g. Handed over to Blue Dart South Mumbai Hub for air transit."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-emerald"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setUpdateModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-brand-emerald text-brand-soft-gold rounded-xl font-bold uppercase tracking-wider hover:bg-brand-dark-forest transition"
                >
                  Apply Status Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
