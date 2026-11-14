import React, { useState, useEffect } from 'react';
import { brandService } from '../../services/brandService';
import { Plus, Edit, Trash2, X, Crown, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export const AdminBrands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    origin: '',
    description: '',
  });

  const loadBrands = async () => {
    setLoading(true);
    const data = await brandService.getBrands();
    setBrands(data);
    setLoading(false);
  };

  useEffect(() => {
    loadBrands();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ name: '', slug: '', origin: '', description: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (brand) => {
    setEditingId(brand.id);
    setFormData(brand);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you wish to delete this brand house?')) {
      await brandService.deleteBrand(id);
      setBrands(prev => prev.filter(b => b.id !== id));
      toast.success('Brand deleted.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await brandService.updateBrand(editingId, formData);
      toast.success('Brand updated.');
    } else {
      await brandService.createBrand(formData);
      toast.success('Brand created.');
    }
    setIsModalOpen(false);
    loadBrands();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-2xl font-bold text-brand-emerald">
            Perfume Houses & Brand Partners
          </h1>
          <p className="text-xs text-stone-500">
            Manage traditional distilleries, royal houses, and brand origins.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-brand-emerald text-brand-soft-gold rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-brand-dark-forest transition flex items-center gap-2 shadow"
        >
          <Plus className="w-4 h-4 text-brand-gold" />
          <span>New Brand</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {brands.map((brand) => (
          <div key={brand.id} className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-sm flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-brand-gold">
                <Crown className="w-5 h-5" />
                <span className="text-[10px] uppercase font-bold tracking-wider">Perfume House</span>
              </div>
              <h3 className="font-playfair font-bold text-lg text-brand-emerald">{brand.name}</h3>
              <div className="flex items-center gap-1.5 text-xs text-stone-500">
                <MapPin className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                <span>Origin: {brand.origin || 'Dubai & Mumbai'}</span>
              </div>
              <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed font-light">{brand.description}</p>
            </div>

            <div className="pt-4 border-t border-stone-100 flex justify-end gap-2 mt-4">
              <button
                onClick={() => handleOpenEdit(brand)}
                className="p-1.5 text-stone-500 hover:text-brand-emerald rounded-lg hover:bg-stone-100 transition"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(brand.id)}
                className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-dark-forest/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl border border-brand-gold/40 space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-stone-200">
              <h3 className="font-playfair text-lg font-bold text-brand-emerald">
                {editingId ? 'Edit Brand House' : 'Create Brand House'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-stone-600 font-bold uppercase mb-1">Brand Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Royal Oud Arabia"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-bold uppercase mb-1">Country / City of Origin</label>
                <input
                  type="text"
                  value={formData.origin}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  placeholder="e.g. Riyadh, Saudi Arabia"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-bold uppercase mb-1">Brand Story & Philosophy</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Heritage notes..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
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
                  Save Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
