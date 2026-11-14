import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: 'What makes AB Noor Perfumes unique compared to commercial perfumes?',
      a: 'We reject industrial mass-production and high-percentage alcohol fillers. Our extraits de parfum boast a 35% to 40% oil concentration, and our pure attars are 100% alcohol-free concentrated oils aged over natural sandalwood and amber bases for up to 36 hours of sillage.',
    },
    {
      q: 'What is the difference between Extrait de Parfum and Eau de Parfum (EDP)?',
      a: 'Extrait de Parfum is the highest concentration of fragrance available in fine perfumery, typically containing 30% to 40% precious perfume oils. It evolves slowly over 16-24+ hours. Eau de Parfum contains 18% to 25% fragrance oil, designed for sparkling opening projection across 8-14 hours.',
    },
    {
      q: 'How should I apply 100% pure attar perfume oils?',
      a: 'Use the crystal or brass applicator wand to place a single drop onto each wrist, then gently press into the pulse points behind your ears and neck. Do not rub the oil aggressively, as friction breaks the delicate top notes.',
    },
    {
      q: 'Are your agarwood (oud) oils natural or synthetic?',
      a: 'Every drop of our Dehn Al Oud originates from genuine wild and organically cultivated Aquilaria trees in Koh Kong (Cambodia), Assam (India), and Trat (Thailand), steam-distilled and aged in private cellars for decades.',
    },
    {
      q: 'How long does shipping take and is Cash on Delivery available?',
      a: 'All orders are dispatched within 24 business hours from Mumbai via Blue Dart Luxury Express. Transit takes 1-3 business days in major metros and 3-4 days nationwide. Cash on Delivery (COD) is available across all serviceable Indian PIN codes.',
    },
    {
      q: 'What is your return and exchange policy?',
      a: 'Because fragrances are intimate cosmetic items, opened perfume bottles cannot be returned for hygiene and authenticity assurance. However, if your shipment arrives damaged or tampered in transit, notify us within 48 hours for immediate replacement.',
    },
    {
      q: 'Can I request bespoke gift packaging for weddings or corporate events?',
      a: 'Yes. Our concierge team creates custom velvet-lined wooden coffrets with personalized gold calligraphy messages and wax seals. Contact concierge@abnoorperfumes.com for bespoke commissions.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-gold flex items-center justify-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5" /> FREQUENTLY ASKED QUESTIONS
        </span>
        <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-brand-emerald">
          Patron Inquiries & Guidance
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 font-light leading-relaxed">
          Essential insights into our formulation philosophy, concentration distinctions, and royal ordering processes.
        </p>
      </div>

      {/* Accordion List */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm divide-y divide-stone-100">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div key={idx} className="py-5 first:pt-0 last:pb-0">
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full flex items-center justify-between text-left text-sm font-bold text-brand-emerald hover:text-brand-gold transition gap-4"
              >
                <span>{faq.q}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-brand-gold shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="mt-3 text-xs text-stone-600 leading-relaxed font-light animate-in fade-in duration-200">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
