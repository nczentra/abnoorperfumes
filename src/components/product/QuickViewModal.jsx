import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { StarRating } from '../common/StarRating';
import { X, Heart, ShoppingBag, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const QuickViewModal = ({ product, onClose }) => {
  if (!product) return null;

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || {});
  const [activeImage, setActiveImage] = useState(product.mainImage);
  const [quantity, setQuantity] = useState(1);

  const inWishlist = isInWishlist(product.id);
  const price = selectedVariant.discountPrice || selectedVariant.sellingPrice;
  const originalPrice = selectedVariant.sellingPrice;
  const hasDiscount = selectedVariant.discountPrice && selectedVariant.discountPrice < selectedVariant.sellingPrice;

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-dark-forest/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-brand-gold/30 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-stone-400 hover:text-brand-emerald bg-white/80 rounded-full shadow transition"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left: Gallery */}
          <div className="p-6 bg-stone-50 flex flex-col justify-between">
            <div className="aspect-[4/5] rounded-xl overflow-hidden border border-stone-200 bg-white">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition ${
                      activeImage === img ? 'border-brand-emerald' : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-gold mb-1">
                <span>{product.brandName}</span>
                <span>•</span>
                <span>{product.concentration}</span>
              </div>

              <h2 className="font-playfair text-2xl font-bold text-brand-emerald mb-2">
                {product.name}
              </h2>

              <StarRating rating={product.rating || 5} reviewCount={product.reviewCount} />

              {/* Price */}
              <div className="flex items-baseline gap-3 my-4">
                <span className="font-playfair font-bold text-2xl text-brand-emerald">
                  ₹{price.toLocaleString('en-IN')}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-stone-400 line-through">
                    ₹{originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-xs text-brand-gold font-medium">
                  Complimentary luxury gift box included
                </span>
              </div>

              <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed mb-4">
                {product.description}
              </p>

              {/* Fragrance Specifications */}
              <div className="grid grid-cols-2 gap-2 p-3 bg-stone-50 rounded-lg text-xs mb-4">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase">Longevity</span>
                  <strong className="text-brand-emerald">{product.longevity || '16+ Hours'}</strong>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase">Sillage</span>
                  <strong className="text-brand-emerald">{product.sillage || 'Heavy & Luxurious'}</strong>
                </div>
              </div>

              {/* Variants Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-6">
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                    Select Flacon Volume
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-4 py-2 text-xs font-semibold rounded-lg border transition ${
                          selectedVariant.id === v.id
                            ? 'bg-brand-emerald text-brand-soft-gold border-brand-emerald shadow-sm'
                            : 'bg-white text-stone-700 border-stone-200 hover:border-brand-gold'
                        }`}
                      >
                        {v.size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-stone-200">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-4 bg-brand-emerald hover:bg-brand-dark-forest text-brand-soft-gold font-bold text-xs uppercase tracking-widest rounded-xl transition shadow-lg shadow-brand-emerald/20 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-brand-gold" />
                  <span>Add to Luxury Cart</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3 rounded-xl border transition ${
                    inWishlist
                      ? 'bg-rose-50 border-rose-200 text-rose-600'
                      : 'border-stone-200 text-stone-600 hover:text-brand-emerald'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div className="text-center">
                <Link
                  to={`/product/${product.slug}`}
                  onClick={onClose}
                  className="text-xs font-semibold text-brand-emerald hover:text-brand-gold inline-flex items-center gap-1 transition"
                >
                  <span>View Complete Olfactory Pyramid & Reviews</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
