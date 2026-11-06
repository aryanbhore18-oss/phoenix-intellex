'use client';

import React, { useState } from 'react';
import {
  Settings,
  Building2,
  ShieldCheck,
  User,
  Database,
  Lock,
  Save,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function SettingsPage() {
  const [companyName, setCompanyName] = useState('Phoenix Tech Solutions');
  const [tagline, setTagline] = useState('Turn Data Into Decisions');
  const [currency, setCurrency] = useState('INR (₹)');
  const [sessionTimeout, setSessionTimeout] = useState('8 Hours');
  const [dataRetentionMonths, setDataRetentionMonths] = useState('24 Months');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#164A3A]">Application Settings</h1>
        <p className="text-xs text-[#758078]">
          Enterprise system configuration, currency localization, security parameters, and data governance.
        </p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-xl bg-[#1b8755]/15 border border-[#1b8755]/30 flex items-center gap-2.5 text-xs text-[#1b8755]">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="font-semibold">Workspace configuration preferences saved successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand & Organization Profile */}
        <div className="bg-[#FAF7F0] p-6 rounded-2xl border border-[#E3DED2] shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E3DED2] pb-3">
            <Building2 className="w-4 h-4 text-[#164A3A]" />
            <h2 className="text-sm font-bold text-[#164A3A]">Organization Identity</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#25342D] mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white rounded-lg border border-[#E3DED2] focus:outline-none focus:ring-1 focus:ring-[#164A3A] text-[#25342D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#25342D] mb-1">Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white rounded-lg border border-[#E3DED2] focus:outline-none focus:ring-1 focus:ring-[#164A3A] text-[#25342D]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#25342D] mb-1">
                Default Currency
              </label>
              <input
                type="text"
                disabled
                value={currency}
                className="w-full px-3 py-2 text-xs bg-[#F4EFE4] rounded-lg border border-[#E3DED2] text-[#758078] cursor-not-allowed"
              />
              <p className="text-[10px] text-[#758078] mt-1">Fixed to Indian Rupee (INR ₹) standard.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#25342D] mb-1">
                Data Retention Window
              </label>
              <select
                value={dataRetentionMonths}
                onChange={(e) => setDataRetentionMonths(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white rounded-lg border border-[#E3DED2] focus:outline-none focus:ring-1 focus:ring-[#164A3A] text-[#25342D]"
              >
                <option value="12 Months">12 Months</option>
                <option value="24 Months">24 Months</option>
                <option value="36 Months">36 Months</option>
                <option value="Indefinite">Indefinite (Compliant)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Access Control & Security Policies */}
        <div className="bg-[#FAF7F0] p-6 rounded-2xl border border-[#E3DED2] shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E3DED2] pb-3">
            <Lock className="w-4 h-4 text-[#164A3A]" />
            <h2 className="text-sm font-bold text-[#164A3A]">Access Control & Security</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-[#E3DED2]">
              <div>
                <p className="font-semibold text-[#25342D]">Row Level Security (RLS)</p>
                <p className="text-[11px] text-[#758078]">
                  Enforces database-level permission policies so unauthenticated queries return 0 rows.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#1b8755]/15 text-[#1b8755] uppercase">
                Active & Enforced
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-[#E3DED2]">
              <div>
                <p className="font-semibold text-[#25342D]">Registration Mode</p>
                <p className="text-[11px] text-[#758078]">
                  Unrestricted public signup is disabled. Access is invite-only and requires administrator approval.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#164A3A]/15 text-[#164A3A] uppercase">
                Approval Required
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-[#E3DED2]">
              <div>
                <p className="font-semibold text-[#25342D]">Client Secrets Protection</p>
                <p className="text-[11px] text-[#758078]">
                  Supabase Service-Role key and server credentials are never delivered to the client bundle.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#1b8755]/15 text-[#1b8755] uppercase">
                Protected
              </span>
            </div>
          </div>
        </div>

        {/* Database & Storage Details */}
        <div className="bg-[#FAF7F0] p-6 rounded-2xl border border-[#E3DED2] shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E3DED2] pb-3">
            <Database className="w-4 h-4 text-[#164A3A]" />
            <h2 className="text-sm font-bold text-[#164A3A]">Database Architecture</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-white border border-[#E3DED2]">
              <span className="text-[#758078] block">Database Engine</span>
              <span className="font-bold text-[#164A3A] text-sm">PostgreSQL 15+</span>
            </div>
            <div className="p-3 rounded-lg bg-white border border-[#E3DED2]">
              <span className="text-[#758078] block">Primary Key Standard</span>
              <span className="font-bold text-[#164A3A] text-sm">UUID v4</span>
            </div>
            <div className="p-3 rounded-lg bg-white border border-[#E3DED2]">
              <span className="text-[#758078] block">Financial Reconcile</span>
              <span className="font-bold text-[#1b8755] text-sm">Verified Reconciled</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#164A3A] hover:bg-[#10382D] text-[#FAF7F0] text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <Save className="w-4 h-4 text-[#B89B5E]" />
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
}
