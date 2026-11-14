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
  Compass
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

  // Filter profile tab products
  useEffect(() => {
    const familyQuery = 
      activeProfileTab === 'smoky' ? 'leather' :
      activeProfileTab === 'amber' ? 'amber' : 'fresh';

    productService.getProducts({ fragranceFamily: familyQuery }).then(res => {
      setProfileTabProducts(res.slice(0, 4));
    });
  }, [activeProfileTab]);

  const activeHero = banners[0] || {
    title: 'Discover the Art of Masculine Fragrance',
    subtitle: 'AB NOOR POUR HOMME',
    description: 'Explore an exclusive collection of commanding, luxurious fragrances crafted for the modern gentleman. Rare Cambodian agarwood, cordovan leather, and royal attars.',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1920&q=90',
    badge: 'ROYAL MASCULINE PRESTIGE',
  };

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      
      {/* SECTION 3: Hero Banner */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-brand-dark-forest text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={activeHero.image}
            alt="AB Noor Perfumes Royal Men's Collection"
            className="w-full h-full object-cover object-center scale-105 animate-pulse duration-[10000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark-forest/95 via-brand-dark-forest/80 to-transparent" />
          <div className="absolute inset-0 bg-brand-emerald/30 mix-blend-multiply" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-left duration-700">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-brand-gold/40 backdrop-blur-md">
              <Crown className="w-4 h-4 text-brand-gold" />
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-soft-gold">
                {activeHero.badge || 'THE ESSENCE OF MASCULINE ELEGANCE'}
              </span>
            </div>

            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight">
              The Essence of <span className="gold-shimmer font-serif italic">Masculine Elegance</span>
            </h1>

            <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-xl font-light">
              Explore an exclusive collection of commanding, luxurious fragrances crafted for the modern gentleman. Rare Cambodian agarwood, cordovan leather, dark Cuban tobacco, and opulent attars distilled for executive presence.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to="/shop"
                className="px-8 py-4 bg-brand-gold hover:bg-brand-soft-gold text-brand-dark-forest font-bold text-xs uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-brand-gold/20 transition-all hover:scale-105 flex items-center gap-2 group"
              >
                <span>Explore Men's Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/best-sellers"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-brand-soft-gold border border-brand-gold/40 font-semibold text-xs uppercase tracking-[0.2em] rounded-xl backdrop-blur-sm transition-all hover:border-brand-gold"
              >
                Gentlemen's Best Sellers
              </Link>
            </div>

            <div className="pt-8 border-t border-white/10 flex flex-wrap gap-6 text-xs text-stone-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-gold" />
                <span>100% Authentic Aged Ouds</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-gold" />
                <span>Alcohol-Free Pure Men's Attars</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-gold" />
                <span>Complimentary Delivery Above ₹2,499</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 4: Shop by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-gold">
            Gentlemen's Olfactory Realms
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-brand-emerald mt-2">
            Curated Men's Categories
          </h2>
          <p className="text-xs sm:text-sm text-brand-muted-grey mt-2">
            From vintage Cambodian agarwood distillations to cordovan saddle leather and boardroom citrus woods.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md hover:shadow-luxury transition-all duration-500 border border-stone-200"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-forest/90 via-brand-dark-forest/30 to-transparent" />
              
              <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 flex flex-col justify-end">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold mb-1">
                  Gentlemen's Realm
                </span>
                <h3 className="font-playfair font-bold text-lg sm:text-xl text-white group-hover:text-brand-soft-gold transition">
                  {cat.name}
                </h3>
                <div className="flex items-center gap-1 text-[11px] text-stone-300 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Explore Scents</span>
                  <ChevronRight className="w-3.5 h-3.5 text-brand-gold" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTION 5: Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-stone-200">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-gold">
              Masterpiece Formulations
            </span>
            <h2 className="font-playfair text-3xl font-bold text-brand-emerald mt-1">
              Featured Fragrances Pour Homme
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold uppercase tracking-wider text-brand-emerald hover:text-brand-gold flex items-center gap-1 mt-3 sm:mt-0 transition"
          >
            <span>View Full Men's Catalogue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* SECTION 8: Royal Oud & Smoked Leather Spotlight */}
      <section className="bg-brand-dark-forest py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(#C6A15B_1px,transparent_1px)] [background-size:20px_20px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-emerald border border-brand-gold/40 text-brand-gold text-[10px] font-bold tracking-[0.2em] uppercase">
                <Droplet className="w-3.5 h-3.5 text-brand-gold" />
                <span>COMMANDING OLFACTORY PRESENCE</span>
              </div>

              <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                Smoked Leather, Cuban Tobacco & <span className="gold-shimmer italic">Aged Agarwood</span>
              </h2>

              <p className="text-sm text-stone-300 leading-relaxed font-light">
                True authority does not demand attention; it quietly commands the room. We forge fragrances for the leader who understands the power of presence. Sourced from 25-year aged Cambodian agarwood and Cordovan saddle leathers.
              </p>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/10 text-xs">
                <div>
                  <strong className="block text-brand-gold font-playfair text-xl mb-1">35% - 40% Oil</strong>
                  <span className="text-stone-400">Private Reserve Extrait de Parfum</span>
                </div>
                <div>
                  <strong className="block text-brand-gold font-playfair text-xl mb-1">24+ Hour Sillage</strong>
                  <span className="text-stone-400">Unrivalled projection on skin & wool</span>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <Link
                  to="/category/leather"
                  className="px-6 py-3.5 bg-brand-gold hover:bg-brand-soft-gold text-brand-dark-forest font-bold text-xs uppercase tracking-widest rounded-xl transition shadow-lg"
                >
                  Explore Leather & Tobacco Scents
                </Link>
                <Link
                  to="/about"
                  className="text-xs font-semibold text-brand-soft-gold hover:underline"
                >
                  Our Distillation Heritage →
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden border-2 border-brand-gold/40 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1000&q=85"
                  alt="Men's Luxury Perfumery Heritage"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-brand-emerald p-6 rounded-2xl border border-brand-gold/50 shadow-2xl max-w-xs hidden sm:block">
                <span className="text-brand-gold text-[10px] font-bold tracking-widest uppercase block mb-1">
                  Gentlemen's Standard
                </span>
                <p className="text-xs text-stone-200">
                  "Every flacon sealed with our monogram represents the pinnacle of masculine Arabian luxury."
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 6: Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-stone-200">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-gold">
              Gentlemen's Signature Scents
            </span>
            <h2 className="font-playfair text-3xl font-bold text-brand-emerald mt-1">
              Best Sellers Pour Homme
            </h2>
          </div>
          <Link
            to="/best-sellers"
            className="text-xs font-bold uppercase tracking-wider text-brand-emerald hover:text-brand-gold flex items-center gap-1 mt-3 sm:mt-0 transition"
          >
            <span>View All Best Sellers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* SECTIONS 9, 10, 11: Curated Profile Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-gold">
            Bespoke Masculine Notes
          </span>
          <h2 className="font-playfair text-3xl font-bold text-brand-emerald mt-1">
            Curated Scent Profiles
          </h2>

          <div className="flex justify-center gap-2 mt-6 p-1 bg-stone-100 rounded-xl max-w-md mx-auto border border-stone-200">
            {[
              { id: 'smoky', label: 'Commanding & Smoky' },
              { id: 'amber', label: 'Dark Amber & Spice' },
              { id: 'fresh', label: 'Fresh & Boardroom' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveProfileTab(tab.id)}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition ${
                  activeProfileTab === tab.id
                    ? 'bg-brand-emerald text-brand-soft-gold shadow-sm'
                    : 'text-stone-600 hover:text-brand-emerald'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {profileTabProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* Scent Finder Quiz CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-dark-forest via-brand-emerald to-brand-dark-forest rounded-3xl p-8 sm:p-12 text-white border border-brand-gold/40 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-gold text-[10px] font-bold tracking-widest uppercase">
              <Compass className="w-3.5 h-3.5" />
              <span>GENTLEMAN'S SCENT CONSULTATION</span>
            </div>
            <h3 className="font-playfair text-2xl sm:text-3xl font-bold">
              Unsure which fragrance fits your signature style?
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              Take our interactive 60-second consultation. Match your presence—whether boardroom leadership, black-tie galas, or weekend leisure—with the ideal flacon.
            </p>
            <div className="pt-2">
              <Link
                to="/fragrance-finder"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-gold hover:bg-brand-soft-gold text-brand-dark-forest font-bold text-xs uppercase tracking-widest rounded-xl transition shadow-lg"
              >
                <span>Launch Scent Finder</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      {testimonials.length > 0 && (
        <section className="bg-stone-50 py-16 border-y border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-gold">
                Verified Gentlemen Experiences
              </span>
              <h2 className="font-playfair text-3xl font-bold text-brand-emerald mt-1">
                Words of Elegance
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div key={t.id} className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <Quote className="w-6 h-6 text-brand-gold/40 mb-3" />
                    <h5 className="font-playfair font-bold text-sm text-brand-emerald mb-2">
                      "{t.title}"
                    </h5>
                    <p className="text-xs text-stone-600 leading-relaxed italic">
                      "{t.comment}"
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-stone-800 block font-semibold">{t.userName}</strong>
                      <span className="text-[10px] text-brand-gold">{t.productName}</span>
                    </div>
                    {t.verifiedPurchase && (
                      <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-medium">
                        Verified Patron
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

    </div>
  );
};
