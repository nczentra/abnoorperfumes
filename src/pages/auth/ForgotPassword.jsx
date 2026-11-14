import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MonogramLogo } from '../../components/common/MonogramLogo';
import { Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send password recovery instructions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl border border-stone-200/80 p-8 sm:p-10 shadow-xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <MonogramLogo variant="dark" />
          </div>
          <h2 className="font-playfair text-2xl font-bold text-brand-emerald">
            Password Recovery
          </h2>
          <p className="text-xs text-stone-500 font-light">
            Enter your email to receive password reset instructions.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
            {error}
          </div>
        )}

        {sent ? (
          <div className="p-6 text-center bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
            <CheckCircle2 className="w-10 h-10 text-brand-emerald mx-auto" />
            <h4 className="font-playfair text-lg font-bold text-brand-emerald">Instructions Sent</h4>
            <p className="text-xs text-stone-600">
              We have dispatched password recovery instructions to <strong>{email}</strong>.
            </p>
            <div className="pt-2">
              <Link
                to="/login"
                className="text-xs font-bold text-brand-emerald underline"
              >
                Return to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-stone-600 font-bold uppercase tracking-wider mb-1">
                Account Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="patron@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-emerald"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-brand-emerald hover:bg-brand-dark-forest text-brand-soft-gold rounded-xl font-bold text-xs uppercase tracking-widest transition shadow-lg shadow-brand-emerald/20 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 text-brand-gold" />
              <span>{loading ? 'Sending...' : 'Send Recovery Email'}</span>
            </button>
          </form>
        )}

        <div className="text-center text-xs text-stone-500 pt-2 border-t border-stone-100">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-brand-emerald font-semibold hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
