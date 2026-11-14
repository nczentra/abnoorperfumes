import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { ProductCard } from '../../components/product/ProductCard';
import { 
  Compass, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Droplet, 
  Clock, 
  Crown,
  Briefcase,
  Flame,
  Award
} from 'lucide-react';

export const FragranceFinder = () => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    persona: 'executive',
    family: '',
    occasion: '',
    longevity: '',
  });

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleSelect = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      findRecommendations();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const findRecommendations = async () => {
    setLoading(true);
    setCompleted(true);
    const allProducts = await productService.getProducts();

    let matches = allProducts.filter(p => {
      let score = 0;
      if (answers.family && (p.fragranceFamily?.toLowerCase().includes(answers.family.toLowerCase()) || p.name?.toLowerCase().includes(answers.family.toLowerCase()))) score += 3;
      if (answers.longevity && p.longevity?.includes(answers.longevity)) score += 2;
      if (answers.occasion && p.occasion?.toLowerCase().includes(answers.occasion.toLowerCase())) score += 2;
      if (answers.persona === 'executive' && (p.fragranceFamily?.toLowerCase().includes('leather') || p.fragranceFamily?.toLowerCase().includes('wood') || p.fragranceFamily?.toLowerCase().includes('tobacco'))) score += 3;
      if (answers.persona === 'traditionalist' && (p.fragranceFamily?.toLowerCase().includes('oud') || p.concentration?.toLowerCase().includes('attar'))) score += 3;
      if (answers.persona === 'aristocrat' && (p.fragranceFamily?.toLowerCase().includes('citrus') || p.fragranceFamily?.toLowerCase().includes('amber'))) score += 3;
      return score > 0;
    });

    if (matches.length === 0) {
      matches = allProducts.slice(0, 3);
    }

    setRecommendations(matches.slice(0, 3));
    setLoading(false);
  };

  const resetQuiz = () => {
    setStep(1);
    setAnswers({
      persona: 'executive',
      family: '',
      occasion: '',
      longevity: '',
    });
    setCompleted(false);
    setRecommendations([]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      
      {/* Intro Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-emerald text-brand-soft-gold text-[10px] font-bold tracking-widest uppercase">
          <Compass className="w-3.5 h-3.5 text-brand-gold" />
          <span>GENTLEMAN'S SCENT CONSULTATION</span>
        </div>
        <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-brand-emerald">
          Gentleman's Fragrance Finder
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 font-light leading-relaxed">
          Allow our master perfumers to curate your signature masculine olfactory aura in four thoughtful steps.
        </p>
      </div>

      {!completed ? (
        <div className="bg-white rounded-3xl border border-brand-gold/30 p-8 sm:p-12 shadow-xl space-y-8">
          
          {/* Progress Indicator */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-brand-emerald uppercase tracking-wider">
              <span>Step {step} of 4</span>
              <span>
                {step === 1 ? "Gentleman's Persona" : 
                 step === 2 ? 'Olfactory Realm' : 
                 step === 3 ? 'Wearing Occasion' : 
                 'Concentration & Longevity'}
              </span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-brand-gold h-full transition-all duration-300 rounded-full"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* STEP 1: Gentleman Persona */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-playfair text-xl font-bold text-brand-emerald text-center">
                What defines your commanding presence and style?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                {[
                  { 
                    id: 'executive', 
                    title: 'The Executive Leader', 
                    icon: Briefcase,
                    desc: 'Cordovan leather, roasted tobacco leaf, and smoky vetiver commanding respect in every room.' 
                  },
                  { 
                    id: 'traditionalist', 
                    title: 'The Royal Traditionalist', 
                    icon: Crown,
                    desc: 'Aged 25-year Cambodian Dehn Al Oud, pure deer musk attar, and precious agarwood heritage.' 
                  },
                  { 
                    id: 'aristocrat', 
                    title: 'The Modern Aristocrat', 
                    icon: Award,
                    desc: 'Sparkling Mediterranean bergamot, dark ambergris, crushed cardamom, and refined white oud.' 
                  },
                ].map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelect('persona', opt.id)}
                      className={`p-6 rounded-2xl border text-left transition ${
                        answers.persona === opt.id
                          ? 'border-brand-emerald bg-brand-emerald/5 ring-2 ring-brand-emerald shadow-md'
                          : 'border-stone-200 hover:border-brand-gold bg-stone-50'
                      }`}
                    >
                      <Icon className="w-6 h-6 text-brand-gold mb-3" />
                      <h4 className="font-playfair font-bold text-base text-brand-emerald mb-1">
                        {opt.title}
                      </h4>
                      <p className="text-xs text-stone-500 leading-relaxed">
                        {opt.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Olfactory Family */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-playfair text-xl font-bold text-brand-emerald text-center">
                Which aromatic realm excites your senses?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {[
                  { id: 'Oud', title: 'Rare Agarwood & Amber', desc: 'Aged Cambodian Dehn Al Oud, frankincense resin, and dark ocean ambergris.' },
                  { id: 'Leather', title: 'Dark Leather & Smoked Tobacco', desc: 'Cordovan leather, dark Cuban tobacco, roasted coffee, and vetiver.' },
                  { id: 'Frankincense', title: 'Spiced Woods & Frankincense', desc: 'Royal Green Hojari frankincense, cashmeran, cedarwood, and nutmeg.' },
                  { id: 'Musk', title: 'Royal Deer Musk & Sandalwood', desc: 'Cruelty-free heritage musk accords aged over vintage Mysore sandalwood.' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect('family', opt.id)}
                    className={`p-5 rounded-2xl border text-left transition ${
                      answers.family === opt.id
                        ? 'border-brand-emerald bg-brand-emerald/5 ring-2 ring-brand-emerald shadow-md'
                        : 'border-stone-200 hover:border-brand-gold bg-stone-50'
                    }`}
                  >
                    <Droplet className="w-5 h-5 text-brand-gold mb-2" />
                    <h4 className="font-playfair font-bold text-base text-brand-emerald mb-1">
                      {opt.title}
                    </h4>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      {opt.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Occasion */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-playfair text-xl font-bold text-brand-emerald text-center">
                Where will you primarily wear this signature scent?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {[
                  { id: 'Executive', title: 'Boardroom & High-Stakes Leadership', desc: 'Executive meetings, formal conferences, commanding distinction.' },
                  { id: 'Royal', title: 'Royal Galas & Grand Banquets', desc: 'Intense projection, high-impact presence, and an unforgettable sillage.' },
                  { id: 'Evening', title: 'Private Soirées & Intimate Evenings', desc: 'Warm amber, sensual musk, and close-proximity magnetic elegance.' },
                  { id: 'Daily', title: 'Daily Signature & Daytime Distinction', desc: 'Crisp bergamot, clean white oud, and all-day refined freshness.' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect('occasion', opt.id)}
                    className={`p-5 rounded-2xl border text-left transition ${
                      answers.occasion === opt.id
                        ? 'border-brand-emerald bg-brand-emerald/5 ring-2 ring-brand-emerald shadow-md'
                        : 'border-stone-200 hover:border-brand-gold bg-stone-50'
                    }`}
                  >
                    <Flame className="w-5 h-5 text-brand-gold mb-2" />
                    <h4 className="font-playfair font-bold text-base text-brand-emerald mb-1">
                      {opt.title}
                    </h4>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      {opt.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Longevity & Concentration */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-playfair text-xl font-bold text-brand-emerald text-center">
                What is your preferred concentration & longevity?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                {[
                  { id: '12', title: '10 - 14 Hours', desc: 'Eau de Parfum (EDP) with 20% pure perfume oil concentration' },
                  { id: '24', title: '18 - 24+ Hours', desc: 'Extrait de Parfum Private Reserve with 35-40% oil concentration' },
                  { id: '36', title: '24 - 36+ Hours', desc: '100% Pure Alcohol-Free Artisanal Concentrated Perfume Oil Attar' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect('longevity', opt.id)}
                    className={`p-6 rounded-2xl border text-left transition ${
                      answers.longevity === opt.id
                        ? 'border-brand-emerald bg-brand-emerald/5 ring-2 ring-brand-emerald shadow-md'
                        : 'border-stone-200 hover:border-brand-gold bg-stone-50'
                    }`}
                  >
                    <Clock className="w-5 h-5 text-brand-gold mb-3" />
                    <h4 className="font-playfair font-bold text-base text-brand-emerald mb-1">
                      {opt.title}
                    </h4>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      {opt.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Nav Controls */}
          <div className="flex justify-between items-center pt-6 border-t border-stone-200">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="px-6 py-2.5 border border-stone-300 text-stone-700 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-stone-50 transition"
              >
                Previous Step
              </button>
            ) : <div />}

            <button
              onClick={handleNext}
              className="px-8 py-3 bg-brand-emerald hover:bg-brand-dark-forest text-brand-soft-gold text-xs font-bold uppercase tracking-widest rounded-xl transition shadow-lg shadow-brand-emerald/20 flex items-center gap-2"
            >
              <span>{step === 4 ? 'Reveal Bespoke Matches' : 'Continue'}</span>
              <ArrowRight className="w-4 h-4 text-brand-gold" />
            </button>
          </div>

        </div>
      ) : (
        /* Results Section */
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="bg-brand-dark-forest rounded-3xl p-8 text-white text-center border border-brand-gold/40 shadow-xl space-y-3">
            <Sparkles className="w-8 h-8 text-brand-gold mx-auto animate-bounce" />
            <h3 className="font-playfair text-2xl sm:text-3xl font-bold">
              Your Bespoke Gentleman's Scent Profile
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 font-light max-w-md mx-auto">
              Curated exclusively for the modern gentleman seeking commanding presence and artisanal Arabian excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div className="text-center pt-6">
            <button
              onClick={resetQuiz}
              className="inline-flex items-center gap-2 px-6 py-2.5 border border-stone-300 rounded-xl text-xs font-semibold text-stone-600 hover:text-brand-emerald hover:border-brand-emerald transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Gentleman Consultation</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
