'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/app-context';
import { formatCurrencyINR, formatDate } from '@/lib/utils';
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Globe,
  Briefcase,
  Star,
  IndianRupee,
  CheckSquare,
  History,
} from 'lucide-react';

interface ClientProfileProps {
  params: Promise<{ id: string }>;
}

function ClientProfileContent({ clientId }: { clientId: string }) {
  const { clients, projects, reviews, invoices, payments, tasks } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'reviews' | 'invoices' | 'tasks' | 'history'>('overview');

  const client = clients.find((c) => c.id === clientId);

  if (!client) {
    return (
      <div className="bg-[#FAF7F0] p-8 rounded-xl border border-[#E3DED2] text-center">
        <p className="text-sm font-semibold text-[#164A3A]">Client record not found</p>
        <Link href="/clients" className="mt-3 inline-block text-xs text-[#B89B5E] underline">
          Return to directory
        </Link>
      </div>
    );
  }

  // Filter linked resources
  const clientProjects = projects.filter((p) => p.client_id === clientId);
  const clientReviews = reviews.filter((r) => r.client_id === clientId);
  const clientInvoices = invoices.filter((i) => i.client_id === clientId);
  const clientPayments = payments.filter((p) => {
    const inv = invoices.find((i) => i.id === p.invoice_id);
    return inv && inv.client_id === clientId;
  });
  const clientTasks = tasks.filter((t) => t.client_id === clientId);

  // Financial aggregates
  const totalBilled = clientInvoices.reduce((acc, i) => acc + i.total_amount, 0);
  const totalPaid = clientPayments.reduce((acc, p) => acc + p.amount_received, 0);
  const totalOutstanding = Math.max(0, totalBilled - totalPaid);

  const avgReviewRating =
    clientReviews.length > 0
      ? (clientReviews.reduce((acc, r) => acc + r.rating, 0) / clientReviews.length).toFixed(1)
      : null;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Return */}
      <div className="flex items-center gap-3">
        <Link
          href="/clients"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#164A3A] hover:text-[#B89B5E] bg-[#FAF7F0] px-3 py-1.5 rounded-lg border border-[#E3DED2]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Client Directory
        </Link>
      </div>

      {/* Client Profile Header Banner */}
      <div className="bg-[#FAF7F0] p-6 rounded-2xl border border-[#E3DED2] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#164A3A] text-[#FAF7F0] flex items-center justify-center font-bold text-2xl shrink-0 shadow-xs border border-[#B89B5E]/30">
            {client.business_name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-[#164A3A]">{client.business_name}</h1>
              <span
                className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                  client.status === 'active'
                    ? 'bg-[#1b8755]/15 text-[#1b8755]'
                    : client.status === 'pending'
                    ? 'bg-[#c27d14]/15 text-[#c27d14]'
                    : 'bg-[#758078]/15 text-[#758078]'
                }`}
              >
                {client.status}
              </span>
            </div>
            <p className="text-xs text-[#758078] mt-0.5">{client.business_category} • Client since {formatDate(client.start_date)}</p>

            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-[#25342D]">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#758078]" />
                {client.email}
              </span>
              {client.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#758078]" />
                  {client.phone}
                </span>
              )}
              {client.website_url && (
                <a
                  href={client.website_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-[#164A3A] hover:underline"
                >
                  <Globe className="w-3.5 h-3.5 text-[#758078]" />
                  Visit Website
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-[#E3DED2] pt-4 md:pt-0 md:pl-6">
          <div>
            <div className="text-[11px] text-[#758078] font-semibold uppercase">Total Paid</div>
            <div className="text-lg font-bold text-[#164A3A]">{formatCurrencyINR(totalPaid)}</div>
          </div>
          <div>
            <div className="text-[11px] text-[#758078] font-semibold uppercase">Outstanding</div>
            <div className="text-lg font-bold text-[#c27d14]">{formatCurrencyINR(totalOutstanding)}</div>
          </div>
          <div>
            <div className="text-[11px] text-[#758078] font-semibold uppercase">Rating</div>
            <div className="text-lg font-bold text-[#B89B5E]">{avgReviewRating ? `${avgReviewRating} ★` : '—'}</div>
          </div>
        </div>
      </div>

      {/* Profile Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E3DED2] pb-px overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: Building2 },
          { id: 'projects', label: `Projects (${clientProjects.length})`, icon: Briefcase },
          { id: 'reviews', label: `Reviews (${clientReviews.length})`, icon: Star },
          { id: 'invoices', label: `Invoices & Payments (${clientInvoices.length})`, icon: IndianRupee },
          { id: 'tasks', label: `Tasks (${clientTasks.length})`, icon: CheckSquare },
          { id: 'history', label: 'Activity History', icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all shrink-0 ${
                isActive
                  ? 'bg-[#FAF7F0] text-[#164A3A] border-t-2 border-x border-[#E3DED2] border-t-[#164A3A]'
                  : 'text-[#758078] hover:text-[#25342D] hover:bg-[#FAF7F0]/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#B89B5E]' : 'text-[#758078]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="bg-[#FAF7F0] p-6 rounded-2xl border border-[#E3DED2] shadow-xs">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[#164A3A]">Engagement Overview</h3>
              <div className="p-4 rounded-xl bg-white border border-[#E3DED2] space-y-3 text-xs">
                <div>
                  <span className="text-[#758078] block">Primary Contact Person</span>
                  <span className="font-semibold text-[#25342D]">{client.contact_name}</span>
                </div>
                <div>
                  <span className="text-[#758078] block">Client Relationship Start</span>
                  <span className="font-semibold text-[#25342D]">{formatDate(client.start_date)}</span>
                </div>
                <div>
                  <span className="text-[#758078] block">Purchased Capability Solutions</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {client.services_purchased.map((svc) => (
                      <span
                        key={svc}
                        className="px-2 py-0.5 rounded bg-[#F4EFE4] text-[#164A3A] font-semibold text-[11px]"
                      >
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[#164A3A]">Internal Account Notes</h3>
              <div className="p-4 rounded-xl bg-white border border-[#E3DED2] text-xs text-[#25342D] leading-relaxed min-h-[120px]">
                {client.notes ? client.notes : 'No internal notes recorded for this account.'}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#164A3A]">Contracted Projects</h3>
            {clientProjects.length === 0 ? (
              <p className="text-xs text-[#758078]">No projects registered under this client yet.</p>
            ) : (
              <div className="space-y-3">
                {clientProjects.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-xl bg-white border border-[#E3DED2] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-[#164A3A]">{p.name}</h4>
                      <p className="text-[11px] text-[#758078] mt-0.5">{p.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-[#758078]">
                        <span>Category: {p.service_category}</span>
                        <span>•</span>
                        <span>Due: {formatDate(p.due_date)}</span>
                        {p.assigned_member && (
                          <>
                            <span>•</span>
                            <span>Lead: {p.assigned_member}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-[#25342D]">{formatCurrencyINR(p.fee)}</div>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#164A3A]/10 text-[#164A3A]">
                        {p.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#164A3A]">Customer Smart Reviews</h3>
            {clientReviews.length === 0 ? (
              <p className="text-xs text-[#758078]">No customer reviews logged for this business.</p>
            ) : (
              <div className="space-y-3">
                {clientReviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl bg-white border border-[#E3DED2] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#B89B5E]">{rev.rating} ★</span>
                        <span className="text-[11px] text-[#758078]">via {rev.source}</span>
                      </div>
                      <span className="text-[11px] text-[#758078]">{formatDate(rev.review_date)}</span>
                    </div>
                    <p className="text-xs text-[#25342D] italic">"{rev.review_text}"</p>
                    {rev.sentiment_label && (
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          rev.sentiment_label === 'Positive'
                            ? 'bg-[#1b8755]/15 text-[#1b8755]'
                            : 'bg-[#c83232]/15 text-[#c83232]'
                        }`}
                      >
                        Sentiment: {rev.sentiment_label}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#164A3A]">Invoices & Payment Transactions</h3>
            {clientInvoices.length === 0 ? (
              <p className="text-xs text-[#758078]">No invoices issued for this client yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[#E3DED2] text-[#758078]">
                    <tr>
                      <th className="pb-2">Invoice #</th>
                      <th className="pb-2">Due Date</th>
                      <th className="pb-2 text-right">Total</th>
                      <th className="pb-2 text-right">Paid</th>
                      <th className="pb-2 text-right">Balance</th>
                      <th className="pb-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E3DED2]/60">
                    {clientInvoices.map((inv) => (
                      <tr key={inv.id}>
                        <td className="py-2.5 font-bold text-[#164A3A]">{inv.invoice_number}</td>
                        <td className="py-2.5 text-[#758078]">{formatDate(inv.due_date)}</td>
                        <td className="py-2.5 text-right font-medium">{formatCurrencyINR(inv.total_amount)}</td>
                        <td className="py-2.5 text-right text-[#1b8755] font-medium">{formatCurrencyINR(inv.amount_paid)}</td>
                        <td className="py-2.5 text-right text-[#c27d14] font-medium">{formatCurrencyINR(inv.outstanding_balance)}</td>
                        <td className="py-2.5 text-right">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#164A3A]/10 text-[#164A3A]">
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#164A3A]">Associated Deliverables & Tasks</h3>
            {clientTasks.length === 0 ? (
              <p className="text-xs text-[#758078]">No tasks linked with this client account.</p>
            ) : (
              <div className="space-y-2">
                {clientTasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-3 rounded-lg bg-white border border-[#E3DED2] flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="text-xs font-semibold text-[#25342D]">{t.title}</p>
                      <span className="text-[11px] text-[#758078]">Due: {formatDate(t.due_date)}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#164A3A]/10 text-[#164A3A]">
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#164A3A]">Activity Audit Log</h3>
            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E3DED2]">
              <div className="relative">
                <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[#164A3A] border-2 border-[#FAF7F0]" />
                <p className="text-xs font-semibold text-[#25342D]">Account created in Phoenix Intellex</p>
                <p className="text-[11px] text-[#758078]">{formatDate(client.created_at)}</p>
              </div>
              <div className="relative">
                <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[#B89B5E] border-2 border-[#FAF7F0]" />
                <p className="text-xs font-semibold text-[#25342D]">Account information updated</p>
                <p className="text-[11px] text-[#758078]">{formatDate(client.updated_at)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default async function ClientDetailPage({ params }: ClientProfileProps) {
  const { id } = await params;
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#758078] text-xs">Loading client profile...</div>}>
      <ClientProfileContent clientId={id} />
    </Suspense>
  );
}
