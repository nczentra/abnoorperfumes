import React from 'react';
import { FRAGRANCE_FAMILIES, CONCENTRATIONS, OCCASIONS } from '../../constants/brand';
import { RotateCcw, Filter } from 'lucide-react';

export const ProductFilters = ({
  filters,
  categories = [],
  brands = [],
  onFilterChange,
  onResetFilters,
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-stone-100">
        <div className="flex items-center gap-2 text-brand-emerald font-bold text-sm">
          <Filter className="w-4 h-4 text-brand-gold" />
          <span>Filter Scents</span>
        </div>
        <button
          onClick={onResetFilters}
          className="text-xs text-stone-400 hover:text-brand-emerald flex items-center gap-1 transition"
          title="Reset all filters"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-brand-emerald mb-2.5">
          Gentlemen's Realm
        </label>
        <div className="space-y-1">
          <button
            onClick={() => onFilterChange('category', 'all')}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition ${
              !filters.category || filters.category === 'all'
                ? 'bg-brand-emerald text-brand-soft-gold font-bold'
                : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            All Collections
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onFilterChange('category', cat.id)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition flex justify-between items-center ${
                filters.category === cat.id
                  ? 'bg-brand-emerald text-brand-soft-gold font-bold'
                  : 'text-stone-600 hover:bg-stone-50'
              }`}
            >
              <span>{cat.name}</span>
              {cat.itemCount !== undefined && (
                <span className="text-[10px] opacity-70">({cat.itemCount})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Fragrance Family */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-brand-emerald mb-2.5">
          Olfactory Family
        </label>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          <button
            onClick={() => onFilterChange('fragranceFamily', 'all')}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition ${
              !filters.fragranceFamily || filters.fragranceFamily === 'all'
                ? 'bg-brand-emerald text-brand-soft-gold font-bold'
                : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            All Families
          </button>
          {FRAGRANCE_FAMILIES.map((f) => (
            <button
              key={f.id}
              onClick={() => onFilterChange('fragranceFamily', f.name)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition ${
                filters.fragranceFamily === f.name
                  ? 'bg-brand-emerald text-brand-soft-gold font-bold'
                  : 'text-stone-600 hover:bg-stone-50'
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>

      {/* Concentration Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-brand-emerald mb-2.5">
          Concentration
        </label>
        <div className="space-y-1">
          <button
            onClick={() => onFilterChange('concentration', 'all')}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition ${
              !filters.concentration || filters.concentration === 'all'
                ? 'bg-brand-emerald text-brand-soft-gold font-bold'
                : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            All Concentrations
          </button>
          {CONCENTRATIONS.map((c) => (
            <button
              key={c.id}
              onClick={() => onFilterChange('concentration', c.name)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition ${
                filters.concentration === c.name
                  ? 'bg-brand-emerald text-brand-soft-gold font-bold'
                  : 'text-stone-600 hover:bg-stone-50'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Brand Houses */}
      {brands.length > 0 && (
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-emerald mb-2.5">
            Perfume House / Distillery
          </label>
          <div className="space-y-1">
            <button
              onClick={() => onFilterChange('brand', 'all')}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition ${
                !filters.brand || filters.brand === 'all'
                  ? 'bg-brand-emerald text-brand-soft-gold font-bold'
                  : 'text-stone-600 hover:bg-stone-50'
              }`}
            >
              All Perfume Houses
            </button>
            {brands.map((b) => (
              <button
                key={b.id}
                onClick={() => onFilterChange('brand', b.id)}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition ${
                  filters.brand === b.id
                    ? 'bg-brand-emerald text-brand-soft-gold font-bold'
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                {b.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Slider */}
      <div className="pt-2 border-t border-stone-100">
        <label className="block text-xs font-bold uppercase tracking-wider text-brand-emerald mb-2">
          Max Price: ₹{(filters.maxPrice || 25000).toLocaleString('en-IN')}
        </label>
        <input
          type="range"
          min={2000}
          max={25000}
          step={500}
          value={filters.maxPrice || 25000}
          onChange={(e) => onFilterChange('maxPrice', Number(e.target.value))}
          className="w-full accent-brand-emerald h-1.5 bg-stone-200 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-stone-400 mt-1">
          <span>₹2,000</span>
          <span>₹25,000+</span>
        </div>
      </div>

    </div>
  );
};
