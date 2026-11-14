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
      className="group bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-luxury hover:border-brand-gold/60 transition-all duration-300 flex flex-col relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges Overlay */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
        {product.bestseller && (
          <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-brand-emerald text-brand-soft-gold rounded-full shadow-sm">
            Best Seller
          </span>
        )}
        {product.newArrival && (
          <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-brand-gold text-brand-dark-forest rounded-full shadow-sm">
            New Arrival
          </span>
        )}
        {hasDiscount && (
          <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-rose-600 text-white rounded-full shadow-sm">
            {discountPercent}% OFF
          </span>
        )}
      </div>

      {/* Action Buttons Overlay (Wishlist, Compare, Quick View) */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleToggleWishlist}
          className={`p-2 rounded-full backdrop-blur-md transition shadow-md ${
            inWishlist
              ? 'bg-rose-50 text-rose-600 border border-rose-200'
              : 'bg-white/90 text-stone-600 hover:text-brand-emerald hover:bg-white border border-stone-200'
          }`}
          title={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>

        <button
          onClick={handleToggleCompare}
          className={`p-2 rounded-full backdrop-blur-md transition shadow-md ${
            inCompare
              ? 'bg-amber-50 text-brand-gold border border-brand-gold/50'
              : 'bg-white/90 text-stone-600 hover:text-brand-gold hover:bg-white border border-stone-200'
          }`}
          title={inCompare ? 'Remove from compare' : 'Add to compare'}
        >
          <Scale className="w-4 h-4" />
        </button>

        <button
          onClick={handleQuickView}
          className="p-2 rounded-full bg-white/90 text-stone-600 hover:text-brand-emerald hover:bg-white border border-stone-200 backdrop-blur-md transition shadow-md hidden sm:flex"
          title="Quick preview"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Image Container with Link */}
      <Link to={`/product/${product.slug}`} className="relative aspect-[4/5] overflow-hidden bg-stone-100 block">
        <img
          src={isHovered && product.images?.[1] ? product.images[1] : product.mainImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-forest/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>

      {/* Product Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Concentration */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1.5">
            <span className="font-semibold uppercase tracking-wider text-brand-gold">
              {product.brandName}
            </span>
            <span className="text-[10px] text-stone-400">
              {product.concentration}
            </span>
          </div>

          {/* Product Title */}
          <Link to={`/product/${product.slug}`}>
            <h3 className="font-playfair font-bold text-base text-brand-emerald hover:text-brand-gold transition line-clamp-1 mb-1">
              {product.name}
            </h3>
          </Link>

          {/* Star Rating */}
          <div className="mb-2.5">
            <StarRating rating={product.rating || 5} reviewCount={product.reviewCount} size={13} />
          </div>

          {/* Olfactory Notes Preview */}
          <p className="text-xs text-stone-500 line-clamp-1 mb-3">
            <strong className="text-stone-700">Notes:</strong> {product.topNotes?.slice(0, 2).join(', ')}, {product.middleNotes?.[0]}
          </p>

          {/* Variant Size Pills */}
          {product.variants && product.variants.length > 1 && (
            <div className="flex items-center gap-1.5 mb-3 flex-wrap">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={`px-2 py-0.5 text-[11px] font-semibold rounded border transition ${
                    selectedVariant.id === v.id
                      ? 'bg-brand-emerald text-brand-soft-gold border-brand-emerald'
                      : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-brand-gold'
                  }`}
                >
                  {v.size}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price & Add to Cart Row */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between mt-auto">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-base text-brand-emerald">
                ₹{price.toLocaleString('en-IN')}
              </span>
              {hasDiscount && (
                <span className="text-xs text-stone-400 line-through">
                  ₹{originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[10px] text-stone-400 block">
              Inclusive of all taxes
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className="p-2.5 bg-brand-emerald hover:bg-brand-dark-forest text-brand-soft-gold rounded-xl transition shadow-md shadow-brand-emerald/20 flex items-center justify-center gap-1.5 group/btn"
            title="Add to cart"
          >
            <ShoppingBag className="w-4 h-4 text-brand-gold group-hover/btn:scale-110 transition-transform" />
            <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
