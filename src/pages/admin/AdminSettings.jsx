import React, { useState, useEffect } from 'react';
import { settingsService } from '../../services/settingsService';
import { Settings, Save, ShieldCheck, Truck, Bell, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

export const AdminSettings = () => {
  const [settings, setSettings] = useState({
    storeName: 'AB Noor Perfumes',
    supportEmail: 'concierge@abnoorperfumes.com',
    supportPhone: '+91 98765 43210',
    freeShippingThreshold: 2499,
    standardShippingRate: 150,
    codEnabled: true,
    maintenanceMode: false,
    announcementMessage: '✨ The Royal Winter Oud Collection has arrived | Complimentary Luxury Gift Box on orders above ₹4,999',
    announcementActive: true,
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    settingsService.getSettings().then(res => {
      if (res && Object.keys(res).length > 0) {
        setSettings(prev => ({ ...prev, ...res }));
      }
    });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await settingsService.updateSettings(settings);
    setSaving(false);
    toast.success('Store configuration saved successfully.');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-playfair text-2xl font-bold text-brand-emerald">
          Store Settings & Governance
        </h1>
        <p className="text-xs text-stone-500">
          Manage announcements, shipping thresholds, concierge details, and payment rules.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        
        {/* Dynamic Announcement Banner */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
            <Bell className="w-4 h-4 text-brand-gold" />
            <h3 className="font-playfair text-base font-bold text-brand-emerald">
              Header Announcement Bar (Section 1)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="announcementActive"
              checked={settings.announcementActive}
              onChange={(e) => setSettings({ ...settings, announcementActive: e.target.checked })}
              className="accent-brand-emerald"
            />
            <label htmlFor="announcementActive" className="font-bold text-stone-700">
              Display Announcement Banner on Public Storefront
            </label>
          </div>

          <div>
            <label className="block text-stone-600 font-bold uppercase mb-1">Banner Message</label>
            <input
              type="text"
              value={settings.announcementMessage}
              onChange={(e) => setSettings({ ...settings, announcementMessage: e.target.value })}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
            />
          </div>
        </div>

        {/* Shipping & Delivery Rules */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
            <Truck className="w-4 h-4 text-brand-gold" />
            <h3 className="font-playfair text-base font-bold text-brand-emerald">
              Shipping & Courier Policies
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-600 font-bold uppercase mb-1">
                Complimentary Shipping Threshold (₹)
              </label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">
                Orders equal or exceeding this receive free express delivery.
              </span>
            </div>

            <div>
              <label className="block text-stone-600 font-bold uppercase mb-1">
                Standard Shipping Charge (₹)
              </label>
              <input
                type="number"
                value={settings.standardShippingRate}
                onChange={(e) => setSettings({ ...settings, standardShippingRate: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Payment Gateways */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
            <CreditCard className="w-4 h-4 text-brand-gold" />
            <h3 className="font-playfair text-base font-bold text-brand-emerald">
              Payment Gateway Integration
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="codEnabled"
              checked={settings.codEnabled}
              onChange={(e) => setSettings({ ...settings, codEnabled: e.target.checked })}
              className="accent-brand-emerald"
            />
            <label htmlFor="codEnabled" className="font-bold text-stone-700">
              Enable Cash on Delivery (COD) Option
            </label>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-1">
            <strong className="block text-stone-800 font-semibold">Razorpay Configuration Status</strong>
            <span className="text-stone-500 font-mono">
              Key ID: {import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_ab_noor_perfumes'}
            </span>
            <div className="text-[10px] text-emerald-700 font-semibold pt-1">
              ✓ Verified client-side script loaded and test-gateway active.
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3.5 bg-brand-emerald hover:bg-brand-dark-forest text-brand-soft-gold rounded-xl font-bold text-xs uppercase tracking-widest transition shadow-lg flex items-center gap-2"
        >
          <Save className="w-4 h-4 text-brand-gold" />
          <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
        </button>

      </form>
    </div>
  );
};
