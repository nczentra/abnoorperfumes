import React, { useState, useEffect } from 'react';
import { bannerService } from '../../services/bannerService';
import { Image, Plus, Edit, Trash2, X, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    image: '',
    ctaText: 'Explore Collection',
    ctaLink: '/shop',
    badge: 'ROYAL ARABIAN LUXURY',
    active: true,
  });

  const loadBanners = async () => {
    setLoading(true);
    const data = await bannerService.getBanners(false);
    setBanners(data);
    setLoading(false);
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      image: '',
      ctaText: 'Explore Collection',
      ctaLink: '/shop',
      badge: 'ROYAL ARABIAN LUXURY',
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b) => {
    setEditingId(b.id);
    setFormData(b);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this banner?')) {
      await bannerService.deleteBanner(id);
      toast.info('Banner deleted.');
      loadBanners();
    }
  };

  const handleToggleActive = async (b) => {
    await bannerService.updateBanner(b.id, { active: !b.active });
    toast.success('Banner visibility updated.');
    loadBanners();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await bannerService.updateBanner(editingId, formData);
      toast.success('Banner updated.');
    } else {
      await bannerService.createBanner(formData);
      toast.success('Banner created.');
    }
    setIsModalOpen(false);
    loadBanners();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-2xl font-bold text-brand-emerald">
            Hero & Promotional Banners CMS
          </h1>
          <p className="text-xs text-stone-500">
            Control the editorial visual banners featured across the homepage.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-brand-emerald text-brand-soft-gold rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-brand-dark-forest transition flex items-center gap-2 shadow"
        >
          <Plus className="w-4 h-4 text-brand-gold" />
          <span>New Hero Banner</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((b) => (
          <div key={b.id} className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="aspect-[16/9] relative overflow-hidden bg-stone-100">
              <img src={b.image} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-brand-dark-forest/50" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold mb-1">{b.badge}</span>
                <h3 className="font-playfair text-xl font-bold text-white">{b.title}</h3>
                <p className="text-xs text-stone-200 line-clamp-2 mt-1">{b.description}</p>
              </div>
            </div>

            <div className="p-4 flex items-center justify-between text-xs border-t border-stone-100">
              <button
                onClick={() => handleToggleActive(b)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-[10px] uppercase ${
                  b.active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                }`}
              >
                {b.active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                <span>{b.active ? 'Active on Homepage' : 'Hidden'}</span>
              </button>

              <div className="flex gap-2">
                <button onClick={() => handleOpenEdit(b)} className="p-1.5 text-stone-500 hover:text-brand-emerald">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(b.id)} className="p-1.5 text-stone-400 hover:text-rose-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-dark-forest/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-brand-gold/40 space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-stone-200">
              <h3 className="font-playfair text-lg font-bold text-brand-emerald">
                {editingId ? 'Edit Hero Banner' : 'Create Hero Banner'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-stone-600 font-bold uppercase mb-1">Headline Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Discover the Art of Fragrance"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-bold uppercase mb-1">High-Res Background Image URL *</label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-bold uppercase mb-1">Subtext Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 font-bold uppercase mb-1">Button Text</label>
                  <input
                    type="text"
                    value={formData.ctaText}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-bold uppercase mb-1">Button Link</label>
                  <input
                    type="text"
                    value={formData.ctaLink}
                    onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
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
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
