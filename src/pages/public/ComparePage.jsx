import React from 'react';
import { Link } from 'react-router-dom';
import { useCompare } from '../../context/CompareContext';
import { useCart } from '../../context/CartContext';
import { StarRating } from '../../components/common/StarRating';
import { Scale, Trash2, ShoppingBag, Plus, ArrowLeft } from 'lucide-react';

export const ComparePage = () => {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-gold flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5" /> Side-by-Side Analysis
          </span>
          <h1 className="font-playfair text-3xl font-bold text-brand-emerald mt-1">
            Perfume Comparison Matrix
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Compare notes, sillage, longevity, and concentrations across up to three fragrances.
          </p>
        </div>

        {compareItems.length > 0 && (
          <button
            onClick={clearCompare}
            className="text-xs font-semibold text-stone-500 hover:text-rose-600 flex items-center gap-1.5 transition"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Comparison</span>
          </button>
        )}
      </div>

      {compareItems.length === 0 ? (
        <div className="py-24 text-center bg-white rounded-3xl border border-stone-200 p-8 space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-stone-100 border border-brand-gold/40 flex items-center justify-center mx-auto text-brand-gold">
            <Scale className="w-8 h-8" />
          </div>
          <h3 className="font-playfair text-xl font-bold text-brand-emerald">
            No fragrances in comparison
          </h3>
          <p className="text-xs text-stone-500">
            Click the balance icon on any product card or detail page to add up to three perfumes for side-by-side analysis.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-emerald text-brand-soft-gold text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-brand-dark-forest transition"
          >
            <span>Explore Fragrance Catalogue</span>
          </Link>
        </div>
      ) : (
        /* Comparison Table */
        <div className="overflow-x-auto bg-white rounded-3xl border border-stone-200 shadow-sm">
          <table className="w-full text-left text-xs divide-y divide-stone-200">
            
            {/* Table Header: Product Cards */}
            <thead className="bg-stone-50">
              <tr>
                <th className="p-6 font-bold uppercase tracking-wider text-stone-500 w-44">
                  Attribute
                </th>
                {compareItems.map((product) => {
                  const defaultVariant = product.variants?.[0] || {};
                  const price = defaultVariant.discountPrice || defaultVariant.sellingPrice || 4999;
                  return (
                    <th key={product.id} className="p-6 min-w-[260px] align-top">
                      <div className="space-y-3">
                        <div className="relative aspect-[4/5] rounded-xl overflow-hidden border border-stone-200 bg-white">
                          <img
                            src={product.mainImage}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => removeFromCompare(product.id)}
                            className="absolute top-2 right-2 p-1.5 bg-white/90 text-stone-400 hover:text-rose-600 rounded-full shadow transition"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold block">
                            {product.brandName}
                          </span>
                          <Link to={`/product/${product.slug}`} className="font-playfair text-base font-bold text-brand-emerald hover:underline block truncate">
                            {product.name}
                          </Link>
                          <div className="font-bold text-sm text-stone-800 mt-1">
                            ₹{price.toLocaleString('en-IN')}
                          </div>
                        </div>

                        <button
                          onClick={() => addToCart(product, defaultVariant, 1)}
                          className="w-full py-2.5 bg-brand-emerald hover:bg-brand-dark-forest text-brand-soft-gold font-bold text-[11px] uppercase tracking-wider rounded-lg transition flex items-center justify-center gap-1.5"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 text-brand-gold" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </th>
                  );
                })}

                {/* Empty Slot to add another product */}
                {compareItems.length < 3 && (
                  <th className="p-6 min-w-[220px] align-middle text-center bg-stone-50/50">
                    <Link
                      to="/shop"
                      className="border-2 border-dashed border-stone-300 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 hover:border-brand-gold transition text-stone-400 hover:text-brand-emerald"
                    >
                      <Plus className="w-8 h-8" />
                      <span className="text-xs font-semibold">Add Another Fragrance</span>
                    </Link>
                  </th>
                )}
              </tr>
            </thead>

            {/* Table Body Comparison Rows */}
            <tbody className="divide-y divide-stone-100">
              <tr>
                <td className="p-4 font-bold text-stone-500 uppercase">Concentration</td>
                {compareItems.map(p => (
                  <td key={p.id} className="p-4 font-semibold text-brand-emerald">
                    {p.concentration}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-stone-500 uppercase">Fragrance Family</td>
                {compareItems.map(p => (
                  <td key={p.id} className="p-4 text-stone-700">
                    {p.fragranceFamily}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-stone-500 uppercase">Top Notes</td>
                {compareItems.map(p => (
                  <td key={p.id} className="p-4 text-stone-700">
                    {p.topNotes?.join(', ')}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-stone-500 uppercase">Heart / Middle Notes</td>
                {compareItems.map(p => (
                  <td key={p.id} className="p-4 text-stone-700">
                    {p.middleNotes?.join(', ')}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-stone-500 uppercase">Base Notes</td>
                {compareItems.map(p => (
                  <td key={p.id} className="p-4 text-stone-700">
                    {p.baseNotes?.join(', ')}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-stone-500 uppercase">Longevity on Skin</td>
                {compareItems.map(p => (
                  <td key={p.id} className="p-4 font-semibold text-brand-emerald">
                    {p.longevity || '16+ Hours'}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-stone-500 uppercase">Sillage & Aura</td>
                {compareItems.map(p => (
                  <td key={p.id} className="p-4 text-stone-700">
                    {p.sillage || 'Heavy'}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-stone-500 uppercase">Season & Occasion</td>
                {compareItems.map(p => (
                  <td key={p.id} className="p-4 text-stone-700">
                    {p.season} • {p.occasion}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-stone-500 uppercase">Rating</td>
                {compareItems.map(p => (
                  <td key={p.id} className="p-4">
                    <StarRating rating={p.rating} reviewCount={p.reviewCount} size={13} />
                  </td>
                ))}
              </tr>
            </tbody>

          </table>
        </div>
      )}

    </div>
  );
};
