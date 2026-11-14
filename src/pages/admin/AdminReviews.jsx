import React, { useState, useEffect } from 'react';
import { reviewService } from '../../services/reviewService';
import { StarRating } from '../../components/common/StarRating';
import { Check, X, Trash2, Star, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReviews = async () => {
    setLoading(true);
    const data = await reviewService.getAllReviews();
    setReviews(data);
    setLoading(false);
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    await reviewService.updateReviewStatus(id, status);
    toast.success(`Review ${status}.`);
    loadReviews();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this review permanently?')) {
      await reviewService.deleteReview(id);
      toast.info('Review deleted.');
      loadReviews();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-playfair text-2xl font-bold text-brand-emerald">
          Customer Review Moderation Queue
        </h1>
        <p className="text-xs text-stone-500">
          Moderate, verify, approve, or reject olfactory reviews submitted by patrons.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-stone-200">
            <thead className="bg-stone-50 text-[11px] font-bold uppercase tracking-wider text-stone-500">
              <tr>
                <th className="py-3 px-4">Fragrance</th>
                <th className="py-3 px-4">Patron</th>
                <th className="py-3 px-4">Rating & Headline</th>
                <th className="py-3 px-4">Comment</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {reviews.map((r) => (
                <tr key={r.id} className="hover:bg-stone-50/60 transition">
                  <td className="py-3 px-4 font-semibold text-brand-emerald">
                    {r.productName}
                  </td>
                  <td className="py-3 px-4">
                    <strong className="text-stone-800 block">{r.userName}</strong>
                    {r.verifiedPurchase && (
                      <span className="text-[10px] text-emerald-700 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Verified Purchase
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <StarRating rating={r.rating} size={12} showNumber={false} />
                    <strong className="text-stone-800 block mt-1 font-semibold">"{r.title}"</strong>
                  </td>
                  <td className="py-3 px-4 text-stone-600 max-w-xs truncate">
                    {r.comment}
                  </td>
                  <td className="py-3 px-4 text-stone-400 text-[11px]">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      r.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    {r.status !== 'approved' && (
                      <button
                        onClick={() => handleUpdateStatus(r.id, 'approved')}
                        className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                        title="Approve"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    {r.status !== 'rejected' && (
                      <button
                        onClick={() => handleUpdateStatus(r.id, 'rejected')}
                        className="p-1 text-amber-600 hover:bg-amber-50 rounded"
                        title="Reject"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="p-1 text-stone-400 hover:text-rose-600 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
