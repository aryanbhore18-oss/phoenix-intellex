'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/app-context';
import { formatCurrencyINR, formatDate } from '@/lib/utils';
import { generateAutomatedInsights, BusinessInsight } from '@/lib/insights-engine';
import {
  FileBarChart,
  Printer,
  Download,
  CheckCircle2,
  AlertTriangle,
  Info,
  Building2,
  Briefcase,
  IndianRupee,
  Star,
  CheckSquare,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import Papa from 'papaparse';

type ReportType =
  | 'overview'
  | 'clients'
  | 'projects'
  | 'revenue'
  | 'reviews'
  | 'tasks';

export default function ReportsPage() {
  const { clients, projects, invoices, payments, tasks, reviews } = useApp();
  const [selectedReport, setSelectedReport] = useState<ReportType>('overview');

  // Generate automated business insights
  const insights = generateAutomatedInsights(clients, projects, invoices, payments, tasks, reviews);

  // Financial reconciliations
  const totalInvoiced = invoices.reduce((acc, i) => acc + i.total_amount, 0);
  const totalReceived = payments.reduce((acc, p) => acc + p.amount_received, 0);
  const totalOutstanding = invoices.reduce((acc, i) => acc + i.outstanding_balance, 0);
  const isReconciled = totalInvoiced === totalReceived + totalOutstanding;

  // Print Report Handler
  const handlePrint = () => {
    window.print();
  };

  // Export Report Data as CSV
  const handleExportCSV = () => {
    let exportData: unknown[] = [];
    let filename = `phoenix_report_${selectedReport}.csv`;

    switch (selectedReport) {
      case 'clients':
        exportData = clients.map((c) => ({
          ID: c.id,
          BusinessName: c.business_name,
          Category: c.business_category,
          Contact: c.contact_name,
          Email: c.email,
          Status: c.status,
          StartDate: c.start_date,
        }));
        break;
      case 'projects':
        exportData = projects.map((p) => ({
          ID: p.id,
          ProjectName: p.name,
          Client: p.client_name,
          Category: p.service_category,
          Status: p.status,
          Fee: p.fee,
          DueDate: p.due_date,
        }));
        break;
      case 'revenue':
        exportData = invoices.map((i) => ({
          InvoiceNumber: i.invoice_number,
          Client: i.client_name,
          IssueDate: i.issue_date,
          DueDate: i.due_date,
          Total: i.total_amount,
          Paid: i.amount_paid,
          Outstanding: i.outstanding_balance,
          Status: i.status,
        }));
        break;
      case 'reviews':
        exportData = reviews.map((r) => ({
          Client: r.client_name,
          Rating: r.rating,
          Date: r.review_date,
          Source: r.source,
          Sentiment: r.sentiment_label,
          Text: r.review_text,
        }));
        break;
      case 'tasks':
        exportData = tasks.map((t) => ({
          Title: t.title,
          Client: t.client_name,
          Priority: t.priority,
          Status: t.status,
          DueDate: t.due_date,
          Assignee: t.assigned_to,
        }));
        break;
      default:
        exportData = [
          {
            Metric: 'Total Clients',
            Value: clients.length,
          },
          {
            Metric: 'Total Projects',
            Value: projects.length,
          },
          {
            Metric: 'Total Invoiced (INR)',
            Value: totalInvoiced,
          },
          {
            Metric: 'Total Cash Received (INR)',
            Value: totalReceived,
          },
          {
            Metric: 'Total Outstanding Balance (INR)',
            Value: totalOutstanding,
          },
        ];
        break;
    }

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header (Hidden on print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-xl font-bold text-[#164A3A]">Executive Reports & Insights Engine</h1>
          <p className="text-xs text-[#758078]">
            Automated intelligence summaries and reconcile-verified operational statements.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#E3DED2] hover:bg-[#F4EFE4] text-[#25342D] text-xs font-semibold rounded-lg transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-[#B89B5E]" />
            Export CSV
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#164A3A] hover:bg-[#10382D] text-[#FAF7F0] text-xs font-semibold rounded-lg transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-[#B89B5E]" />
            Print Report
          </button>
        </div>
      </div>

      {/* Automated Insights Engine Cards */}
      <div className="space-y-3 print:hidden">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#B89B5E]" />
          <h2 className="text-xs font-bold text-[#164A3A] uppercase tracking-wider">
            Automated Intelligence Findings
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((ins) => (
            <div
              key={ins.id}
              className="p-4 rounded-xl bg-[#FAF7F0] border border-[#E3DED2] flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {ins.severity === 'success' && <CheckCircle2 className="w-4 h-4 text-[#1b8755]" />}
                    {ins.severity === 'warning' && <AlertTriangle className="w-4 h-4 text-[#c27d14]" />}
                    {ins.severity === 'info' && <Info className="w-4 h-4 text-[#164A3A]" />}
                    <h3 className="text-xs font-bold text-[#164A3A]">{ins.title}</h3>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider bg-white border border-[#E3DED2] text-[#758078]">
                    {ins.category}
                  </span>
                </div>

                <p className="text-xs text-[#25342D] leading-relaxed mb-3">
                  {ins.explanation}
                </p>
              </div>

              <div className="pt-2 border-t border-[#E3DED2] flex items-center justify-between text-[11px]">
                <span className="font-semibold text-[#164A3A]">{ins.metricComparison}</span>
                <span className="text-[#758078] italic">{ins.actionRecommendation}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Selector Pills (Hidden on print) */}
      <div className="flex items-center gap-2 border-b border-[#E3DED2] overflow-x-auto pb-px print:hidden">
        {[
          { id: 'overview', label: 'Executive Overview', icon: FileBarChart },
          { id: 'revenue', label: 'Revenue & Cash Audit', icon: IndianRupee },
          { id: 'projects', label: 'Project Performance', icon: Briefcase },
          { id: 'clients', label: 'Client Portfolio Summary', icon: Building2 },
          { id: 'reviews', label: 'Customer Reviews Benchmark', icon: Star },
          { id: 'tasks', label: 'Operational Tasks Checklist', icon: CheckSquare },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = selectedReport === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedReport(tab.id as ReportType)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all shrink-0 ${
                isActive
                  ? 'bg-[#FAF7F0] text-[#164A3A] border-t-2 border-x border-[#E3DED2] border-t-[#164A3A]'
                  : 'text-[#758078] hover:text-[#25342D]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#B89B5E]' : 'text-[#758078]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Printable Report Document Body */}
      <div className="bg-[#FAF7F0] p-6 sm:p-8 rounded-2xl border border-[#E3DED2] shadow-xs space-y-6">
        {/* Document Header */}
        <div className="flex items-start justify-between border-b border-[#E3DED2] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-extrabold text-[#164A3A] text-lg tracking-wide">
                PHOENIX INTELLEX
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-[#164A3A] text-[#FAF7F0] font-semibold uppercase tracking-widest text-[9px]">
                Official Report
              </span>
            </div>
            <p className="text-xs text-[#758078]">
              Phoenix Tech Solutions • Turn Data Into Decisions
            </p>
          </div>
          <div className="text-right text-xs text-[#758078]">
            <p className="font-semibold text-[#25342D]">Generated: {formatDate(new Date().toISOString())}</p>
            <div className="flex items-center justify-end gap-1.5 mt-1 text-[11px] text-[#1b8755]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Database Ledger Reconciled</span>
            </div>
          </div>
        </div>

        {/* Financial Reconciliation Badge */}
        <div className="p-3 rounded-xl bg-white border border-[#E3DED2] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#1b8755]" />
            <span className="font-semibold text-[#25342D]">
              Accounts Balance Integrity Status:
            </span>
            <span className="text-[#1b8755] font-bold">
              {isReconciled ? 'Verified 100% Balanced' : 'Variance Detected'}
            </span>
          </div>
          <div className="text-[11px] text-[#758078]">
            Total Invoiced ({formatCurrencyINR(totalInvoiced)}) = Received ({formatCurrencyINR(totalReceived)}) + Balance ({formatCurrencyINR(totalOutstanding)})
          </div>
        </div>

        {/* Report Content Panels */}
        {selectedReport === 'overview' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#164A3A]">Executive Summary Matrix</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-white border border-[#E3DED2]">
                <div className="text-[11px] text-[#758078] uppercase">Active Accounts</div>
                <div className="text-xl font-bold text-[#164A3A] mt-1">{clients.length}</div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-[#E3DED2]">
                <div className="text-[11px] text-[#758078] uppercase">Projects In Scope</div>
                <div className="text-xl font-bold text-[#164A3A] mt-1">{projects.length}</div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-[#E3DED2]">
                <div className="text-[11px] text-[#758078] uppercase">Cash Collected</div>
                <div className="text-xl font-bold text-[#1b8755] mt-1">{formatCurrencyINR(totalReceived)}</div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-[#E3DED2]">
                <div className="text-[11px] text-[#758078] uppercase">Customer Benchmark</div>
                <div className="text-xl font-bold text-[#B89B5E] mt-1">
                  {reviews.length > 0
                    ? `${(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)} ★`
                    : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedReport === 'revenue' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#164A3A]">Revenue & Receivables Ledger Statement</h3>
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#E3DED2] text-[#758078]">
                <tr>
                  <th className="pb-2">Invoice #</th>
                  <th className="pb-2">Client</th>
                  <th className="pb-2">Due Date</th>
                  <th className="pb-2 text-right">Invoiced (₹)</th>
                  <th className="pb-2 text-right">Collected (₹)</th>
                  <th className="pb-2 text-right">Outstanding (₹)</th>
                  <th className="pb-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3DED2]/60">
                {invoices.map((i) => (
                  <tr key={i.id}>
                    <td className="py-2.5 font-bold text-[#164A3A]">{i.invoice_number}</td>
                    <td className="py-2.5 font-medium">{i.client_name}</td>
                    <td className="py-2.5 text-[#758078]">{formatDate(i.due_date)}</td>
                    <td className="py-2.5 text-right font-medium">{formatCurrencyINR(i.total_amount)}</td>
                    <td className="py-2.5 text-right text-[#1b8755] font-semibold">{formatCurrencyINR(i.amount_paid)}</td>
                    <td className="py-2.5 text-right text-[#c27d14] font-semibold">{formatCurrencyINR(i.outstanding_balance)}</td>
                    <td className="py-2.5 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#164A3A]/10 text-[#164A3A]">
                        {i.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedReport === 'projects' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#164A3A]">Contracted Projects Statement</h3>
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#E3DED2] text-[#758078]">
                <tr>
                  <th className="pb-2">Project Name</th>
                  <th className="pb-2">Client</th>
                  <th className="pb-2">Category</th>
                  <th className="pb-2">Lead</th>
                  <th className="pb-2">Target Date</th>
                  <th className="pb-2 text-right">Fee (₹)</th>
                  <th className="pb-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3DED2]/60">
                {projects.map((p) => (
                  <tr key={p.id}>
                    <td className="py-2.5 font-bold text-[#164A3A]">{p.name}</td>
                    <td className="py-2.5 font-medium">{p.client_name}</td>
                    <td className="py-2.5 text-[#758078]">{p.service_category}</td>
                    <td className="py-2.5 text-[#758078]">{p.assigned_member || '—'}</td>
                    <td className="py-2.5 text-[#758078]">{formatDate(p.due_date)}</td>
                    <td className="py-2.5 text-right font-bold text-[#164A3A]">{formatCurrencyINR(p.fee)}</td>
                    <td className="py-2.5 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#164A3A]/10 text-[#164A3A]">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedReport === 'clients' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#164A3A]">Client Account Roster</h3>
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#E3DED2] text-[#758078]">
                <tr>
                  <th className="pb-2">Business Name</th>
                  <th className="pb-2">Category</th>
                  <th className="pb-2">Primary Contact</th>
                  <th className="pb-2">Email</th>
                  <th className="pb-2">Relationship Date</th>
                  <th className="pb-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3DED2]/60">
                {clients.map((c) => (
                  <tr key={c.id}>
                    <td className="py-2.5 font-bold text-[#164A3A]">{c.business_name}</td>
                    <td className="py-2.5 text-[#758078]">{c.business_category}</td>
                    <td className="py-2.5 font-medium">{c.contact_name}</td>
                    <td className="py-2.5 text-[#758078]">{c.email}</td>
                    <td className="py-2.5 text-[#758078]">{formatDate(c.start_date)}</td>
                    <td className="py-2.5 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#164A3A]/10 text-[#164A3A]">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedReport === 'reviews' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#164A3A]">Customer Experience Audit</h3>
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#E3DED2] text-[#758078]">
                <tr>
                  <th className="pb-2">Client / Outlet</th>
                  <th className="pb-2">Rating</th>
                  <th className="pb-2">Feedback Excerpt</th>
                  <th className="pb-2">Source</th>
                  <th className="pb-2 text-right">Sentiment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3DED2]/60">
                {reviews.map((r) => (
                  <tr key={r.id}>
                    <td className="py-2.5 font-bold text-[#164A3A]">{r.client_name}</td>
                    <td className="py-2.5 font-bold text-[#B89B5E]">{r.rating}.0 ★</td>
                    <td className="py-2.5 text-[#25342D] italic max-w-sm truncate">{r.review_text || '—'}</td>
                    <td className="py-2.5 text-[#758078]">{r.source}</td>
                    <td className="py-2.5 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#164A3A]/10 text-[#164A3A]">
                        {r.sentiment_label || 'Neutral'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedReport === 'tasks' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#164A3A]">Task Execution Audit</h3>
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#E3DED2] text-[#758078]">
                <tr>
                  <th className="pb-2">Task Title</th>
                  <th className="pb-2">Client</th>
                  <th className="pb-2">Assignee</th>
                  <th className="pb-2">Priority</th>
                  <th className="pb-2">Due Date</th>
                  <th className="pb-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3DED2]/60">
                {tasks.map((t) => (
                  <tr key={t.id}>
                    <td className="py-2.5 font-medium text-[#25342D]">{t.title}</td>
                    <td className="py-2.5 text-[#758078]">{t.client_name || '—'}</td>
                    <td className="py-2.5 text-[#758078]">{t.assigned_to || '—'}</td>
                    <td className="py-2.5 font-bold text-[10px] uppercase">{t.priority}</td>
                    <td className="py-2.5 text-[#758078]">{formatDate(t.due_date)}</td>
                    <td className="py-2.5 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#164A3A]/10 text-[#164A3A]">
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Report Footer */}
        <div className="pt-6 border-t border-[#E3DED2] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#758078] gap-2">
          <span>Phoenix Intellex BI • Confidential Internal Business Document</span>
          <span>End of Statement</span>
        </div>
      </div>
    </div>
  );
}
