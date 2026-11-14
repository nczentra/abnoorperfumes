import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MapPin, Plus, Trash2, CheckCircle2, Home, Briefcase, X } from 'lucide-react';
import { toast } from 'sonner';

export const CustomerAddresses = () => {
  const { userProfile, updateProfile } = useAuth();
  const [addresses, setAddresses] = useState(userProfile?.addresses || [
    {
      id: 'addr-default',
      fullName: userProfile?.fullName || 'Faisal Al-Noor',
      phone: userProfile?.phone || '+91 98765 43210',
      houseNumber: 'Villa 14, Royal Crest',
      street: 'Altamount Road',
      locality: 'Cumballa Hill',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400026',
      addressType: 'Home',
      isDefault: true,
    }
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    houseNumber: '',
    street: '',
    locality: '',
    city: '',
    state: '',
    pincode: '',
    addressType: 'Home',
  });

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    const newAddress = {
      ...formData,
      id: `addr-${Date.now()}`,
      isDefault: addresses.length === 0,
    };

    const updated = [...addresses, newAddress];
    setAddresses(updated);
    await updateProfile({ addresses: updated });
    setIsAdding(false);
    setFormData({
      fullName: '',
      phone: '',
      houseNumber: '',
      street: '',
      locality: '',
      city: '',
      state: '',
      pincode: '',
      addressType: 'Home',
    });
    toast.success('Address saved successfully.');
  };

  const handleDeleteAddress = async (id) => {
    const updated = addresses.filter(a => a.id !== id);
    setAddresses(updated);
    await updateProfile({ addresses: updated });
    toast.info('Address removed.');
  };

  const handleSetDefault = async (id) => {
    const updated = addresses.map(a => ({
      ...a,
      isDefault: a.id === id,
    }));
    setAddresses(updated);
    await updateProfile({ addresses: updated });
    toast.success('Default address updated.');
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-stone-100">
        <div>
          <h2 className="font-playfair text-xl font-bold text-brand-emerald">
            Saved Shipping Destinations
          </h2>
          <p className="text-xs text-stone-400 font-light">
            Manage your residences and offices for swift, white-glove courier delivery.
          </p>
        </div>

        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-brand-emerald text-brand-soft-gold text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-brand-dark-forest transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-brand-gold" />
            <span>Add Address</span>
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSaveAddress} className="p-6 bg-stone-50 rounded-2xl border border-stone-200 space-y-4 text-xs animate-in fade-in duration-200">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-playfair font-bold text-sm text-brand-emerald">Add New Delivery Residence</h4>
            <button onClick={() => setIsAdding(false)} className="text-stone-400 hover:text-stone-700">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-600 font-bold uppercase tracking-wider mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. Faisal Al-Noor"
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-brand-emerald"
              />
            </div>
            <div>
              <label className="block text-stone-600 font-bold uppercase tracking-wider mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-brand-emerald"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-600 font-bold uppercase tracking-wider mb-1">House / Flat No. *</label>
              <input
                type="text"
                required
                value={formData.houseNumber}
                onChange={(e) => setFormData({ ...formData, houseNumber: e.target.value })}
                placeholder="Penthouse 12B"
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-brand-emerald"
              />
            </div>
            <div>
              <label className="block text-stone-600 font-bold uppercase tracking-wider mb-1">Street / Road *</label>
              <input
                type="text"
                required
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                placeholder="Altamount Road"
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-brand-emerald"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-stone-600 font-bold uppercase tracking-wider mb-1">PIN Code *</label>
              <input
                type="text"
                maxLength={6}
                required
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                placeholder="400026"
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-brand-emerald"
              />
            </div>
            <div>
              <label className="block text-stone-600 font-bold uppercase tracking-wider mb-1">City *</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Mumbai"
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-brand-emerald"
              />
            </div>
            <div>
              <label className="block text-stone-600 font-bold uppercase tracking-wider mb-1">State *</label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="Maharashtra"
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-brand-emerald"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 border border-stone-300 rounded-lg text-stone-600 hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-brand-emerald text-brand-soft-gold rounded-lg font-bold uppercase tracking-wider hover:bg-brand-dark-forest"
            >
              Save Address
            </button>
          </div>
        </form>
      )}

      {/* Address Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`p-5 rounded-2xl border text-xs space-y-2 relative transition ${
              addr.isDefault
                ? 'border-brand-gold bg-brand-gold/5 shadow-sm'
                : 'border-stone-200 bg-white hover:border-stone-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-brand-emerald flex items-center gap-1.5">
                {addr.addressType === 'Home' ? <Home className="w-3.5 h-3.5 text-brand-gold" /> : <Briefcase className="w-3.5 h-3.5 text-brand-gold" />}
                {addr.fullName}
              </span>

              {addr.isDefault ? (
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-brand-emerald text-brand-soft-gold rounded-full">
                  Default
                </span>
              ) : (
                <button
                  onClick={() => handleSetDefault(addr.id)}
                  className="text-[11px] text-brand-emerald hover:underline font-semibold"
                >
                  Set as Default
                </button>
              )}
            </div>

            <p className="text-stone-600 leading-relaxed font-light">
              {addr.houseNumber}, {addr.street}<br />
              {addr.city}, {addr.state} - {addr.pincode}<br />
              Mobile: {addr.phone}
            </p>

            <div className="pt-2 border-t border-stone-100 flex justify-end">
              <button
                onClick={() => handleDeleteAddress(addr.id)}
                className="text-stone-400 hover:text-rose-600 p-1 flex items-center gap-1 text-[11px]"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
