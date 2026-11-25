import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { bannerService } from '../../services/bannerService';
import { reviewService } from '../../services/reviewService';
import { ProductCard } from '../../components/product/ProductCard';
import { QuickViewModal } from '../../components/product/QuickViewModal';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Crown, 
  Droplet, 
  ChevronRight, 
  Quote,
  Instagram,
  CheckCircle2,
  Compass,
  Flame,
  Award
} from 'lucide-react';

export const Home = () => {
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [activeProfileTab, setActiveProfileTab] = useState('smoky');
  const [profileTabProducts, setProfileTabProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dynamic content loaded from Firestore (maintained by admin)
  useEffect(() => {
    const loadHomeData = async () => {
      setLoading(true);
      try {
        const [bannersData, catsData, featured, best, news, reviews] = await Promise.all([
          bannerService.getBanners(true),
          categoryService.getCategories(),
          productService.getProducts({ featured: true }),
          productService.getProducts({ bestseller: true }),
          productService.getProducts({ newArrival: true }),
          reviewService.getReviews(null, 'approved'),
        ]);

        setBanners(bannersData);
        setCategories(catsData);
        setFeaturedProducts(featured.slice(0, 4));
        setBestSellers(best.slice(0, 4));
        setNewArrivals(news.slice(0, 4));
        setTestimonials(reviews.slice(0, 3));
      } catch (err) {
        console.warn('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  // Filter profile tab products dynamically
  useEffect(() => {
    const familyQuery = 
      activeProfileTab === 'smoky' ? 'leather' :
      activeProfileTab === 'amber' ? 'amber' : 'fresh';

    productService.getProducts({ fragranceFamily: familyQuery }).then(res => {
      setProfileTabProducts(res.slice(0, 4));
    });
  }, [activeProfileTab]);

  const activeHero = banners[0] || {
    title: 'The Essence of Masculine Elegance',
    subtitle: 'AB NOOR POUR HOMME',
    description: 'Explore an exclusive collection of commanding, luxurious fragrances crafted for the modern gentleman. Rare vintage agarwood, cordovan leather, and royal attars.',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1920&q=90',
    badge: 'ROYAL MASCULINE PRESTIGE',
  };

  return (
    <div className="space-y-20 pb-20 overflow-hidden bg-white">
      
      {/* SECTION 1: Hero Banner in Blue, Black & Red */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-[#070B14] text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={activeHero.image}
            alt="AB Noor Perfumes Royal Men's Collection"
            className="w-full h-full object-cover object-center scale-105 animate-pulse duration-[10000ms] opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070B14] via-[#070B14]/85 to-transparent" />
          <div className="absolute inset-0 bg-blue-950/30 mix-blend-multiply" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-left duration-700">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-950/80 border border-blue-500/40 text-blue-300 text-[10px] font-bold tracking-[0.25em] uppercase">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span>{activeHero.badge || 'ROYAL MASCULINE PRESTIGE'}</span>
            </div>

            {/* Headline */}
            <h1 className="font-playfair text-4xl sm:text-6xl font-bold tracking-tight text-white leading-[1.1]">
              {activeHero.title}
            </h1>

            {/* Subtitle / Description */}
            <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed max-w-xl">
              {activeHero.description}
            </p>

            {/* Action Buttons with Vibrant Red CTA */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                to="/shop"
                className="px-8 py-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition shadow-xl shadow-red-600/30 flex items-center gap-2"
              >
                <span>Explore The Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/about"
                className="px-8 py-4 bg-blue-950/60 hover:bg-blue-900/60 border border-blue-500/40 text-blue-200 rounded-xl font-bold text-xs uppercase tracking-widest transition backdrop-blur-sm"
              >
                Our Heritage
              </Link>
            </div>

            {/* Trust Pill Highlights */}
            <div className="pt-8 border-t border-white/10 grid grid-cols-3 gap-4 text-slate-400 text-xs">
              <div>
                <span className="font-playfair font-bold text-base text-white block">25 Years</span>
                <span className="text-[11px]">Aged Agarwoods</span>
              </div>
              <div>
                <span className="font-playfair font-bold text-base text-white block">40% Extrait</span>
                <span className="text-[11px]">High Concentration</span>
              </div>
              <div>
                <span className="font-playfair font-bold text-base text-white block">100% Uncut</span>
                <span className="text-[11px]">Artisanal Pure Attars</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: Shop by Curated Men's Categories (Maintained by Admin) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-red-600 block mb-1">
              CURATED MASCULINE REALMS
            </span>
            <h2 className="font-playfair text-3xl font-bold text-slate-900">
              Shop by Fragrance Realm
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-blue-600 hover:text-red-600 flex items-center gap-1 uppercase tracking-wider transition"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.slice(0, 8).map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug || cat.id}`}
              className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-slate-900 border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-500/50 transition duration-300"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-blue-400 font-bold block">
                  Masculine Collection
                </span>
                <h4 className="font-playfair text-lg font-bold group-hover:text-red-400 transition">
                  {cat.name}
                </h4>
                <p className="text-[11px] text-slate-300 line-clamp-1 font-light">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTION 3: Bestselling Flacons (Maintained by Admin) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-red-600 mb-1">
              <Crown className="w-3.5 h-3.5" />
              <span>THE SOVEREIGN HALL</span>
            </div>
            <h2 className="font-playfair text-3xl font-bold text-slate-900">
              Gentlemen’s Best Sellers
            </h2>
          </div>
          <Link
            to="/shop?sort=popularity"
            className="text-xs font-bold text-blue-600 hover:text-red-600 flex items-center gap-1 uppercase tracking-wider transition"
          >
            <span>Explore All Best Sellers</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
          ))}
        </div>
      </section>

      {/* SECTION 4: Olfactory Profile Showcase (Tabs) */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-red-600 block">
              TARGETED AROMATIC CHARACTERS
            </span>
            <h3 className="font-playfair text-3xl font-bold text-slate-900">
              Choose Your Signature Presence
            </h3>
            <p className="text-xs text-slate-500">
              Select your desired olfactory character to discover precision formulations curated for distinct gentleman styles.
            </p>

            {/* Profile Tabs */}
            <div className="flex justify-center gap-2 pt-4">
              {[
                { id: 'smoky', label: 'Commanding & Smoky' },
                { id: 'amber', label: 'Dark Amber & Spice' },
                { id: 'fresh', label: 'Fresh & Boardroom' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveProfileTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                    activeProfileTab === tab.id
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-500'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {profileTabProducts.map((p) => (
              <ProductCard key={p.id} product={p} onQuickView={setQuickViewProduct} />
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 5: Editorial Feature - The Art of Vintage Agarwood */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-[#070B14] text-white border border-blue-900/40 p-8 sm:p-14 lg:p-16">
          <div className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2 opacity-30 lg:opacity-60 pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1200&q=80"
              alt="Artisanal Oud"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#070B14] via-[#070B14]/80 to-transparent" />
          </div>

          <div className="relative z-10 max-w-xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 border border-blue-500/40 text-blue-300 text-[10px] font-bold uppercase tracking-widest">
              <Award className="w-3.5 h-3.5 text-red-500" />
              <span>THE SOVEREIGN EXTRAIT RESERVE</span>
            </div>

            <h2 className="font-playfair text-3xl sm:text-5xl font-bold leading-tight">
              Sultanate Dehn Al Oud Royale
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
              Distilled in 1999 from heartwood Aquilaria trees in Koh Kong, Cambodia. Matured in our subterranean climate vaults. A commanding symphony of smoked balsamic resins, bitter cocoa, and dark ocean ambergris.
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2">
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-widest block font-medium">Concentration</span>
                <span className="font-bold text-white text-sm">40% Pure Extrait</span>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-widest block font-medium">Longevity</span>
                <span className="font-bold text-white text-sm">26+ Hours on Skin</span>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-widest block font-medium">Vintage</span>
                <span className="font-bold text-red-400 text-sm">1999 Reserve</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/product/sultanate-dehn-al-oud-royale"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition shadow-lg shadow-red-600/30"
              >
                <span>Acquire Flacon</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: New Arrivals (Maintained by Admin) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-red-600 block mb-1">
              FRESH FORMULATIONS
            </span>
            <h2 className="font-playfair text-3xl font-bold text-slate-900">
              New Master Arrivals
            </h2>
          </div>
          <Link
            to="/shop?sort=newest"
            className="text-xs font-bold text-blue-600 hover:text-red-600 flex items-center gap-1 uppercase tracking-wider transition"
          >
            <span>View All New Releases</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
          ))}
        </div>
      </section>

      {/* SECTION 7: Approved Customer Reviews & Testimonials (Maintained by Admin) */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-red-600 block">
              PATRON TESTIMONIALS
            </span>
            <h3 className="font-playfair text-3xl font-bold text-slate-900">
              Echoes of Distinction
            </h3>
            <p className="text-xs text-slate-500">
              Verified experiences from dignitaries, connoisseurs, and gentlemen wearing AB Noor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((review) => (
              <div
                key={review.id}
                className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4 relative flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {'★'.repeat(review.rating || 5)}
                  </div>
                  <h4 className="font-playfair font-bold text-base text-slate-900">
                    "{review.title}"
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-light italic">
                    {review.comment}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{review.userName}</span>
                    <span className="text-[11px] text-blue-600">{review.productName}</span>
                  </div>
                  {review.verifiedPurchase && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 8: Four Guarantees */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600 shrink-0">
              <Droplet className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h5 className="font-bold text-sm text-slate-900">Aged Extraits</h5>
              <p className="text-xs text-slate-500 font-light">35-40% oil concentration for intense 24hr projection.</p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h5 className="font-bold text-sm text-slate-900">Express Delivery</h5>
              <p className="text-xs text-slate-500 font-light">Insured priority dispatch across all Indian metro cities.</p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h5 className="font-bold text-sm text-slate-900">Signed Authenticity</h5>
              <p className="text-xs text-slate-500 font-light">Hand-numbered bottles with wax-sealed batch certificates.</p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-xl bg-red-50 text-red-600 shrink-0">
              <Crown className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h5 className="font-bold text-sm text-slate-900">VIP Concierge</h5>
              <p className="text-xs text-slate-500 font-light">Personal olfactory consultations via phone & WhatsApp.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9: Gentleman's Fragrance Quiz Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0A192F] text-white rounded-3xl p-8 sm:p-12 border border-blue-500/30 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900 text-blue-200 text-[10px] font-bold uppercase tracking-widest">
              <Compass className="w-3.5 h-3.5 text-red-500" />
              <span>4-STEP CONSULTATION</span>
            </div>
            <h3 className="font-playfair text-3xl font-bold">
              Unsure Which Scent Matches Your Authority?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
              Answer four questions regarding your gentleman persona, preferred olfactory realm, and wearing occasions. Our master nose will reveal your bespoke matches.
            </p>
          </div>

          <Link
            to="/fragrance-finder"
            className="px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition shadow-lg shadow-red-600/30 shrink-0 flex items-center gap-2"
          >
            <span>Start Scent Finder</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />

    </div>
  );
};
