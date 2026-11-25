import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { StarRating } from '../common/StarRating';
import { Heart, ShoppingBag, Eye, Scale, Check } from 'lucide-react';

export const ProductCard = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, addToCompare, removeFromCompare } = useCompare();

  // Active variant state on card
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.[0] || {
      id: 'default',
      size: '50ml',
      sellingPrice: 4999,
      discountPrice: 4299,
      stock: 10,
    }
  );

  const [isHovered, setIsHovered] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);

  const price = selectedVariant.discountPrice || selectedVariant.sellingPrice;
  const originalPrice = selectedVariant.sellingPrice;
  const hasDiscount = selectedVariant.discountPrice && selectedVariant.discountPrice < selectedVariant.sellingPrice;
  const discountPercent = hasDiscount 
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedVariant, 1);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleToggleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl hover:border-blue-500/50 transition-all duration-300 flex flex-col relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges Overlay */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
        {product.bestseller && (
          <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white rounded-full shadow-sm">
            Best Seller
          </span>
        )}
        {product.newArrival && (
          <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white rounded-full shadow-sm">
            New Arrival
          </span>
        )}
        {hasDiscount && (
          <span className="px-2 py-0.5 text-[10px] font-extrabold bg-[#0A192F] text-blue-200 rounded-full shadow-sm">
            {discountPercent}% OFF
          </span>
        )}
      </div>

      {/* Floating Action Buttons */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
        <button
          onClick={handleToggleWishlist}
          className={`p-2 rounded-full backdrop-blur-md transition shadow-md ${
            inWishlist
              ? 'bg-red-600 text-white'
              : 'bg-white/90 text-slate-700 hover:text-red-600 hover:bg-white'
          }`}
          title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
          aria-label="Wishlist toggle"
        >
          <Heart className="w-4 h-4 fill-current" />
        </button>

        <button
          onClick={handleToggleCompare}
          className={`p-2 rounded-full backdrop-blur-md transition shadow-md ${
            inCompare
              ? 'bg-blue-600 text-white'
              : 'bg-white/90 text-slate-700 hover:text-blue-600 hover:bg-white'
          }`}
          title={inCompare ? 'Remove from comparison' : 'Compare fragrance'}
          aria-label="Compare toggle"
        >
          <Scale className="w-4 h-4" />
        </button>

        <button
          onClick={handleQuickView}
          className="p-2 rounded-full bg-white/90 text-slate-700 hover:text-blue-600 hover:bg-white backdrop-blur-md transition shadow-md hidden sm:block"
          title="Quick preview"
          aria-label="Quick view"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Product Image Stage */}
      <Link to={`/product/${product.slug}`} className="relative block overflow-hidden aspect-[4/5] bg-slate-100">
        <img
          src={product.mainImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      {/* Information Container */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-slate-400 mb-1">
            <span className="font-semibold text-blue-600">{product.brandName || 'AB Noor Private'}</span>
            <span>{product.concentration || 'Extrait'}</span>
          </div>

          {/* Product Title */}
          <Link to={`/product/${product.slug}`}>
            <h3 className="font-playfair font-bold text-base text-slate-900 group-hover:text-blue-600 transition line-clamp-1 mb-1">
              {product.name}
            </h3>
          </Link>

          {/* Star Rating */}
          <div className="mb-2">
            <StarRating rating={product.rating || 5} reviewCount={product.reviewCount} size={13} />
          </div>

          {/* Olfactory Notes Preview */}
          <p className="text-xs text-slate-500 line-clamp-1 mb-3">
            <strong className="text-slate-700">Notes:</strong> {product.topNotes?.slice(0, 2).join(', ')}, {product.middleNotes?.[0]}
          </p>

          {/* Variant Size Pills */}
          {product.variants && product.variants.length > 1 && (
            <div className="flex items-center gap-1.5 mb-2 flex-wrap">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={`px-2 py-0.5 text-[11px] font-semibold rounded-md border transition ${
                    selectedVariant.id === v.id
                      ? 'bg-[#0A192F] text-white border-[#0A192F]'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-500'
                  }`}
                >
                  {v.size}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price & Add to Cart Row */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-base text-slate-900">
                ₹{price.toLocaleString('en-IN')}
              </span>
              {hasDiscount && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 block">
              Taxes included
            </span>
          </div>

          {/* Vibrant Red Button for Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="px-3.5 py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl transition shadow-md shadow-red-600/30 flex items-center justify-center gap-1.5 group/btn"
            title="Add to cart"
          >
            <ShoppingBag className="w-4 h-4 text-white group-hover/btn:scale-110 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
