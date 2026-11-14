import React from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({ rating = 5, reviewCount, size = 16, showNumber = true, className = '' }) => {
  const rounded = Math.round(rating * 2) / 2;

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center gap-0.5 text-brand-gold">
        {[1, 2, 3, 4, 5].map((starIndex) => (
          <Star
            key={starIndex}
            size={size}
            className={`${
              starIndex <= rating
                ? 'fill-brand-gold text-brand-gold'
                : starIndex - 0.5 <= rating
                ? 'fill-brand-gold/50 text-brand-gold'
                : 'text-stone-300'
            }`}
          />
        ))}
      </div>

      {showNumber && (
        <span className="text-xs font-medium text-brand-charcoal ml-0.5">
          {Number(rating).toFixed(1)}
        </span>
      )}

      {reviewCount !== undefined && (
        <span className="text-xs text-brand-muted-grey">
          ({reviewCount})
        </span>
      )}
    </div>
  );
};
