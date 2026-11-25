import React, { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { brandService } from '../../services/brandService';
import { CONCENTRATIONS, FRAGRANCE_FAMILIES, GENDERS } from '../../constants/brand';
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  X, 
  Check, 
  Sparkles, 
  Boxes 
} from 'lucide-react';
import { toast } from 'sonner';

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const initialForm = {
    name: '',
    brandName: 'AB Noor Signature',
    brandId: 'ab-noor-private',
    categoryId: 'arabian',
    gender: 'men',
    shortDescription: '',
    description: '',
    mainImage: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=85',
    fragranceFamily: 'Oriental & Oud',
    concentration: 'Extrait de Parfum',
    topNotes: 'Taif Rose, Saffron',
    middleNotes: 'Cambodian Oud, Incense',
    baseNotes: 'Ambergris, Black Musk',
    longevity: '20+ Hours',
    sillage: 'Heavy & Majestic',
    published: true,
    bestseller: false,
    newArrival: true,
    variants: [
      { id: 'v1', size: '50ml', sku: 'ABN-50', purchasePrice: 2500, sellingPrice: 5500, discountPrice: 4899, stock: 20 },
      { id: 'v2', size: '100ml', sku: 'ABN-100', purchasePrice: 4500, sellingPrice: 9500, discountPrice: 8499, stock: 12 },
    ],
  };

  const [formData, setFormData] = useState(initialForm);

  const loadData = async () => {
    setLoading(true);
    const [prods, cats, bnds] = await Promise.all([
      productService.getProducts(),
      categoryService.getCategories(),
      brandService.getBrands(),
    ]);
    setProducts(prods);
    setCategories(cats);
    setBrands(bnds);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      ...product,
      topNotes: Array.isArray(product.topNotes) ? product.topNotes.join(', ') : product.topNotes,
      middleNotes: Array.isArray(product.middleNotes) ? product.middleNotes.join(', ') : product.middleNotes,
      baseNotes: Array.isArray(product.baseNotes) ? product.baseNotes.join(', ') : product.baseNotes,
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you wish to permanently delete this product?')) {
      await productService.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('Product deleted.');
    }
  };

  const handleTogglePublish = async (product) => {
    const updated = await productService.updateProduct(product.id, {
      published: !product.published,
    });
    setProducts(prev => prev.map(p => p.id === product.id ? updated : p));
    toast.success(`Product ${updated.published ? 'Published' : 'Archived to Drafts'}.`);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      topNotes: typeof formData.topNotes === 'string' ? formData.topNotes.split(',').map(s => s.trim()) : formData.topNotes,
      middleNotes: typeof formData.middleNotes === 'string' ? formData.middleNotes.split(',').map(s => s.trim()) : formData.middleNotes,
      baseNotes: typeof formData.baseNotes === 'string' ? formData.baseNotes.split(',').map(s => s.trim()) : formData.baseNotes,
      categoryName: categories.find(c => c.id === formData.categoryId)?.name || 'Arabian Fragrance',
    };

    if (editingId) {
      await productService.updateProduct(editingId, payload);
      toast.success('Product updated successfully.');
    } else {
      await productService.createProduct(payload);
      toast.success('New product formulation published.');
    }

    setIsFormOpen(false);
    loadData();
  };

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brandName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.categoryId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-2xl font-bold text-brand-emerald">
            Product Catalogue Management
          </h1>
          <p className="text-xs text-stone-500">
            Create and edit luxury extraits, pure attars, variants, and notes.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-md shadow-red-600/30"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>New Product</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-stone-400" />
        <input
          type="text"
          placeholder="Filter products by name, house, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-xs bg-transparent focus:outline-none"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-stone-200">
            <thead className="bg-stone-50 text-[11px] font-bold uppercase tracking-wider text-stone-500">
              <tr>
                <th className="py-3.5 px-4">Flacon</th>
                <th className="py-3.5 px-4">Fragrance Details</th>
                <th className="py-3.5 px-4">House & Category</th>
                <th className="py-3.5 px-4">Starting Price</th>
                <th className="py-3.5 px-4">Total Stock</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.map((p) => {
                const minPrice = Math.min(...(p.variants?.map(v => v.discountPrice || v.sellingPrice) || [0]));
                const totalStock = p.variants?.reduce((s, v) => s + (v.stock || 0), 0) || 0;
                return (
                  <tr key={p.id} className="hover:bg-stone-50/60 transition">
                    <td className="py-3 px-4">
                      <img src={p.mainImage} alt="" className="w-12 h-12 object-cover rounded-xl border border-stone-200" />
                    </td>
                    <td className="py-3 px-4">
                      <strong className="text-brand-emerald text-sm block font-semibold">{p.name}</strong>
                      <span className="text-stone-400 text-[11px]">{p.concentration} • {p.variants?.length || 0} Sizes</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-stone-800 font-semibold block">{p.brandName}</span>
                      <span className="text-brand-gold text-[11px] capitalize">{p.categoryId}</span>
                    </td>
                    <td className="py-3 px-4 font-bold text-stone-800">
                      ₹{minPrice.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        totalStock <= 5 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {totalStock} in stock
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleTogglePublish(p)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          p.published ? 'bg-emerald-50 text-emerald-800' : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {p.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{p.published ? 'Published' : 'Draft'}</span>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 text-stone-500 hover:text-brand-emerald rounded-lg hover:bg-stone-100 transition"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-dark-forest/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl border border-brand-gold/40 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-stone-200">
              <h3 className="font-playfair text-xl font-bold text-brand-emerald">
                {editingId ? 'Edit Fragrance Formulation' : 'Create New Luxury Fragrance'}
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-600 font-bold uppercase mb-1">Fragrance Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sultanate Dehn Al Oud Royale"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-emerald"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 font-bold uppercase mb-1">Perfume House (Brand)</label>
                  <select
                    value={formData.brandId}
                    onChange={(e) => {
                      const b = brands.find(brand => brand.id === e.target.value);
                      setFormData({ ...formData, brandId: e.target.value, brandName: b?.name || 'AB Noor Signature' });
                    }}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-emerald"
                  >
                    {brands.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-stone-600 font-bold uppercase mb-1">Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-emerald"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-600 font-bold uppercase mb-1">Concentration</label>
                  <select
                    value={formData.concentration}
                    onChange={(e) => setFormData({ ...formData, concentration: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-emerald"
                  >
                    {CONCENTRATIONS.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-600 font-bold uppercase mb-1">Gender Character</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-emerald"
                  >
                    {GENDERS.map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-600 font-bold uppercase mb-1">High-Res Main Flacon Image URL *</label>
                <input
                  type="url"
                  required
                  value={formData.mainImage}
                  onChange={(e) => setFormData({ ...formData, mainImage: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-emerald"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-bold uppercase mb-1">Fragrance Description *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Elaborate on botanical origin, distillation story, and aura..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-emerald"
                />
              </div>

              {/* Notes Pyramid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <div>
                  <label className="block text-stone-600 font-bold uppercase mb-1">Top Notes (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.topNotes}
                    onChange={(e) => setFormData({ ...formData, topNotes: e.target.value })}
                    placeholder="Bergamot, Saffron"
                    className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 font-bold uppercase mb-1">Middle / Heart Notes</label>
                  <input
                    type="text"
                    value={formData.middleNotes}
                    onChange={(e) => setFormData({ ...formData, middleNotes: e.target.value })}
                    placeholder="Cambodian Oud, Rose"
                    className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 font-bold uppercase mb-1">Base Notes</label>
                  <input
                    type="text"
                    value={formData.baseNotes}
                    onChange={(e) => setFormData({ ...formData, baseNotes: e.target.value })}
                    placeholder="Ambergris, Musk"
                    className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 border border-stone-300 rounded-xl text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand-emerald text-brand-soft-gold rounded-xl font-bold uppercase tracking-wider hover:bg-brand-dark-forest transition"
                >
                  {editingId ? 'Save Updates' : 'Publish Fragrance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
