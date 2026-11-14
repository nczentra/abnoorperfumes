import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MonogramLogo } from '../../components/common/MonogramLogo';
import { Lock, Mail, User, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await register({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      toast.success('Your royal account has been created!', {
        description: 'Enjoy 10% off with promo code WELCOME10',
      });
      navigate('/account/overview');
    } catch (err) {
      setError(err.message || 'Registration could not be completed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl border border-stone-200/80 p-8 sm:p-10 shadow-xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <MonogramLogo variant="dark" />
          </div>
          <h2 className="font-playfair text-2xl font-bold text-brand-emerald">
            Register as a Patron
          </h2>
          <p className="text-xs text-stone-500 font-light">
            Receive exclusive invitations to private reserves and track your orders.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-stone-600 font-bold uppercase tracking-wider mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. Tariq Al-Mansoor"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-emerald"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-600 font-bold uppercase tracking-wider mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="patron@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-emerald"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-600 font-bold uppercase tracking-wider mb-1">
              Mobile Number (for Delivery SMS)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-emerald"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-600 font-bold uppercase tracking-wider mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-emerald"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-600 font-bold uppercase tracking-wider mb-1">
                Confirm *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-emerald"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 text-stone-600">
            <input
              type="checkbox"
              id="terms"
              checked={formData.agreeTerms}
              onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
              className="accent-brand-emerald rounded"
            />
            <label htmlFor="terms" className="text-[11px]">
              I agree to the{' '}
              <Link to="/terms" className="text-brand-emerald underline">Terms</Link> and{' '}
              <Link to="/privacy-policy" className="text-brand-emerald underline">Privacy Policy</Link>.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !formData.agreeTerms}
            className="w-full py-3.5 bg-brand-emerald hover:bg-brand-dark-forest text-brand-soft-gold rounded-xl font-bold text-xs uppercase tracking-widest transition shadow-lg shadow-brand-emerald/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4 text-brand-gold" />
          </button>
        </form>

        <div className="text-center text-xs text-stone-500 pt-2 border-t border-stone-100">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-emerald font-bold hover:underline">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};
