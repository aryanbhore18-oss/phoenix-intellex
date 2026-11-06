'use client';

import React, { useState } from 'react';
import { X, Building2, User, Mail, Phone, Globe, Tag, AlertCircle, Sparkles } from 'lucide-react';
import { ClientStatus } from '@/types';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    business_name: string;
    business_category: string;
    contact_name: string;
    email: string;
    phone?: string;
    website_url?: string;
    services_purchased: string[];
    status: ClientStatus;
    start_date: string;
    notes?: string;
  }) => void;
}

// Categories and capabilities matching Phoenix Tech Solutions services page
const CATEGORIES = [
  'Workflow Automation & AI Systems',
  'High-Performance Web Engineering',
  'Digital Transformation Consulting',
  'Autonomous AI Agents & Chatbots',
  'E-Commerce & Headless Architecture',
  'Healthcare & Life Sciences',
  'Logistics & Supply Chain',
  'Retail & FMCG',
  'Other',
];

const AVAILABLE_SERVICES = [
  'Intelligent Workflow Automation',
  'Autonomous AI Agents',
  'High-Performance Web Apps',
  'Smart Review QR System',
  'Headless E-Commerce',
  'Social Analytics & Growth',
];

export function ClientModal({ isOpen, onClose, onSubmit }: ClientModalProps) {
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([AVAILABLE_SERVICES[0]]);
  const [status, setStatus] = useState<ClientStatus>('active');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleService = (svc: string) => {
    if (selectedServices.includes(svc)) {
      setSelectedServices(selectedServices.filter((s) => s !== svc));
    } else {
      setSelectedServices([...selectedServices, svc]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !contactName.trim() || !email.trim()) {
      setError('Please fill in business name, contact person, and email.');
      return;
    }

    onSubmit({
      business_name: businessName.trim(),
      business_category: category,
      contact_name: contactName.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      website_url: websiteUrl.trim() || undefined,
      services_purchased: selectedServices,
      status,
      start_date: startDate,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="surface-card rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-[#fffde8]/15 bg-[#0f1c16]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#fffde8]/10 bg-[#0a1410]/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#026047] text-[#fffde8]">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#fffde8] font-display">Add Enterprise Client</h2>
              <p className="text-[11px] text-[#fffde8]/50">Log new corporate client and contracted capabilities</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#fffde8]/60 hover:text-[#fffde8] hover:bg-[#fffde8]/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-[#ef4444]/15 border border-[#ef4444]/30 flex items-center gap-2 text-xs text-[#ef4444]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#fffde8]/80 mb-1.5">
                Business Name *
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#fffde8]/40" />
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Apex Global Logistics"
                  className="w-full pl-10 pr-3 py-2.5 text-xs bg-[#101e18] rounded-xl border border-[#fffde8]/10 focus:outline-none focus:ring-1 focus:ring-[#0aa603] text-[#fffde8] placeholder-[#fffde8]/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#fffde8]/80 mb-1.5">
                Industry / Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 text-xs bg-[#101e18] rounded-xl border border-[#fffde8]/10 focus:outline-none focus:ring-1 focus:ring-[#0aa603] text-[#fffde8]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-[#101e18] text-[#fffde8]">
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#fffde8]/80 mb-1.5">
                Primary Contact *
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#fffde8]/40" />
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full pl-10 pr-3 py-2.5 text-xs bg-[#101e18] rounded-xl border border-[#fffde8]/10 focus:outline-none focus:ring-1 focus:ring-[#0aa603] text-[#fffde8] placeholder-[#fffde8]/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#fffde8]/80 mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#fffde8]/40" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@company.com"
                  className="w-full pl-10 pr-3 py-2.5 text-xs bg-[#101e18] rounded-xl border border-[#fffde8]/10 focus:outline-none focus:ring-1 focus:ring-[#0aa603] text-[#fffde8] placeholder-[#fffde8]/40"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#fffde8]/80 mb-1.5">Phone</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#fffde8]/40" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98000 00000"
                  className="w-full pl-10 pr-3 py-2.5 text-xs bg-[#101e18] rounded-xl border border-[#fffde8]/10 focus:outline-none focus:ring-1 focus:ring-[#0aa603] text-[#fffde8] placeholder-[#fffde8]/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#fffde8]/80 mb-1.5">Website URL</label>
              <div className="relative">
                <Globe className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#fffde8]/40" />
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://company.com"
                  className="w-full pl-10 pr-3 py-2.5 text-xs bg-[#101e18] rounded-xl border border-[#fffde8]/10 focus:outline-none focus:ring-1 focus:ring-[#0aa603] text-[#fffde8] placeholder-[#fffde8]/40"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#fffde8]/80 mb-2">
              Capabilities Contracted
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_SERVICES.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => toggleService(s)}
                  className={`text-xs px-3 py-1.5 rounded-xl border font-semibold flex items-center gap-1.5 transition-all ${
                    selectedServices.includes(s)
                      ? 'bg-[#026047] text-[#fffde8] border-[#0aa603] shadow-[0_0_15px_rgba(10,166,3,0.3)]'
                      : 'bg-[#101e18] text-[#fffde8]/60 border-[#fffde8]/10 hover:border-[#fffde8]/25'
                  }`}
                >
                  <Tag className="w-3 h-3" />
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#fffde8]/80 mb-1.5">Client Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ClientStatus)}
                className="w-full px-3 py-2.5 text-xs bg-[#101e18] rounded-xl border border-[#fffde8]/10 focus:outline-none focus:ring-1 focus:ring-[#0aa603] text-[#fffde8]"
              >
                <option value="active" className="bg-[#101e18]">Active Partner</option>
                <option value="pending" className="bg-[#101e18]">Pending Onboarding</option>
                <option value="archived" className="bg-[#101e18]">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#fffde8]/80 mb-1.5">Engagement Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2.5 text-xs bg-[#101e18] rounded-xl border border-[#fffde8]/10 focus:outline-none focus:ring-1 focus:ring-[#0aa603] text-[#fffde8]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#fffde8]/80 mb-1.5">Internal Account Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Key stakeholders, service level agreements, or roadmap scope..."
              className="w-full px-3.5 py-2.5 text-xs bg-[#101e18] rounded-xl border border-[#fffde8]/10 focus:outline-none focus:ring-1 focus:ring-[#0aa603] text-[#fffde8] placeholder-[#fffde8]/40"
            />
          </div>

          <div className="pt-4 border-t border-[#fffde8]/10 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#fffde8]/60 hover:text-[#fffde8] rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary px-5 py-2.5 text-xs font-bold rounded-xl"
            >
              Save Client Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
