import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { productService } from '../../services/productService';

export const SearchModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Live search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const res = await productService.getProducts({ search: searchTerm });
      setResults(res.slice(0, 6));
      setLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSelect = (slug) => {
    onClose();
    navigate(`/product/${slug}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onClose();
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-brand-dark-forest/80 backdrop-blur-sm transition-opacity">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-brand-gold/30 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="relative border-b border-stone-200 flex items-center px-6 py-4">
          <Search className="w-5 h-5 text-brand-gold mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search perfumes, oud, notes (amber, rose, saffron)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-base font-medium text-brand-charcoal bg-transparent placeholder-stone-400 focus:outline-none"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="text-stone-400 hover:text-stone-600 p-1 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold px-2.5 py-1 bg-stone-100 text-stone-600 rounded hover:bg-stone-200 transition"
          >
            ESC
          </button>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="px-6 py-3 bg-stone-50 border-b border-stone-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-stone-400 flex items-center gap-1 font-medium">
            <Sparkles className="w-3 h-3 text-brand-gold" /> Popular:
          </span>
          {['Dehn Al Oud', 'Ward Taifi Rose', 'Amber', 'Musk Attar', 'Bakhoor Gift Chest', 'Sahara Cuir'].map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchTerm(tag)}
              className="px-2.5 py-1 bg-white border border-stone-200 rounded-full text-stone-700 hover:border-brand-gold hover:text-brand-emerald transition"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {loading ? (
            <div className="py-12 text-center text-sm text-stone-500">
              Consulting royal perfumery archives...
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              {results.map((product) => {
                const minPrice = Math.min(...(product.variants?.map(v => v.discountPrice || v.sellingPrice) || [0]));
                return (
                  <div
                    key={product.id}
                    onClick={() => handleSelect(product.slug)}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-stone-50 transition cursor-pointer border border-transparent hover:border-stone-200 group"
                  >
                    <img
                      src={product.mainImage}
                      alt={product.name}
                      className="w-14 h-14 object-cover rounded-lg border border-stone-200 group-hover:border-brand-gold transition"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-brand-gold">
                        {product.brandName} • {product.concentration}
                      </span>
                      <h4 className="text-sm font-semibold text-brand-emerald truncate group-hover:text-brand-gold transition">
                        {product.name}
                      </h4>
                      <p className="text-xs text-stone-500 truncate">
                        Notes: {product.topNotes?.join(', ')}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-bold text-brand-emerald">
                        ₹{minPrice.toLocaleString('en-IN')}
                      </span>
                      <div className="text-[10px] text-brand-gold flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition">
                        View Perfume <ArrowRight className="w-2.5 h-2.5" />
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="pt-3 text-center border-t border-stone-100">
                <button
                  onClick={handleSearchSubmit}
                  className="text-xs font-semibold text-brand-emerald hover:text-brand-gold uppercase tracking-wider"
                >
                  View all results for "{searchTerm}" →
                </button>
              </div>
            </div>
          ) : searchTerm ? (
            <div className="py-12 text-center">
              <p className="text-stone-500 text-sm">No fragrances found matching "{searchTerm}"</p>
              <p className="text-xs text-stone-400 mt-1">Try searching by note (e.g. amber, rose, musk) or collection</p>
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-stone-400">
              Type to begin searching AB Noor's exclusive fragrance catalogue...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
