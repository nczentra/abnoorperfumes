import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MonogramLogo } from '../../components/common/MonogramLogo';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles, LogIn } from 'lucide-react';
import { toast } from 'sonner';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/account/overview';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Welcome back to AB Noor Perfumes');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      await loginWithGoogle();
      toast.success('Signed in via Google successfully');
      navigate(from, { replace: true });
    } catch (err) {
      setError('Google sign-in could not be completed.');
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@abnoorperfumes.com');
    setPassword('admin123');
  };

  const fillDemoPatron = () => {
    setEmail('patron@example.com');
    setPassword('patron123');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl border border-stone-200/80 p-8 sm:p-10 shadow-xl space-y-6">
        
        {/* Monogram Crest */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <MonogramLogo variant="dark" />
          </div>
          <h2 className="font-playfair text-2xl font-bold text-brand-emerald">
            Patron Sign In
          </h2>
          <p className="text-xs text-stone-500 font-light">
            Access your orders, bespoke wishlist, and loyalty benefits.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-stone-600 font-bold uppercase tracking-wider mb-1">
              Email Address
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

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-stone-600 font-bold uppercase tracking-wider">
                Password
              </label>
              <Link to="/forgot-password" className="text-brand-emerald hover:underline text-[11px]">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-emerald"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-brand-emerald hover:bg-brand-dark-forest text-brand-soft-gold rounded-xl font-bold text-xs uppercase tracking-widest transition shadow-lg shadow-brand-emerald/20 flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4 text-brand-gold" />
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Google Sign-in */}
        <div className="space-y-3">
          <div className="relative flex items-center justify-center">
            <div className="border-t border-stone-200 w-full" />
            <span className="bg-white px-3 text-[11px] text-stone-400 uppercase font-semibold">Or</span>
            <div className="border-t border-stone-200 w-full" />
          </div>

          <button
            onClick={handleGoogleSignIn}
            type="button"
            className="w-full py-2.5 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-50 transition flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Quick Demo Fill Buttons */}
        <div className="pt-2 border-t border-stone-100 space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block text-center">
            Instant Preview Access
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="py-1.5 px-2 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-[10px] font-bold hover:bg-amber-100 transition"
            >
              Fill Admin Credentials
            </button>
            <button
              type="button"
              onClick={fillDemoPatron}
              className="py-1.5 px-2 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-lg text-[10px] font-bold hover:bg-emerald-100 transition"
            >
              Fill Patron Credentials
            </button>
          </div>
        </div>

        {/* Register Link */}
        <div className="text-center text-xs text-stone-500 pt-2">
          New to AB Noor?{' '}
          <Link to="/register" className="text-brand-emerald font-bold hover:underline">
            Create an Account
          </Link>
        </div>

      </div>
    </div>
  );
};
