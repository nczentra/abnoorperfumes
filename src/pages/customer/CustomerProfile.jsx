import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export const CustomerProfile = () => {
  const { currentUser, userProfile, updateProfile } = useAuth();

  const [fullName, setFullName] = useState(userProfile?.fullName || currentUser?.displayName || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ fullName, phone });
      toast.success('Patron profile updated successfully.');
    } catch (e) {
      toast.error('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-sm space-y-6 max-w-2xl">
      <div className="pb-4 border-b border-stone-100">
        <h2 className="font-playfair text-xl font-bold text-brand-emerald">
          Patron Profile Information
        </h2>
        <p className="text-xs text-stone-400 font-light">
          Manage your personal identity credentials and contact information.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-4 text-xs">
        <div>
          <label className="block text-stone-600 font-bold uppercase tracking-wider mb-1">
            Registered Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="email"
              disabled
              value={userProfile?.email || currentUser?.email || ''}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-100 border border-stone-200 rounded-xl text-stone-500 cursor-not-allowed"
            />
          </div>
          <span className="text-[10px] text-stone-400 mt-1 block">
            Email addresses are securely managed through Firebase Authentication.
          </span>
        </div>

        <div>
          <label className="block text-stone-600 font-bold uppercase tracking-wider mb-1">
            Full Name *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-emerald"
            />
          </div>
        </div>

        <div>
          <label className="block text-stone-600 font-bold uppercase tracking-wider mb-1">
            Phone Number (for Courier & Concierge)
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-emerald"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 bg-brand-emerald hover:bg-brand-dark-forest text-brand-soft-gold rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-md shadow-brand-emerald/20"
        >
          {saving ? 'Saving...' : 'Save Profile Changes'}
        </button>
      </form>
    </div>
  );
};
