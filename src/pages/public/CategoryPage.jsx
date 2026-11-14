import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { categoryService } from '../../services/categoryService';
import { productService } from '../../services/productService';
import { ProductCard } from '../../components/product/ProductCard';
import { QuickViewModal } from '../../components/product/QuickViewModal';
import { ArrowLeft, Sparkles } from 'lucide-react';

export const CategoryPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const loadCategoryData = async () => {
      setLoading(true);
      try {
        const cat = await categoryService.getCategoryBySlug(slug);
        setCategory(cat);

        const prods = await productService.getProducts({
          category: slug,
          sortBy,
        });
        setProducts(prods);
      } catch (err) {
        console.warn('Error loading category:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCategoryData();
  }, [slug, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Category Hero Header */}
      <div className="relative rounded-3xl overflow-hidden bg-brand-dark-forest text-white border border-brand-gold/30 shadow-2xl min-h-[280px] flex items-center">
        {category?.image && (
          <div className="absolute inset-0">
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover object-center scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-dark-forest/95 via-brand-dark-forest/80 to-transparent" />
          </div>
        )}

        <div className="relative z-10 p-8 sm:p-12 max-w-2xl space-y-3">
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs text-brand-soft-gold hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Collections</span>
          </Link>

          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-gold block">
            ROYAL CURATION
          </span>

          <h1 className="font-playfair text-3xl sm:text-5xl font-bold leading-tight">
            {category?.name || 'Exclusive Fragrance Collection'}
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
            {category?.description || 'Immerse yourself in hand-selected Arabian olfactory creations.'}
          </p>
        </div>
      </div>

      {/* Control Row */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div className="text-xs text-stone-600 font-medium">
          Showing <strong className="text-brand-emerald">{products.length}</strong> fragrances in {category?.name || 'Collection'}
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-stone-500">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-semibold text-brand-emerald bg-white border border-stone-200 rounded-lg px-3 py-1.5 focus:outline-none"
          >
            <option value="newest">Newest</option>
            <option value="popularity">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="w-10 h-10 border-2 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-stone-500">Loading collection...</p>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white rounded-2xl border border-stone-200 p-8 space-y-3">
          <h3 className="font-playfair text-xl font-bold text-brand-emerald">
            No fragrances currently in this category
          </h3>
          <p className="text-xs text-stone-500">
            Check back soon as new seasonal harvests are distilled.
          </p>
          <Link
            to="/shop"
            className="inline-block px-6 py-2.5 bg-brand-emerald text-brand-soft-gold text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-brand-dark-forest transition"
          >
            Explore Other Collections
          </Link>
        </div>
      )}

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

    </div>
  );
};
