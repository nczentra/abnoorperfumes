import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, FileText, ArrowLeft } from 'lucide-react';

export const PolicyPages = () => {
  const location = useLocation();
  const path = location.pathname;

  let title = 'Privacy Policy';
  let icon = ShieldCheck;
  let content = null;

  if (path.includes('terms')) {
    title = 'Terms & Conditions of Service';
    icon = FileText;
    content = (
      <div className="space-y-4">
        <p>
          Welcome to AB Noor Perfumes. By accessing or purchasing from our platform, you agree to comply with our Terms of Service.
        </p>
        <h4 className="font-playfair text-base font-bold text-brand-emerald">1. Luxury Retail & Authenticity</h4>
        <p>
          All fragrances, attars, and products sold on this platform are 100% authentic formulations distilled and bottled under the supervision of AB Noor Perfumes. We do not sell counterfeit or diluted formulations.
        </p>
        <h4 className="font-playfair text-base font-bold text-brand-emerald">2. Orders and Pricing</h4>
        <p>
          Prices listed are in Indian Rupees (INR) and are inclusive of applicable goods and services taxes. We reserve the right to correct typographical pricing errors prior to order fulfillment.
        </p>
        <h4 className="font-playfair text-base font-bold text-brand-emerald">3. Intellectual Property</h4>
        <p>
          The AB Noor Monogram, brand identity, fragrance descriptions, photographs, and logos are the protected intellectual property of AB Noor Perfumes.
        </p>
      </div>
    );
  } else if (path.includes('shipping')) {
    title = 'Luxury Shipping & White-Glove Delivery Policy';
    icon = Truck;
    content = (
      <div className="space-y-4">
        <p>
          We take extraordinary care in packaging your precious fragrance flacons to ensure they arrive in pristine condition.
        </p>
        <h4 className="font-playfair text-base font-bold text-brand-emerald">1. Complimentary Delivery Threshold</h4>
        <p>
          Orders exceeding ₹2,499 receive complimentary Blue Dart Luxury Air Express delivery across all serviceable PIN codes in India. For orders below this threshold, a flat delivery fee of ₹150 applies.
        </p>
        <h4 className="font-playfair text-base font-bold text-brand-emerald">2. Dispatch Timeline</h4>
        <p>
          Orders received prior to 2:00 PM IST on business days are dispatched on the same day. Standard delivery takes 1 to 3 business days for major metropolitan areas and 3 to 4 business days for other regions.
        </p>
        <h4 className="font-playfair text-base font-bold text-brand-emerald">3. Transit Insurance</h4>
        <p>
          Every shipment is fully insured by AB Noor Perfumes against loss, breakage, or damage during transit.
        </p>
      </div>
    );
  } else if (path.includes('return')) {
    title = 'Returns & Exchanges Policy';
    icon = RotateCcw;
    content = (
      <div className="space-y-4">
        <p>
          Due to the intimate, hygienic nature of luxury perfumery and cosmetic formulations, opened bottles or perfume oils cannot be returned or exchanged once the tamper-evident wax seal has been broken.
        </p>
        <h4 className="font-playfair text-base font-bold text-brand-emerald">1. Damaged or Defective Items</h4>
        <p>
          In the rare event that a bottle arrives broken, leaked, or damaged during transit, please contact our concierge at concierge@abnoorperfumes.com within 48 hours of delivery, accompanied by photographs of the damaged item and packaging. We will immediately dispatch a complimentary replacement.
        </p>
        <h4 className="font-playfair text-base font-bold text-brand-emerald">2. Unopened Flacons</h4>
        <p>
          Unopened bottles with their original cellophane and unbroken gold wax seal intact may be returned within 7 days of receipt, subject to return shipping costs.
        </p>
      </div>
    );
  } else if (path.includes('cancellation')) {
    title = 'Order Cancellation Policy';
    icon = RotateCcw;
    content = (
      <div className="space-y-4">
        <p>
          Orders may be cancelled free of charge before the shipment has been packed and handed over to our express courier partner.
        </p>
        <h4 className="font-playfair text-base font-bold text-brand-emerald">1. Cancellation Window</h4>
        <p>
          To cancel an order, navigate to your Customer Account portal under "My Orders" and select "Cancel Order", or reach out immediately to our WhatsApp Concierge.
        </p>
        <h4 className="font-playfair text-base font-bold text-brand-emerald">2. Refund Processing</h4>
        <p>
          For prepaid Razorpay orders, refunds are processed within 24 hours of cancellation and typically reflect in your original payment method in 3-5 business days.
        </p>
      </div>
    );
  } else {
    // Privacy Policy
    title = 'Privacy Policy';
    icon = ShieldCheck;
    content = (
      <div className="space-y-4">
        <p>
          AB Noor Perfumes respects the confidentiality and privacy of our patrons. We strictly safeguard all personal information collected during your visit.
        </p>
        <h4 className="font-playfair text-base font-bold text-brand-emerald">1. Information We Collect</h4>
        <p>
          We collect your name, delivery address, contact telephone, and email strictly for the purposes of order fulfillment, shipping notifications, and concierge communication.
        </p>
        <h4 className="font-playfair text-base font-bold text-brand-emerald">2. Payment Security</h4>
        <p>
          We never store full credit or debit card numbers on our servers. All transactions are securely encrypted through Razorpay, a PCI-DSS Level 1 compliant gateway.
        </p>
        <h4 className="font-playfair text-base font-bold text-brand-emerald">3. No Third-Party Sharing</h4>
        <p>
          We will never sell, lease, or trade your personal data to external advertisers.
        </p>
      </div>
    );
  }

  const IconComponent = icon;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-brand-emerald hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Boutique</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200/80 p-8 sm:p-12 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-6 border-b border-stone-200">
          <div className="p-3 bg-brand-emerald/10 text-brand-emerald rounded-2xl">
            <IconComponent className="w-6 h-6 text-brand-gold" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">
              LEGAL & GOVERNANCE
            </span>
            <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-brand-emerald">
              {title}
            </h1>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
          {content}
        </div>

        <div className="pt-6 border-t border-stone-100 text-xs text-stone-400">
          Last revised: November 2026 • AB Noor Perfumes Legal & Concierge Department
        </div>
      </div>
    </div>
  );
};
