import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export const CustomerWishlist = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (product) => {
    addToCart(product, product.variants?.[0], 1);
    removeFromWishlist(product.id);
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-stone-100">
        <div>
          <h2 className="font-playfair text-xl font-bold text-brand-emerald">
            Bespoke Wishlist ({wishlist.length})
          </h2>
          <p className="text-xs text-stone-400 font-light">
            Your private selection of curated fragrances saved for future occasions.
          </p>
        </div>

        {wishlist.length > 0 && (
          <button
            onClick={clearWishlist}
            className="text-xs text-stone-400 hover:text-rose-600 transition"
          >
            Clear Wishlist
          </button>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="py-20 text-center space-y-4 max-w-sm mx-auto">
          <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-rose-500">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="font-playfair text-lg font-bold text-brand-emerald">
            Your wishlist is empty
          </h3>
          <p className="text-xs text-stone-500 font-light">
            Save fragrances to your private wishlist by clicking the heart icon on any perfume card.
          </p>
          <Link
            to="/shop"
            className="inline-block px-6 py-2.5 bg-brand-emerald hover:bg-brand-dark-forest text-brand-soft-gold rounded-xl font-bold text-xs uppercase tracking-wider transition"
          >
            Explore Fragrances
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlist.map((product) => {
            const defaultVariant = product.variants?.[0] || {};
            const price = defaultVariant.discountPrice || defaultVariant.sellingPrice || 4999;
            return (
              <div
                key={product.id}
                className="group border border-stone-200 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
                    <img
                      src={product.mainImage}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="absolute top-2 right-2 p-1.5 bg-white/90 text-stone-400 hover:text-rose-600 rounded-full shadow transition"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-4 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold">
                      {product.brandName} • {product.concentration}
                    </span>
                    <Link to={`/product/${product.slug}`} className="font-playfair font-bold text-sm text-brand-emerald hover:underline block truncate">
                      {product.name}
                    </Link>
                    <div className="font-bold text-xs text-stone-800 pt-1">
                      ₹{price.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="w-full py-2.5 bg-brand-emerald hover:bg-brand-dark-forest text-brand-soft-gold rounded-xl font-bold text-[11px] uppercase tracking-wider transition flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-brand-gold" />
                    <span>Move to Cart</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
