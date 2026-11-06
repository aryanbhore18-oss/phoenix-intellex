import React from 'react';
import Link from 'next/link';
import { UserPlus, Upload, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface OnboardingEmptyStateProps {
  title?: string;
  description?: string;
}

export function OnboardingEmptyState({
  title = 'No business records logged yet',
  description = 'Your database is initialized with zero sample data. Get started by adding your first enterprise client or importing an operational dataset into the Data Lab.',
}: OnboardingEmptyStateProps) {
  return (
    <div className="surface-card rounded-3xl p-8 sm:p-14 text-center max-w-2xl mx-auto my-8 relative overflow-hidden">
      {/* Background glow accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-[#0aa603]/15 rounded-full blur-2xl pointer-events-none" />

      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#026047] to-[#013d2d] text-[#fffde8] flex items-center justify-center mx-auto mb-5 border border-[#fffde8]/20 shadow-[0_0_30px_rgba(2,96,71,0.5)]">
        <Sparkles className="w-8 h-8 text-[#0aa603]" />
      </div>

      <h3 className="text-xl sm:text-2xl font-bold text-[#fffde8] mb-2 font-display">{title}</h3>
      <p className="text-xs sm:text-sm text-[#fffde8]/60 max-w-md mx-auto mb-8 leading-relaxed font-sans">
        {description}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
        <Link
          href="/clients"
          className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold shadow-lg"
        >
          <UserPlus className="w-4 h-4 text-[#fffde8]" />
          Add First Client Account
        </Link>

        <Link
          href="/data-lab"
          className="btn-secondary w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold"
        >
          <Upload className="w-4 h-4 text-[#fffde8]/70" />
          Import Dataset to Data Lab
          <ArrowRight className="w-3.5 h-3.5 text-[#0aa603]" />
        </Link>
      </div>

      <div className="mt-10 pt-6 border-t border-[#fffde8]/10 text-xs text-[#fffde8]/40 flex items-center justify-center gap-2 font-medium">
        <ShieldCheck className="w-3.5 h-3.5 text-[#0aa603]" />
        <span>Phoenix Intellex Secure Storage</span>
        <span>•</span>
        <span>Row-Level Security Active</span>
      </div>
    </div>
  );
}
