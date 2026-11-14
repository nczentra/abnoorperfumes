import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { brandService } from '../../services/brandService';
import { ProductCard } from '../../components/product/ProductCard';
import { ProductFilters } from '../../components/product/ProductFilters';
import { QuickViewModal } from '../../components/product/QuickViewModal';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Sparkles } from 'lucide-react';

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Read initial query params
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'all',
    brand: searchParams.get('brand') || 'all',
    gender: searchParams.get('gender') || 'all',
    fragranceFamily: searchParams.get('fragranceFamily') || 'all',
    concentration: searchParams.get('concentration') || 'all',
    search: searchParams.get('search') || '',
    maxPrice: 25000,
    sortBy: searchParams.get('sort') || 'newest',
  });

  // Sync state with URL params
  useEffect(() => {
    const cat = searchParams.get('category');
    const q = searchParams.get('search');
    if (cat || q) {
      setFilters(prev => ({
        ...prev,
        category: cat || prev.category,
        search: q || prev.search,
      }));
    }
  }, [searchParams]);

  // Load Categories & Brands
  useEffect(() => {
    Promise.all([categoryService.getCategories(), brandService.getBrands()]).then(
      ([cats, bnds]) => {
        setCategories(cats);
        setBrands(bnds);
      }
    );
  }, []);

  // Fetch filtered products
  useEffect(() => {
    const fetchFiltered = async () => {
      setLoading(true);
      const res = await productService.getProducts(filters);
      setProducts(res);
      setLoading(false);
    };

    fetchFiltered();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      category: 'all',
      brand: 'all',
      gender: 'all',
      fragranceFamily: 'all',
      concentration: 'all',
      search: '',
      maxPrice: 25000,
      sortBy: 'newest',
    });
    setSearchParams({});
  };

  // Remove individual filter chip
  const removeChip = (key) => {
    handleFilterChange(key, key === 'maxPrice' ? 25000 : key === 'search' ? '' : 'all');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-brand-dark-forest rounded-3xl p-8 sm:p-12 text-white border border-brand-gold/30 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-gold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Full Olfactory Catalogue
          </span>
          <h1 className="font-playfair text-3xl sm:text-4xl font-bold leading-tight">
            The Complete AB Noor Fragrance Collection
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
            Immerse yourself in centuries of royal perfumery artistry. Discover pure concentrated attars, aged Cambodian ouds, and signature extraits hand-poured in crystal flacons.
          </p>
        </div>
      </div>

      {/* Control Bar: Search, Sorting, and Mobile Filter Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200/80 shadow-sm">
        
        {/* Mobile Filter Button */}
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-emerald text-brand-soft-gold rounded-xl text-xs font-bold uppercase tracking-wider"
        >
          <Filter className="w-4 h-4 text-brand-gold" />
          <span>Filters & Notes</span>
        </button>

        {/* Results Counter */}
        <div className="text-xs text-stone-600 font-medium">
          Showing <strong className="text-brand-emerald font-bold">{products.length}</strong> luxurious formulations
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-stone-500 whitespace-nowrap hidden sm:inline">
            Sort by:
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="text-xs font-semibold text-brand-emerald bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-emerald"
          >
            <option value="newest">Newest Additions</option>
            <option value="popularity">Most Revered (Popularity)</option>
            <option value="rating">Highest Rated</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Active Filter Chips */}
      {(filters.category !== 'all' || filters.gender !== 'all' || filters.fragranceFamily !== 'all' || filters.concentration !== 'all' || filters.search) && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-stone-400 font-medium">Active Filters:</span>
          {filters.category !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-stone-100 border border-stone-200 rounded-full text-xs text-stone-700">
              Category: {filters.category}
              <button onClick={() => removeChip('category')} className="hover:text-rose-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.gender !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-stone-100 border border-stone-200 rounded-full text-xs text-stone-700">
              Gender: {filters.gender}
              <button onClick={() => removeChip('gender')} className="hover:text-rose-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.fragranceFamily !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-stone-100 border border-stone-200 rounded-full text-xs text-stone-700">
              Family: {filters.fragranceFamily}
              <button onClick={() => removeChip('fragranceFamily')} className="hover:text-rose-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.search && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-stone-100 border border-stone-200 rounded-full text-xs text-stone-700">
              Keyword: "{filters.search}"
              <button onClick={() => removeChip('search')} className="hover:text-rose-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={handleResetFilters}
            className="text-xs text-brand-emerald hover:underline font-semibold ml-2"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main Grid & Filter Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1 sticky top-24">
          <ProductFilters
            filters={filters}
            categories={categories}
            brands={brands}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="py-24 text-center space-y-3">
              <div className="w-12 h-12 border-2 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-stone-500 font-medium tracking-wide">
                Retrieving fragrances from the royal vault...
              </p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-white rounded-2xl border border-stone-200 p-8 space-y-4">
              <h3 className="font-playfair text-xl font-bold text-brand-emerald">
                No matching fragrances found
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                No perfumes match the selected criteria. Try relaxing your filters or resetting to view the full catalogue.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-brand-emerald text-brand-soft-gold text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-brand-dark-forest transition"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Mobile Filters Drawer Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div 
            className="absolute inset-0 bg-brand-dark-forest/70 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-sm bg-white shadow-2xl p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-6 pb-3 border-b border-stone-200">
                <h3 className="font-playfair text-lg font-bold text-brand-emerald">
                  Filter Fragrances
                </h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <ProductFilters
                filters={filters}
                categories={categories}
                brands={brands}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
              />

              <div className="mt-6 pt-4 border-t border-stone-200">
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full py-3 bg-brand-emerald text-brand-soft-gold rounded-xl font-bold text-xs uppercase tracking-wider"
                >
                  Apply Filters ({products.length} Scents)
                </button>
              </div>
            </div>
          </div>
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
