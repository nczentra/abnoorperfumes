import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import confetti from 'canvas-confetti';
import { jsPDF } from 'jspdf';
import { 
  CheckCircle2, 
  ShoppingBag, 
  Truck, 
  Download, 
  MapPin, 
  ShieldCheck, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const OrderSuccess = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C6A15B', '#103B2D', '#E5D3A3', '#0B2119'],
      });
    } catch (e) {
      // ignore
    }

    const loadOrder = async () => {
      const data = await orderService.getOrderById(orderId);
      setOrder(data);
      setLoading(false);
    };

    loadOrder();
  }, [orderId]);

  const generatePDFInvoice = () => {
    if (!order) return;

    const doc = new jsPDF();

    // Emerald Header
    doc.setFillColor(16, 59, 45); // #103B2D
    doc.rect(0, 0, 210, 35, 'F');

    // Title
    doc.setFont('times', 'bold');
    doc.setTextColor(229, 211, 163); // Soft Gold
    doc.setFontSize(22);
    doc.text('AB NOOR PERFUMES', 105, 18, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text('The Essence of Elegance — Official Tax Invoice', 105, 26, { align: 'center' });

    // Invoice Meta
    doc.setTextColor(23, 23, 23);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Invoice / Order: ${order.orderNumber}`, 14, 48);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 54);
    doc.text(`Payment: ${order.paymentMethod.toUpperCase()} (${order.paymentStatus.toUpperCase()})`, 14, 60);

    // Customer Info
    doc.setFont('helvetica', 'bold');
    doc.text('Billed & Shipped To:', 120, 48);
    doc.setFont('helvetica', 'normal');
    doc.text(order.customerSnapshot?.name || 'Valued Patron', 120, 54);
    doc.text(order.customerSnapshot?.phone || '', 120, 60);
    doc.text(`${order.addressSnapshot?.houseNumber}, ${order.addressSnapshot?.street}`, 120, 66);
    doc.text(`${order.addressSnapshot?.city}, ${order.addressSnapshot?.state} - ${order.addressSnapshot?.pincode}`, 120, 72);

    // Table Header
    doc.setFillColor(248, 245, 239); // Ivory
    doc.rect(14, 82, 182, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('Item Description', 16, 87);
    doc.text('Volume', 110, 87);
    doc.text('Qty', 140, 87);
    doc.text('Total (INR)', 170, 87);

    // Items
    let y = 96;
    doc.setFont('helvetica', 'normal');
    (order.itemsSnapshot || []).forEach((item) => {
      doc.text(item.productName, 16, y);
      doc.text(item.variantSize || '50ml', 110, y);
      doc.text(String(item.quantity), 140, y);
      doc.text(`Rs. ${(item.price * item.quantity).toLocaleString('en-IN')}`, 170, y);
      y += 8;
    });

    // Summary Line
    y += 6;
    doc.line(14, y, 196, y);
    y += 8;
    doc.text(`Subtotal: Rs. ${order.subtotal?.toLocaleString('en-IN')}`, 140, y);
    y += 6;
    if (order.discount > 0) {
      doc.text(`Discount (${order.couponCode || 'Promo'}): -Rs. ${order.discount?.toLocaleString('en-IN')}`, 140, y);
      y += 6;
    }
    doc.text(`Shipping: ${order.shippingCharge === 0 ? 'Complimentary' : `Rs. ${order.shippingCharge}`}`, 140, y);
    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Amount: Rs. ${order.totalAmount?.toLocaleString('en-IN')}`, 140, y);

    // Footer note
    doc.setFont('times', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(119, 119, 119);
    doc.text('Thank you for patronizing AB Noor Perfumes. For concierge inquiries, reach out at concierge@abnoorperfumes.com', 105, 280, { align: 'center' });

    doc.save(`AB_Noor_Invoice_${order.orderNumber}.pdf`);
  };

  if (loading) {
    return (
      <div className="py-32 text-center">
        <div className="w-12 h-12 border-2 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-stone-500">Preparing order confirmation...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
      
      {/* Celebration Header Card */}
      <div className="bg-white rounded-3xl border border-brand-gold/40 p-8 sm:p-12 text-center shadow-xl space-y-4">
        <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-brand-gold/50 flex items-center justify-center mx-auto text-brand-emerald">
          <CheckCircle2 className="w-10 h-10 text-brand-emerald" />
        </div>

        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-gold block">
          PURCHASE CONFIRMED
        </span>

        <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-brand-emerald">
          Thank You for Your Patronage
        </h1>

        <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto font-light leading-relaxed">
          Your order has been sealed and dispatched to our master formulation team. A formal confirmation and digital receipt have been recorded.
        </p>

        <div className="inline-flex items-center gap-3 p-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs font-mono">
          <span className="text-stone-400">Order Reference:</span>
          <strong className="text-brand-emerald text-sm font-bold">{order?.orderNumber || orderId}</strong>
        </div>
      </div>

      {/* Order Summary & Actions */}
      {order && (
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-3">
            <div>
              <h3 className="font-playfair text-lg font-bold text-brand-emerald">
                Order Breakdown
              </h3>
              <span className="text-xs text-stone-500">
                Payment: <strong className="text-stone-800 capitalize">{order.paymentMethod}</strong> ({order.paymentStatus})
              </span>
            </div>

            <button
              onClick={generatePDFInvoice}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-brand-gold/50 rounded-xl text-xs font-semibold text-brand-emerald hover:bg-stone-50 transition"
            >
              <Download className="w-3.5 h-3.5 text-brand-gold" />
              <span>Download PDF Invoice</span>
            </button>
          </div>

          {/* Items */}
          <div className="divide-y divide-stone-100 bg-stone-50 rounded-2xl p-4">
            {order.itemsSnapshot?.map((item, i) => (
              <div key={i} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt="" className="w-12 h-12 object-cover rounded-lg border border-stone-200" />
                  <div>
                    <strong className="text-stone-800 block">{item.productName}</strong>
                    <span className="text-stone-500 text-[11px]">{item.variantSize} × {item.quantity}</span>
                  </div>
                </div>
                <span className="font-bold text-brand-emerald">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          {/* Delivery Destination */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs flex items-start gap-3">
            <MapPin className="w-4 h-4 text-brand-emerald shrink-0 mt-0.5" />
            <div>
              <strong className="text-stone-800 block font-semibold">Delivery Destination</strong>
              <div className="text-stone-600 mt-0.5">
                {order.addressSnapshot?.fullName} • {order.addressSnapshot?.phone}<br />
                {order.addressSnapshot?.houseNumber}, {order.addressSnapshot?.street}, {order.addressSnapshot?.city}, {order.addressSnapshot?.state} - {order.addressSnapshot?.pincode}
              </div>
            </div>
          </div>

          {/* Navigation CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-stone-100">
            <Link
              to="/track-order"
              className="flex-1 py-3.5 px-4 bg-brand-emerald hover:bg-brand-dark-forest text-brand-soft-gold rounded-xl font-bold text-xs uppercase tracking-wider text-center transition shadow-md flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4 text-brand-gold" />
              <span>Track Delivery Status</span>
            </Link>

            <Link
              to="/shop"
              className="flex-1 py-3.5 px-4 border border-stone-300 hover:border-brand-gold text-stone-700 rounded-xl font-bold text-xs uppercase tracking-wider text-center transition hover:bg-stone-50"
            >
              Continue Shopping
            </Link>
          </div>

        </div>
      )}

    </div>
  );
};
