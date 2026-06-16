'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Loader2, ArrowLeft, Video } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  
  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/settings`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Dark Hero Top Section */}
      <div className="auth-hero-gradient relative overflow-hidden" style={{ minHeight: '260px' }}>
        {/* Floating neon orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[500px] h-[300px] opacity-40">
            <div className="absolute top-6 left-1/4 w-3 h-3 rounded-full bg-purple-400 animate-pulse" />
            <div className="absolute top-12 left-1/2 w-2 h-2 rounded-full bg-fuchsia-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="absolute top-4 right-1/4 w-2.5 h-2.5 rounded-full bg-violet-300 animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center pt-10 pb-16 px-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20">
              <Video size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">VidAgent AI</span>
          </div>

          {/* Tagline */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2 text-center">
            Recover Account
          </h1>
          <p className="text-sm text-purple-200/70 text-center max-w-xs">
            Enter your email to reset your password
          </p>
        </div>
      </div>

      {/* White Card Section */}
      <div className="flex-1 flex flex-col items-center bg-white -mt-8 rounded-t-3xl relative z-20 px-4 pt-10 pb-8">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold text-[#1E1B4B] text-center mb-1">Reset Password</h2>
          <p className="text-sm text-[#78767B] text-center mb-8">We will send you a link to recover your account</p>

          {error && (
            <div className="p-3 text-sm rounded-xl mb-6 bg-red-50 text-red-500 border border-red-200">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 text-sm rounded-xl mb-6 bg-green-50 text-green-600 border border-green-200">
              Check your email for the password reset link!
            </div>
          )}

          <form onSubmit={handleReset} className="space-y-5">
            <div>
              <label htmlFor="reset-email" className="block text-sm font-medium text-[#1E1B4B] mb-1.5">Email Address</label>
              <input
                id="reset-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-11 px-4 rounded-xl border border-[#E5E3EB] bg-white text-[#1E1B4B] text-sm placeholder:text-[#B8B6BC] outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || success}
              className="w-full h-12 rounded-xl btn-gradient text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Send Reset Link →
            </button>
          </form>

          {/* Footer link */}
          <div className="mt-8 flex justify-center">
            <Link href="/login" className="flex items-center gap-1.5 text-sm font-semibold text-[#7C3AED] hover:text-[#6D28D9] transition-colors">
              <ArrowLeft size={16} />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
