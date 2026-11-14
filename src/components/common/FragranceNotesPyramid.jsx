import React from 'react';
import { Sparkles, Heart, Flame } from 'lucide-react';

export const FragranceNotesPyramid = ({ topNotes = [], middleNotes = [], baseNotes = [] }) => {
  return (
    <div className="bg-stone-50 border border-brand-gold/30 rounded-xl p-6">
      <div className="text-center mb-6">
        <span className="text-[11px] font-semibold tracking-[0.2em] text-brand-gold uppercase">
          Olfactory Architecture
        </span>
        <h4 className="font-playfair text-xl text-brand-emerald mt-1">
          Fragrance Notes Pyramid
        </h4>
        <p className="text-xs text-brand-muted-grey mt-1">
          A three-tiered symphony of precious essences distilled by our master perfumers.
        </p>
      </div>

      <div className="space-y-4 max-w-xl mx-auto">
        {/* Top Notes */}
        <div className="relative p-4 rounded-lg bg-white border border-stone-200 shadow-sm transition hover:border-brand-gold">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-emerald">
                Top Notes
              </span>
              <span className="text-[11px] text-brand-muted-grey ml-2">
                (First 15-30 minutes)
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {topNotes.map((note, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 text-xs font-medium bg-amber-50/70 text-amber-900 border border-amber-200/60 rounded-full"
              >
                {note}
              </span>
            ))}
          </div>
        </div>

        {/* Heart / Middle Notes */}
        <div className="relative p-4 rounded-lg bg-white border border-stone-200 shadow-sm transition hover:border-brand-gold">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="p-1.5 bg-rose-50 text-rose-600 rounded">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-emerald">
                Heart / Middle Notes
              </span>
              <span className="text-[11px] text-brand-muted-grey ml-2">
                (The Soul, hours 2-6)
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {middleNotes.map((note, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 text-xs font-medium bg-rose-50/70 text-rose-900 border border-rose-200/60 rounded-full"
              >
                {note}
              </span>
            ))}
          </div>
        </div>

        {/* Base Notes */}
        <div className="relative p-4 rounded-lg bg-white border border-stone-200 shadow-sm transition hover:border-brand-gold">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="p-1.5 bg-emerald-50 text-brand-emerald rounded">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-emerald">
                Base Notes
              </span>
              <span className="text-[11px] text-brand-muted-grey ml-2">
                (Deep Sillage, 8-24+ hours)
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {baseNotes.map((note, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 text-xs font-medium bg-emerald-50/70 text-emerald-950 border border-emerald-200/60 rounded-full"
              >
                {note}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
