import React, { useState, useEffect } from 'react';
import { categoryService } from '../../services/categoryService';
import { Plus, Edit, Trash2, X, Tags } from 'lucide-react';
import { toast } from 'sonner';

export const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
  });

  const loadCategories = async () => {
    setLoading(true);
    const data = await categoryService.getCategories();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ name: '', slug: '', description: '', image: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingId(cat.id);
    setFormData(cat);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you wish to delete this category?')) {
      await categoryService.deleteCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
      toast.success('Category deleted.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await categoryService.updateCategory(editingId, formData);
      toast.success('Category updated.');
    } else {
      await categoryService.createCategory(formData);
      toast.success('Category created.');
    }
    setIsModalOpen(false);
    loadCategories();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-2xl font-bold text-brand-emerald">
            Category & Collection Management
          </h1>
          <p className="text-xs text-stone-500">
            Organize perfumes into heritage realms, attars, and luxury collections.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-brand-emerald text-brand-soft-gold rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-brand-dark-forest transition flex items-center gap-2 shadow"
        >
          <Plus className="w-4 h-4 text-brand-gold" />
          <span>New Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm flex flex-col justify-between">
            <div>
              <div className="aspect-[16/10] overflow-hidden bg-stone-100 relative">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4 space-y-1">
                <h3 className="font-playfair font-bold text-base text-brand-emerald">{cat.name}</h3>
                <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">{cat.description}</p>
                <div className="text-[10px] text-brand-gold font-mono pt-1">slug: /category/{cat.slug}</div>
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-stone-100 flex justify-end gap-2 mt-auto">
              <button
                onClick={() => handleOpenEdit(cat)}
                className="p-1.5 text-stone-500 hover:text-brand-emerald rounded-lg hover:bg-stone-100 transition"
                title="Edit"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(cat.id)}
                className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
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
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl border border-brand-gold/40 space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-stone-200">
              <h3 className="font-playfair text-lg font-bold text-brand-emerald">
                {editingId ? 'Edit Category' : 'Create Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-stone-600 font-bold uppercase mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Royal Attars"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-bold uppercase mb-1">URL Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. royal-attars"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-bold uppercase mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-bold uppercase mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this collection..."
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
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
