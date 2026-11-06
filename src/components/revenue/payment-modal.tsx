'use client';

import React, { useState } from 'react';
import { X, IndianRupee, Calendar, CreditCard, FileText, AlertCircle } from 'lucide-react';
import { useApp } from '@/context/app-context';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    invoice_id: string;
    invoice_number?: string;
    client_name?: string;
    payment_date: string;
    amount_received: number;
    payment_method: string;
    reference_number?: string;
    notes?: string;
  }) => void;
}

const PAYMENT_METHODS = [
  'NEFT / Bank Transfer',
  'RTGS',
  'UPI / IMPS',
  'Cheque',
  'Credit Card',
  'Cash',
];

export function PaymentModal({ isOpen, onClose, onSubmit }: PaymentModalProps) {
  const { invoices } = useApp();
  // Filter invoices that still have an outstanding balance
  const unpaidInvoices = invoices.filter((i) => i.outstanding_balance > 0);

  const [invoiceId, setInvoiceId] = useState(unpaidInvoices[0]?.id || invoices[0]?.id || '');
  const [amount, setAmount] = useState<string>('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [method, setMethod] = useState(PAYMENT_METHODS[0]);
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedInvoice = invoices.find((i) => i.id === invoiceId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = Number(amount);

    if (!invoiceId || !numericAmount || numericAmount <= 0) {
      setError('Please select an invoice and enter a valid positive payment amount.');
      return;
    }

    if (selectedInvoice && numericAmount > selectedInvoice.outstanding_balance) {
      setError(
        `Payment amount cannot exceed the invoice's outstanding balance of ₹${selectedInvoice.outstanding_balance.toLocaleString('en-IN')}.`
      );
      return;
    }

    onSubmit({
      invoice_id: invoiceId,
      invoice_number: selectedInvoice?.invoice_number,
      client_name: selectedInvoice?.client_name,
      payment_date: paymentDate,
      amount_received: numericAmount,
      payment_method: method,
      reference_number: reference.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-[#FAF7F0] border border-[#E3DED2] rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E3DED2]">
          <h2 className="text-base font-bold text-[#164A3A]">Record Payment Settlement</h2>
          <button onClick={onClose} className="p-1 rounded-md text-[#758078] hover:text-[#25342D]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-[#c83232]/10 border border-[#c83232]/20 flex items-center gap-2 text-xs text-[#c83232]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#25342D] mb-1">
              Associated Invoice *
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#758078]" />
              <select
                value={invoiceId}
                onChange={(e) => {
                  setInvoiceId(e.target.value);
                  const inv = invoices.find((i) => i.id === e.target.value);
                  if (inv) setAmount(inv.outstanding_balance.toString());
                }}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-lg border border-[#E3DED2] focus:outline-none focus:ring-1 focus:ring-[#164A3A] text-[#25342D]"
              >
                {invoices.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.invoice_number} — {inv.client_name} (Balance: ₹{inv.outstanding_balance.toLocaleString('en-IN')})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#25342D] mb-1">
                Amount Received (₹) *
              </label>
              <div className="relative">
                <IndianRupee className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#758078]" />
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="50000"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-lg border border-[#E3DED2] focus:outline-none focus:ring-1 focus:ring-[#164A3A] text-[#25342D]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#25342D] mb-1">Payment Date</label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#758078]" />
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-lg border border-[#E3DED2] focus:outline-none focus:ring-1 focus:ring-[#164A3A] text-[#25342D]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#25342D] mb-1">Payment Method</label>
              <div className="relative">
                <CreditCard className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#758078]" />
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-lg border border-[#E3DED2] focus:outline-none focus:ring-1 focus:ring-[#164A3A] text-[#25342D]"
                >
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#25342D] mb-1">
                Reference / UTR #
              </label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="UTR2026031599"
                className="w-full px-3 py-2 text-xs bg-white rounded-lg border border-[#E3DED2] focus:outline-none focus:ring-1 focus:ring-[#164A3A] text-[#25342D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#25342D] mb-1">Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Milestone 2 settlement, bank clearance note..."
              className="w-full px-3 py-2 text-xs bg-white rounded-lg border border-[#E3DED2] focus:outline-none focus:ring-1 focus:ring-[#164A3A] text-[#25342D]"
            />
          </div>

          <div className="pt-3 border-t border-[#E3DED2] flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#758078] hover:text-[#25342D] rounded-lg hover:bg-[#F4EFE4]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-[#164A3A] hover:bg-[#10382D] text-[#FAF7F0] rounded-lg shadow-xs"
            >
              Record Settlement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
