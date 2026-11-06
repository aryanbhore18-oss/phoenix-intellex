'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/app-context';
import { formatCurrencyINR, formatDate } from '@/lib/utils';
import { PaymentModal } from '@/components/revenue/payment-modal';
import {
  IndianRupee,
  Plus,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  CreditCard,
  Building2,
  Calendar,
} from 'lucide-react';
import { InvoiceStatus } from '@/types';

export default function RevenuePage() {
  const { invoices, payments, addPayment } = useApp();
  const [activeTab, setActiveTab] = useState<'invoices' | 'payments'>('invoices');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const now = new Date('2026-03-15');

  // Financial reconciliation calculations
  const totalInvoiced = invoices.reduce((acc, i) => acc + i.total_amount, 0);
  const totalReceived = payments.reduce((acc, p) => acc + p.amount_received, 0);
  const totalOutstanding = invoices.reduce((acc, i) => acc + i.outstanding_balance, 0);
  const overdueInvoicesCount = invoices.filter(
    (i) => i.status !== 'Paid' && i.status !== 'Cancelled' && new Date(i.due_date) < now
  ).length;

  // Filtered lists
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.client_name && inv.client_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredPayments = payments.filter((pay) => {
    return (
      (pay.invoice_number && pay.invoice_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (pay.client_name && pay.client_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (pay.reference_number && pay.reference_number.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#164A3A]">Revenue & Billing Ledger</h1>
          <p className="text-xs text-[#758078]">
            Invoice tracking, cash collection reconciliation, and partial payment management.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#164A3A] hover:bg-[#10382D] text-[#FAF7F0] text-xs font-semibold rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4 text-[#B89B5E]" />
          Record Payment
        </button>
      </div>

      {/* 4 Financial Reconciliation Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FAF7F0] p-4 rounded-xl border border-[#E3DED2] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-[#758078] uppercase">Total Invoiced</div>
            <div className="text-xl font-bold text-[#25342D]">{formatCurrencyINR(totalInvoiced)}</div>
            <div className="text-[10px] text-[#758078] mt-0.5">Accounts Receivable</div>
          </div>
          <FileText className="w-6 h-6 text-[#758078]" />
        </div>

        <div className="bg-[#FAF7F0] p-4 rounded-xl border border-[#E3DED2] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-[#758078] uppercase">Cash Collected</div>
            <div className="text-xl font-bold text-[#1b8755]">{formatCurrencyINR(totalReceived)}</div>
            <div className="text-[10px] text-[#1b8755] mt-0.5">Verified Bank Inflows</div>
          </div>
          <CreditCard className="w-6 h-6 text-[#1b8755]" />
        </div>

        <div className="bg-[#FAF7F0] p-4 rounded-xl border border-[#E3DED2] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-[#758078] uppercase">Outstanding Balance</div>
            <div className="text-xl font-bold text-[#c27d14]">{formatCurrencyINR(totalOutstanding)}</div>
            <div className="text-[10px] text-[#c27d14] mt-0.5">Unsettled Invoices</div>
          </div>
          <Clock className="w-6 h-6 text-[#c27d14]" />
        </div>

        <div className="bg-[#FAF7F0] p-4 rounded-xl border border-[#E3DED2] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-[#758078] uppercase">Overdue Invoices</div>
            <div className="text-xl font-bold text-[#c83232]">{overdueInvoicesCount}</div>
            <div className="text-[10px] text-[#c83232] mt-0.5">Follow-up Required</div>
          </div>
          <AlertCircle className="w-6 h-6 text-[#c83232]" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E3DED2]">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all ${
            activeTab === 'invoices'
              ? 'bg-[#FAF7F0] text-[#164A3A] border-t-2 border-x border-[#E3DED2] border-t-[#164A3A]'
              : 'text-[#758078] hover:text-[#25342D]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Invoices Ledger ({invoices.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all ${
            activeTab === 'payments'
              ? 'bg-[#FAF7F0] text-[#164A3A] border-t-2 border-x border-[#E3DED2] border-t-[#164A3A]'
              : 'text-[#758078] hover:text-[#25342D]'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Payments Ledger ({payments.length})</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#FAF7F0] p-4 rounded-xl border border-[#E3DED2] flex flex-col md:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#758078]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              activeTab === 'invoices'
                ? 'Search invoice # or client...'
                : 'Search payment ref or client...'
            }
            className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-lg border border-[#E3DED2] focus:outline-none focus:ring-1 focus:ring-[#164A3A] text-[#25342D]"
          />
        </div>

        {activeTab === 'invoices' && (
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-[#758078]">
              <Filter className="w-3.5 h-3.5" />
              <span className="font-medium">Status:</span>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white rounded-lg border border-[#E3DED2] text-[#25342D] focus:outline-none focus:ring-1 focus:ring-[#164A3A]"
            >
              <option value="all">All Invoices</option>
              <option value="Sent">Sent</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        )}
      </div>

      {/* Tables based on active tab */}
      <div className="bg-[#FAF7F0] rounded-xl border border-[#E3DED2] shadow-xs overflow-hidden">
        {activeTab === 'invoices' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F4EFE4]/60 border-b border-[#E3DED2] text-[#758078] font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Issue Date</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-right">Total Amount</th>
                  <th className="py-3 px-4 text-right">Paid</th>
                  <th className="py-3 px-4 text-right">Balance</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3DED2]/70 text-[#25342D]">
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-[#758078]">
                      No invoice records found.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((inv) => {
                    const isOverdue =
                      inv.status !== 'Paid' &&
                      inv.status !== 'Cancelled' &&
                      new Date(inv.due_date) < now;

                    return (
                      <tr key={inv.id} className="hover:bg-[#F4EFE4]/40 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-[#164A3A]">{inv.invoice_number}</td>
                        <td className="py-3.5 px-4 font-medium text-[#25342D]">{inv.client_name}</td>
                        <td className="py-3.5 px-4 text-[#758078]">{formatDate(inv.issue_date)}</td>
                        <td className="py-3.5 px-4">
                          <span className={isOverdue ? 'text-[#c83232] font-semibold' : 'text-[#758078]'}>
                            {formatDate(inv.due_date)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-medium">
                          {formatCurrencyINR(inv.total_amount)}
                        </td>
                        <td className="py-3.5 px-4 text-right font-semibold text-[#1b8755]">
                          {formatCurrencyINR(inv.amount_paid)}
                        </td>
                        <td className="py-3.5 px-4 text-right font-semibold text-[#c27d14]">
                          {formatCurrencyINR(inv.outstanding_balance)}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                              inv.status === 'Paid'
                                ? 'bg-[#1b8755]/15 text-[#1b8755]'
                                : inv.status === 'Partially Paid'
                                ? 'bg-[#B89B5E]/20 text-[#8E743A]'
                                : isOverdue
                                ? 'bg-[#c83232]/15 text-[#c83232]'
                                : 'bg-[#164A3A]/10 text-[#164A3A]'
                            }`}
                          >
                            {isOverdue && inv.status !== 'Partially Paid' ? 'Overdue' : inv.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F4EFE4]/60 border-b border-[#E3DED2] text-[#758078] font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Payment Date</th>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">UTR / Reference</th>
                  <th className="py-3 px-4">Notes</th>
                  <th className="py-3 px-4 text-right">Amount Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3DED2]/70 text-[#25342D]">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-[#758078]">
                      No payment transactions recorded.
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((pay) => (
                    <tr key={pay.id} className="hover:bg-[#F4EFE4]/40 transition-colors">
                      <td className="py-3.5 px-4 text-[#758078] font-medium">{formatDate(pay.payment_date)}</td>
                      <td className="py-3.5 px-4 font-bold text-[#164A3A]">{pay.invoice_number}</td>
                      <td className="py-3.5 px-4 font-medium text-[#25342D]">{pay.client_name}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-white border border-[#E3DED2] text-[10px] text-[#25342D] font-medium">
                          {pay.payment_method}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#758078] font-mono text-[11px]">
                        {pay.reference_number || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-[#758078] max-w-xs truncate">
                        {pay.notes || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-[#1b8755]">
                        {formatCurrencyINR(pay.amount_received)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment Settlement Modal */}
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addPayment}
      />
    </div>
  );
}
