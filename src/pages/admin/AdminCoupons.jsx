import React, { useState, useEffect } from 'react';
import { couponService } from '../../services/couponService';
import { TicketPercent, Plus, Trash2, CheckCircle2, X } from 'lucide-react';
import { toast } from 'sonner';

export const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    type: 'percentage',
    value: 10,
    minOrder: 1999,
    maxDiscount: 1000,
    expiresAt: '2027-12-31',
    active: true,
  });

  const loadCoupons = async () => {
    setLoading(true);
    const data = await couponService.getCoupons();
    setCoupons(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleToggleActive = async (coupon) => {
    await couponService.updateCoupon(coupon.id, { active: !coupon.active });
    toast.success(`Coupon ${coupon.code} updated.`);
    loadCoupons();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this coupon?')) {
      await couponService.deleteCoupon(id);
      toast.info('Coupon deleted.');
      loadCoupons();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await couponService.createCoupon(formData);
    toast.success(`Coupon ${formData.code} created.`);
    setIsModalOpen(false);
    setFormData({
      code: '',
      description: '',
      type: 'percentage',
      value: 10,
      minOrder: 1999,
      maxDiscount: 1000,
      expiresAt: '2027-12-31',
      active: true,
    });
    loadCoupons();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-2xl font-bold text-brand-emerald">
            Coupons & Promotional Codes
          </h1>
          <p className="text-xs text-stone-500">
            Configure discounts, minimum cart values, and expiration dates.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-brand-emerald text-brand-soft-gold rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-brand-dark-forest transition flex items-center gap-2 shadow"
        >
          <Plus className="w-4 h-4 text-brand-gold" />
          <span>New Coupon</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {coupons.map((c) => (
          <div key={c.id} className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-sm space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-base text-brand-emerald px-2.5 py-1 bg-emerald-50 rounded-lg border border-emerald-200">
                  {c.code}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  c.active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-500'
                }`}>
                  {c.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-xs text-stone-600 font-medium">{c.description}</p>
              <div className="text-xs text-stone-500 space-y-0.5 pt-1">
                <div>Type: <strong className="text-stone-800 capitalize">{c.type} ({c.type === 'percentage' ? `${c.value}%` : `₹${c.value}`})</strong></div>
                <div>Min Cart Value: <strong>₹{c.minOrder?.toLocaleString('en-IN')}</strong></div>
                {c.maxDiscount && <div>Max Cap: <strong>₹{c.maxDiscount?.toLocaleString('en-IN')}</strong></div>}
                <div>Expires: <strong>{c.expiresAt}</strong></div>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <button
                onClick={() => handleToggleActive(c)}
                className="text-brand-emerald hover:underline font-semibold"
              >
                {c.active ? 'Deactivate' : 'Activate'}
              </button>
              <button
                onClick={() => handleDelete(c.id)}
                className="text-stone-400 hover:text-rose-600 p-1"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-dark-forest/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-brand-gold/40 space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-stone-200">
              <h3 className="font-playfair text-lg font-bold text-brand-emerald">Create Promotional Coupon</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-stone-600 font-bold uppercase mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. ROYAL20"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-bold uppercase mb-1">Description *</label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. 20% off on private reserve extraits"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 font-bold uppercase mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-600 font-bold uppercase mb-1">Discount Value *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 font-bold uppercase mb-1">Min Cart Value (₹)</label>
                  <input
                    type="number"
                    value={formData.minOrder}
                    onChange={(e) => setFormData({ ...formData, minOrder: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-bold uppercase mb-1">Max Cap (₹)</label>
                  <input
                    type="number"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-brand-emerald text-brand-soft-gold rounded-xl font-bold uppercase"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
