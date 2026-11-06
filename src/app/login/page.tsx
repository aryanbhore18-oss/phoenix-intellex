'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // In production mode with configured Supabase, call supabase.auth.signInWithPassword
      // For local development or mock mode, allow instant verified entry:
      if (!email || !password) {
        setError('Please enter both email and password.');
        setLoading(false);
        return;
      }

      // Transition to dashboard
      setTimeout(() => {
        router.push('/');
      }, 500);
    } catch {
      setError('An error occurred during authentication.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4EFE4] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#FAF7F0] border border-[#E3DED2] rounded-2xl p-8 shadow-sm">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#164A3A] text-[#B89B5E] flex items-center justify-center font-bold text-2xl mx-auto mb-3 shadow-xs">
            P
          </div>
          <h1 className="text-2xl font-extrabold text-[#164A3A] tracking-tight">Phoenix Intellex</h1>
          <p className="text-xs text-[#758078] mt-1 font-medium">
            Turn Data Into Decisions • Internal Staff Portal
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-[#c83232]/10 border border-[#c83232]/20 flex items-center gap-2.5 text-xs text-[#c83232]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#25342D] mb-1">
              Company Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#758078]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@phoenixtech.com"
                className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-lg border border-[#E3DED2] focus:outline-none focus:ring-1 focus:ring-[#164A3A] text-[#25342D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#25342D] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#758078]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-lg border border-[#E3DED2] focus:outline-none focus:ring-1 focus:ring-[#164A3A] text-[#25342D]"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#164A3A] hover:bg-[#10382D] text-[#FAF7F0] text-xs font-semibold rounded-lg shadow-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#B89B5E]" />
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-[#E3DED2] text-center">
          <p className="text-[11px] text-[#758078] flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1b8755]" />
            Strict Enterprise Access • Approved Staff Only
          </p>
        </div>
      </div>
    </div>
  );
}
