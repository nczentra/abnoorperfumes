import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import { reviewService } from '../../services/reviewService';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { StarRating } from '../../components/common/StarRating';
import { PinCodeChecker } from '../../components/common/PinCodeChecker';
import { FragranceNotesPyramid } from '../../components/common/FragranceNotesPyramid';
import { ProductCard } from '../../components/product/ProductCard';
import { 
  Heart, 
  ShoppingBag, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Minus, 
  Plus, 
  Scale, 
  Share2, 
  Droplet, 
  Clock, 
  Compass, 
  Award,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';

export const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, addToCompare, removeFromCompare } = useCompare();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('notes');

  // Review submission state
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: '',
    userName: '',
    userEmail: '',
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const prod = await productService.getProductBySlug(slug);
        if (prod) {
          setProduct(prod);
          setSelectedVariant(prod.variants?.[0] || null);
          setSelectedImage(prod.mainImage);

          // Load related products & reviews
          const [related, revs] = await Promise.all([
            productService.getRelatedProducts(prod.id, prod.categoryId, 4),
            reviewService.getReviews(prod.id, 'approved'),
          ]);
          setRelatedProducts(related);
          setReviews(revs);
        }
      } catch (err) {
        console.warn('Error fetching product detail:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="py-32 text-center">
        <div className="w-12 h-12 border-2 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-stone-500 font-medium">Unveiling fragrance composition...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center px-4 space-y-4">
        <h2 className="font-playfair text-2xl font-bold text-brand-emerald">Fragrance Not Found</h2>
        <p className="text-xs text-stone-500">The fragrance you requested may have been archived or retired.</p>
        <Link
          to="/shop"
          className="inline-block px-6 py-2.5 bg-brand-emerald text-brand-soft-gold text-xs font-bold uppercase tracking-wider rounded-xl"
        >
          Return to Catalogue
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);

  const price = selectedVariant?.discountPrice || selectedVariant?.sellingPrice || 4999;
  const originalPrice = selectedVariant?.sellingPrice || price;
  const hasDiscount = selectedVariant?.discountPrice && selectedVariant.discountPrice < selectedVariant.sellingPrice;
  const discountPercent = hasDiscount 
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedVariant, quantity);
    navigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Discover ${product.name} by AB Noor Perfumes: ${product.shortDescription}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard!');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.title || !newReview.comment || !newReview.userName) {
      toast.error('Please complete all review fields.');
      return;
    }

    setSubmittingReview(true);
    try {
      const saved = await reviewService.submitReview({
        productId: product.id,
        productName: product.name,
        ...newReview,
        verifiedPurchase: true,
      });
      setReviews(prev => [saved, ...prev]);
      toast.success('Thank you! Your verified review has been published.');
      setNewReview({ rating: 5, title: '', comment: '', userName: '', userEmail: '' });
    } catch (e) {
      toast.error('Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-stone-500">
        <Link to="/" className="hover:text-brand-emerald">Home</Link>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <Link to="/shop" className="hover:text-brand-emerald">Shop</Link>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <Link to={`/category/${product.categoryId}`} className="hover:text-brand-emerald capitalize">
          {product.categoryName || product.categoryId}
        </Link>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <span className="text-stone-800 font-semibold truncate">{product.name}</span>
      </nav>

      {/* Main Product Stage: 2-Column Gallery & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16 items-start">
        
        {/* Left Column: Image Gallery */}
        <div className="space-y-4 sticky top-24">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-stone-100 border border-stone-200/80 shadow-luxury relative group">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            {hasDiscount && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-rose-600 text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-md">
                Save {discountPercent}%
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                    selectedImage === img
                      ? 'border-brand-emerald shadow-md'
                      : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Buying Controls & Scent Profile */}
        <div className="space-y-6">
          
          <div>
            {/* Brand & Concentration Header */}
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold tracking-[0.2em] uppercase text-brand-gold">
                {product.brandName}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-brand-emerald/10 text-brand-emerald font-semibold text-[11px]">
                {product.concentration}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-brand-emerald leading-tight mb-3">
              {product.name}
            </h1>

            {/* Rating & SKU */}
            <div className="flex items-center gap-4 text-xs">
              <StarRating rating={product.rating || 5} reviewCount={reviews.length} size={15} />
              <span className="text-stone-300">|</span>
              <span className="text-stone-500 font-mono">SKU: {selectedVariant?.sku || 'ABN-EXP'}</span>
            </div>
          </div>

          {/* Pricing Row */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-baseline justify-between">
            <div className="space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="font-playfair font-bold text-3xl text-brand-emerald">
                  ₹{price.toLocaleString('en-IN')}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-stone-400 line-through">
                    ₹{originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-stone-500 block">
                Taxes included. Complimentary Royal Packaging & Delivery above ₹2,499.
              </span>
            </div>

            {selectedVariant?.stock > 0 ? (
              <span className="text-[11px] font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full">
                In Stock ({selectedVariant.stock} available)
              </span>
            ) : (
              <span className="text-[11px] font-semibold px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full">
                Out of Stock
              </span>
            )}
          </div>

          {/* Short Description */}
          <p className="text-sm text-stone-600 leading-relaxed font-light">
            {product.description}
          </p>

          {/* Variant Size Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-brand-emerald uppercase tracking-wider">
                  Select Flacon Volume
                </span>
                <span className="text-stone-500">Selected: {selectedVariant?.size}</span>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`py-3 px-3 rounded-xl border text-center transition ${
                      selectedVariant?.id === v.id
                        ? 'bg-[#0A192F] text-white border-[#0A192F] font-bold shadow-md'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-blue-500'
                    }`}
                  >
                    <div className="text-xs font-bold">{v.size}</div>
                    <div className="text-[11px] opacity-80 mt-0.5">
                      ₹{(v.discountPrice || v.sellingPrice).toLocaleString('en-IN')}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Quantity Adjuster */}
              <div className="flex items-center border border-slate-300 rounded-xl bg-white px-2 py-1 shadow-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-slate-500 hover:text-blue-600 transition"
                  title="Decrease"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-3 text-sm font-bold text-slate-800">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-slate-500 hover:text-blue-600 transition"
                  title="Increase"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart - Vibrant Red Button */}
              <button
                onClick={handleAddToCart}
                disabled={selectedVariant?.stock <= 0}
                className="flex-1 py-3.5 px-6 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4 text-white" />
                <span>Add to Luxury Cart</span>
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3.5 rounded-xl border transition shadow-sm ${
                  inWishlist
                    ? 'bg-red-50 border-red-200 text-red-600'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-red-600'
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Buy Now Direct Button in Deep Royal Blue */}
            <button
              onClick={handleBuyNow}
              disabled={selectedVariant?.stock <= 0}
              className="w-full py-3.5 px-6 bg-[#0A192F] hover:bg-[#0F2C59] text-white border border-blue-600/30 rounded-xl font-bold text-xs uppercase tracking-widest transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>Instant Luxury Checkout (Buy Now)</span>
              <ArrowRight className="w-4 h-4 text-red-400" />
            </button>
          </div>

          {/* Quick Tool Links: Compare & Share */}
          <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
            <button
              onClick={() => {
                if (inCompare) removeFromCompare(product.id);
                else addToCompare(product);
              }}
              className="flex items-center gap-1.5 hover:text-brand-gold transition"
            >
              <Scale className="w-4 h-4 text-brand-gold" />
              <span>{inCompare ? 'Remove from Compare' : 'Add to Compare Tool'}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 hover:text-brand-emerald transition"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Fragrance</span>
            </button>
          </div>

          {/* PIN Code Delivery Checker */}
          <PinCodeChecker />

          {/* Key Olfactory Gauges: Longevity & Sillage */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border border-stone-200 text-brand-gold">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Longevity</span>
                <strong className="text-brand-emerald">{product.longevity || '16+ Hours on Skin'}</strong>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border border-stone-200 text-brand-gold">
                <Droplet className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Sillage & Aura</span>
                <strong className="text-brand-emerald">{product.sillage || 'Heavy & Majestic'}</strong>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Tabs Section: Notes Pyramid, Specifications, Rituals, Shipping, Reviews */}
      <div className="border-t border-stone-200 pt-10">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200 gap-8 overflow-x-auto pb-px">
          {[
            { id: 'notes', label: 'Fragrance Pyramid' },
            { id: 'specs', label: 'Specifications' },
            { id: 'ritual', label: 'How to Wear & Layer' },
            { id: 'shipping', label: 'Delivery & Care' },
            { id: 'reviews', label: `Patron Reviews (${reviews.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-xs font-bold uppercase tracking-wider transition whitespace-nowrap border-b-2 ${
                activeTab === tab.id
                  ? 'border-brand-gold text-brand-emerald font-extrabold'
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="py-8">
          
          {/* Notes Pyramid Tab */}
          {activeTab === 'notes' && (
            <FragranceNotesPyramid
              topNotes={product.topNotes}
              middleNotes={product.middleNotes}
              baseNotes={product.baseNotes}
            />
          )}

          {/* Specifications Tab */}
          {activeTab === 'specs' && (
            <div className="bg-white rounded-2xl border border-stone-200 p-8 max-w-3xl mx-auto shadow-sm">
              <h4 className="font-playfair text-xl font-bold text-brand-emerald mb-6 text-center">
                Product Specifications
              </h4>
              <div className="divide-y divide-stone-100 text-xs">
                <div className="py-3 flex justify-between">
                  <span className="text-stone-500 font-medium">Brand House</span>
                  <strong className="text-stone-800">{product.brandName}</strong>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-stone-500 font-medium">Fragrance Family</span>
                  <strong className="text-stone-800">{product.fragranceFamily}</strong>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-stone-500 font-medium">Concentration</span>
                  <strong className="text-stone-800">{product.concentration}</strong>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-stone-500 font-medium">Gender Character</span>
                  <strong className="text-stone-800 capitalize">{product.gender}</strong>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-stone-500 font-medium">Ideal Season</span>
                  <strong className="text-stone-800">{product.season || 'All Seasons'}</strong>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-stone-500 font-medium">Recommended Occasion</span>
                  <strong className="text-stone-800">{product.occasion || 'Evening & Royal Occasions'}</strong>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-stone-500 font-medium">Country of Origin</span>
                  <strong className="text-stone-800">United Arab Emirates & India</strong>
                </div>
              </div>
            </div>
          )}

          {/* Ritual Tab */}
          {activeTab === 'ritual' && (
            <div className="bg-stone-50 rounded-2xl border border-stone-200 p-8 max-w-3xl mx-auto space-y-4 text-xs leading-relaxed">
              <h4 className="font-playfair text-xl font-bold text-brand-emerald text-center mb-4">
                The Arabian Layering Ritual (Taqleed)
              </h4>
              <p className="text-stone-600">
                To experience the true majesty and 24-hour sillage of <strong>{product.name}</strong>, apply using traditional Middle Eastern application techniques:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-stone-700 font-medium">
                <li><strong>Pulse Points:</strong> Spray or dab on warm pulse areas—inside of the wrists, base of the throat, and behind the ears.</li>
                <li><strong>Hydration Lock:</strong> Apply immediately after bathing over hydrated or unfragranced body lotion. Fragrance molecules cling to lipids.</li>
                <li><strong>Textile Cloud:</strong> Spray lightly from 10 inches onto organic linen or wool clothing for days of residual aroma.</li>
                <li><strong>Do Not Rub:</strong> Never rub wrists together after spraying; friction crushes the delicate top floral and citrus facets.</li>
              </ol>
            </div>
          )}

          {/* Shipping & Delivery Tab */}
          {activeTab === 'shipping' && (
            <div className="bg-white rounded-2xl border border-stone-200 p-8 max-w-3xl mx-auto space-y-4 text-xs leading-relaxed">
              <h4 className="font-playfair text-xl font-bold text-brand-emerald text-center mb-4">
                Shipping, Packaging & Authenticity
              </h4>
              <div className="space-y-3 text-stone-600">
                <p>
                  <strong>Insured Express Courier:</strong> All orders are dispatched within 24 hours from our Mumbai central vault via Blue Dart Luxury Air Express. Delivery takes 2-4 business days across India.
                </p>
                <p>
                  <strong>Signature Emerald Gift Box:</strong> Every flacon is protected within high-density foam cushioning, placed inside our gold-foil stamped emerald presentation box and sealed with a hand-pressed monogram wax seal.
                </p>
                <p>
                  <strong>Complimentary Sampler:</strong> All orders exceeding ₹2,499 receive an artisanal 2ml sample vial of our newest unreleased Private Reserve formulation.
                </p>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="max-w-4xl mx-auto space-y-10">
              
              {/* Existing Reviews List */}
              <div className="space-y-4">
                <h4 className="font-playfair text-xl font-bold text-brand-emerald">
                  Patron Reviews ({reviews.length})
                </h4>

                {reviews.length > 0 ? (
                  <div className="divide-y divide-stone-200 bg-white rounded-2xl border border-stone-200 p-6">
                    {reviews.map((r) => (
                      <div key={r.id} className="py-4 first:pt-0 last:pb-0 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-stone-800">{r.userName}</span>
                            {r.verifiedPurchase && (
                              <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-medium">
                                Verified Patron
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-stone-400">
                            {new Date(r.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <StarRating rating={r.rating} size={13} showNumber={false} />

                        <h5 className="font-semibold text-xs text-brand-emerald">
                          "{r.title}"
                        </h5>

                        <p className="text-xs text-stone-600 leading-relaxed">
                          {r.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-stone-500 italic">
                    Be the first patron to share your olfactory review for {product.name}.
                  </p>
                )}
              </div>

              {/* Review Submission Form */}
              <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-4">
                <h4 className="font-playfair text-lg font-bold text-brand-emerald">
                  Submit a Verified Review
                </h4>
                
                <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-stone-600 font-semibold mb-1">Your Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                          className={`px-3 py-1.5 rounded-lg border font-bold ${
                            newReview.rating >= star
                              ? 'bg-brand-gold text-brand-dark-forest border-brand-gold'
                              : 'bg-white text-stone-400 border-stone-200'
                          }`}
                        >
                          ★ {star}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-stone-600 font-semibold mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={newReview.userName}
                        onChange={(e) => setNewReview(prev => ({ ...prev, userName: e.target.value }))}
                        placeholder="e.g. Tariq Al-Mansoor"
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-brand-emerald"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-600 font-semibold mb-1">Review Headline *</label>
                      <input
                        type="text"
                        required
                        value={newReview.title}
                        onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g. Masterpiece of aged agarwood"
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-brand-emerald"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-600 font-semibold mb-1">Your Fragrance Experience *</label>
                    <textarea
                      rows={3}
                      required
                      value={newReview.comment}
                      onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                      placeholder="Describe the notes, projection, longevity, and occasions..."
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-brand-emerald"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-6 py-2.5 bg-brand-emerald text-brand-soft-gold rounded-xl font-bold uppercase tracking-wider hover:bg-brand-dark-forest transition"
                  >
                    {submittingReview ? 'Submitting...' : 'Post Verified Review'}
                  </button>
                </form>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* Related Products Carousel / Grid */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-stone-200 pt-16">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-gold">
              Olfactory Harmony
            </span>
            <h3 className="font-playfair text-3xl font-bold text-brand-emerald mt-1">
              Complementary Fragrances
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
