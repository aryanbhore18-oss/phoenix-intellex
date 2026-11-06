'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/app-context';
import { formatDate } from '@/lib/utils';
import { ClientModal } from '@/components/clients/client-modal';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  Building2,
  ExternalLink,
  Archive,
  CheckCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ClientStatus } from '@/types';

export default function ClientsPage() {
  const { clients, addClient, updateClient } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter clients
  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || c.business_category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = Array.from(new Set(clients.map((c) => c.business_category)));

  const handleArchiveToggle = (id: string, currentStatus: ClientStatus) => {
    const nextStatus: ClientStatus = currentStatus === 'archived' ? 'active' : 'archived';
    updateClient(id, { status: nextStatus });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#fffde8] font-display">
            Client Directory & Corporate Accounts
          </h1>
          <p className="text-xs text-[#fffde8]/60 mt-0.5">
            Enterprise clients, strategic partnerships, and deployed digital capability contracts.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl shadow-lg"
        >
          <Plus className="w-4 h-4 text-[#fffde8]" />
          Add Client Account
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="surface-card p-4 rounded-2xl flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-88">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#fffde8]/40" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search business, contact person, or email..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-[#101e18] rounded-xl border border-[#fffde8]/10 focus:outline-none focus:ring-1 focus:ring-[#0aa603] text-[#fffde8] placeholder-[#fffde8]/40"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-[#fffde8]/60">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-semibold">Filter:</span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-[#101e18] rounded-xl border border-[#fffde8]/10 text-[#fffde8] focus:outline-none focus:ring-1 focus:ring-[#0aa603]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="archived">Archived</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-[#101e18] rounded-xl border border-[#fffde8]/10 text-[#fffde8] focus:outline-none focus:ring-1 focus:ring-[#0aa603]"
          >
            <option value="all">All Industry Sectors</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clients Directory Table */}
      <div className="surface-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0a1410]/50 border-b border-[#fffde8]/10 text-[#fffde8]/60 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-5">Enterprise Client</th>
                <th className="py-3.5 px-5">Industry Sector</th>
                <th className="py-3.5 px-5">Primary Contact</th>
                <th className="py-3.5 px-5">Contracted Capabilities</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5">Engagement Date</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#fffde8]/8 text-[#fffde8]">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#fffde8]/50">
                    <p className="text-sm font-semibold">No enterprise client records found.</p>
                    <p className="text-xs text-[#fffde8]/40 mt-1">Add your first client or adjust active search filters.</p>
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-[#fffde8]/5 transition-colors">
                    <td className="py-4 px-5 font-bold text-[#fffde8]">
                      <Link
                        href={`/clients/${client.id}`}
                        className="hover:text-[#0aa603] flex items-center gap-2.5 group transition-colors"
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#026047] flex items-center justify-center text-[11px] font-bold text-[#fffde8]">
                          {client.business_name.charAt(0)}
                        </div>
                        <span className="font-display tracking-tight text-sm">{client.business_name}</span>
                      </Link>
                    </td>
                    <td className="py-4 px-5 text-[#fffde8]/70">{client.business_category}</td>
                    <td className="py-4 px-5">
                      <div>
                        <div className="font-semibold text-[#fffde8]">{client.contact_name}</div>
                        <div className="text-[11px] text-[#fffde8]/50">{client.email}</div>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex flex-wrap gap-1.5">
                        {client.services_purchased.map((svc) => (
                          <span
                            key={svc}
                            className="px-2.5 py-0.5 rounded-full bg-[#101e18] border border-[#fffde8]/10 text-[10px] text-[#fffde8]/80 font-medium"
                          >
                            {svc}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          client.status === 'active'
                            ? 'bg-[#0aa603]/15 text-[#0aa603] border border-[#0aa603]/30'
                            : client.status === 'pending'
                            ? 'bg-[#c27d14]/15 text-[#e59828] border border-[#c27d14]/30'
                            : 'bg-[#fffde8]/10 text-[#fffde8]/60 border border-[#fffde8]/10'
                        }`}
                      >
                        {client.status === 'active' && <CheckCircle className="w-2.5 h-2.5" />}
                        {client.status === 'pending' && <Clock className="w-2.5 h-2.5" />}
                        {client.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-[#fffde8]/60">{formatDate(client.start_date)}</td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/clients/${client.id}`}
                          className="p-1.5 rounded-lg text-[#fffde8]/70 hover:text-[#0aa603] hover:bg-[#fffde8]/10 transition-colors"
                          title="View Profile"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleArchiveToggle(client.id, client.status)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            client.status === 'archived'
                              ? 'text-[#0aa603] hover:bg-[#0aa603]/10'
                              : 'text-[#fffde8]/40 hover:text-[#ef4444] hover:bg-[#ef4444]/10'
                          }`}
                          title={client.status === 'archived' ? 'Unarchive' : 'Archive'}
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-5 py-3.5 border-t border-[#fffde8]/10 flex items-center justify-between text-xs text-[#fffde8]/60 bg-[#0a1410]/30">
          <span>Showing {filteredClients.length} of {clients.length} registered business accounts</span>
          <div className="flex items-center gap-1.5 font-semibold text-[#0aa603]">
            <ArrowUpDown className="w-3.5 h-3.5" /> Chronological Start Date
          </div>
        </div>
      </div>

      {/* Add Client Modal */}
      <ClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addClient}
      />
    </div>
  );
}
