import React, { useState } from 'react';
import { BRAND } from '../../constants/brand';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Bespoke Olfactory Inquiry',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please complete all required fields.');
      return;
    }
    setSubmitted(true);
    toast.success('Your message has been delivered to the master perfumer concierge.', {
      description: 'A dedicated stylist will reply within 24 hours.',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-gold">
          PRIVATE CLIENT SERVICES
        </span>
        <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-brand-emerald">
          Concierge & Private Inquiries
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 font-light leading-relaxed">
          Whether you seek private flacon consultations, wedding gift coffrets, or bespoke extrait formulation, our stylists are at your service.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Left: Contact Info & Boutiques */}
        <div className="space-y-6">
          <div className="bg-brand-dark-forest text-white rounded-3xl p-8 border border-brand-gold/30 shadow-xl space-y-6">
            <h3 className="font-playfair text-2xl font-bold text-brand-soft-gold">
              Royal Flagship Boutiques
            </h3>
            
            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold text-sm">Mumbai Boutique & Salon</strong>
                  <span className="text-stone-300">
                    {BRAND.address.line1}, {BRAND.address.line2}<br />
                    {BRAND.address.city}, {BRAND.address.state} - {BRAND.address.pincode}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold text-sm">Direct VIP Concierge</strong>
                  <span className="text-stone-300">{BRAND.phone} / WhatsApp Available</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold text-sm">Email Correspondence</strong>
                  <span className="text-stone-300">{BRAND.email}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold text-sm">Salon Visiting Hours</strong>
                  <span className="text-stone-300">Monday - Saturday: 10:30 AM to 8:30 PM IST</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Message Form */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-8 shadow-sm space-y-6">
          <h3 className="font-playfair text-xl font-bold text-brand-emerald">
            Send a Private Message
          </h3>

          {submitted ? (
            <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-brand-emerald mx-auto" />
              <h4 className="font-playfair text-lg font-bold text-brand-emerald">Message Received</h4>
              <p className="text-xs text-stone-600">
                Thank you for contacting AB Noor Perfumes. Your inquiry has been routed to our principal fragrance stylist.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-600 font-bold uppercase tracking-wider mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Tariq Al-Mansoor"
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-emerald"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-600 font-bold uppercase tracking-wider mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="patron@example.com"
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-emerald"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 font-bold uppercase tracking-wider mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-emerald"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 font-bold uppercase tracking-wider mb-1">Inquiry Nature</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-emerald"
                >
                  <option value="Bespoke Olfactory Inquiry">Bespoke Olfactory Inquiry</option>
                  <option value="Order & Shipment Assistance">Order & Shipment Assistance</option>
                  <option value="Wedding & Corporate VIP Gifting">Wedding & Corporate VIP Gifting</option>
                  <option value="Wholesale & Boutique Partnerships">Wholesale & Boutique Partnerships</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-600 font-bold uppercase tracking-wider mb-1">Your Message *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Detail your request, preferred fragrance notes, or questions..."
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-emerald"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-brand-emerald hover:bg-brand-dark-forest text-brand-soft-gold rounded-xl font-bold text-xs uppercase tracking-widest transition shadow-lg flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-brand-gold" />
                <span>Submit to VIP Concierge</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};
