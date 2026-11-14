import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import { jsPDF } from 'jspdf';
import { 
  ShoppingBag, 
  Download, 
  Truck, 
  CheckCircle2, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw 
} from 'lucide-react';
import { toast } from 'sonner';

export const CustomerOrders = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    orderService.getOrders({ userId: currentUser?.uid }).then(res => {
      setOrders(res);
      setLoading(false);
    });
  }, [currentUser]);

  const handleCancelOrder = async (orderId) => {
    const confirm = window.confirm('Are you sure you wish to cancel this perfume order?');
    if (!confirm) return;

    try {
      await orderService.cancelOrder(orderId, 'Cancelled by patron');
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: 'cancelled' } : o));
      toast.info('Order has been cancelled.');
    } catch (e) {
      toast.error('Failed to cancel order.');
    }
  };

  const generatePDFInvoice = (order) => {
    const doc = new jsPDF();

    doc.setFillColor(16, 59, 45); // Emerald
    doc.rect(0, 0, 210, 35, 'F');

    doc.setFont('times', 'bold');
    doc.setTextColor(229, 211, 163);
    doc.setFontSize(22);
    doc.text('AB NOOR PERFUMES', 105, 18, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text('Official Customer Order Receipt', 105, 26, { align: 'center' });

    doc.setTextColor(23, 23, 23);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`Order Number: ${order.orderNumber}`, 14, 48);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 54);
    doc.text(`Status: ${order.orderStatus.toUpperCase()}`, 14, 60);

    doc.setFont('helvetica', 'bold');
    doc.text('Delivery Destination:', 120, 48);
    doc.setFont('helvetica', 'normal');
    doc.text(order.addressSnapshot?.fullName || 'Patron', 120, 54);
    doc.text(`${order.addressSnapshot?.houseNumber}, ${order.addressSnapshot?.street}`, 120, 60);
    doc.text(`${order.addressSnapshot?.city}, ${order.addressSnapshot?.pincode}`, 120, 66);

    let y = 80;
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

    doc.save(`Invoice_${order.orderNumber}.pdf`);
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-stone-100">
        <div>
          <h2 className="font-playfair text-xl font-bold text-brand-emerald">
            My Flacon Orders & Invoices
          </h2>
          <p className="text-xs text-stone-400 font-light">
            View dispatch history, couriers, and download formal tax receipts.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-stone-400">Loading your purchases...</div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedId === order.id;
            return (
              <div
                key={order.id}
                className="border border-stone-200 rounded-2xl overflow-hidden transition"
              >
                {/* Header Row */}
                <div 
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  className="p-5 bg-stone-50/70 hover:bg-stone-50 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs select-none"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <strong className="font-bold text-sm text-brand-emerald">
                        {order.orderNumber}
                      </strong>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                        {order.orderStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <span className="text-stone-400 text-[11px]">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">Total Amount</span>
                      <strong className="text-stone-900 text-sm font-bold">
                        ₹{order.totalAmount?.toLocaleString('en-IN')}
                      </strong>
                    </div>

                    <button className="p-1 text-stone-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-5 border-t border-stone-200 bg-white space-y-5 text-xs">
                    {/* Courier and Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100">
                      <div className="flex items-center gap-2 text-stone-600">
                        <Truck className="w-4 h-4 text-brand-gold" />
                        <span>
                          Courier: <strong>{order.courier || 'Blue Dart Luxury Express'}</strong> • Tracking: <strong>{order.trackingNumber || 'Assigned on dispatch'}</strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => generatePDFInvoice(order)}
                          className="px-3 py-1.5 border border-brand-gold/50 rounded-lg text-brand-emerald hover:bg-stone-50 transition flex items-center gap-1 font-semibold"
                        >
                          <Download className="w-3.5 h-3.5 text-brand-gold" />
                          <span>PDF Invoice</span>
                        </button>

                        {(order.orderStatus === 'placed' || order.orderStatus === 'confirmed') && (
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="px-3 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          >
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Ordered Items */}
                    <div className="divide-y divide-stone-100 bg-stone-50 rounded-xl p-4">
                      {order.itemsSnapshot?.map((item, idx) => (
                        <div key={idx} className="py-2 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img src={item.image} alt="" className="w-10 h-10 object-cover rounded border border-stone-200" />
                            <div>
                              <strong className="text-stone-800 block">{item.productName}</strong>
                              <span className="text-[11px] text-stone-500">Volume: {item.variantSize} × {item.quantity}</span>
                            </div>
                          </div>
                          <span className="font-bold text-brand-emerald">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Address Snapshot */}
                    <div className="text-stone-600 bg-stone-50 p-4 rounded-xl">
                      <strong className="block text-stone-800 font-semibold mb-1">Delivered To:</strong>
                      {order.addressSnapshot?.fullName} • {order.addressSnapshot?.phone}<br />
                      {order.addressSnapshot?.houseNumber}, {order.addressSnapshot?.street}, {order.addressSnapshot?.city} - {order.addressSnapshot?.pincode}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center text-xs text-stone-400">
          No orders on record.
        </div>
      )}
    </div>
  );
};
