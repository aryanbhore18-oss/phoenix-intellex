'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/app-context';
import { formatCurrencyINR, formatDate } from '@/lib/utils';
import { KPICard } from '@/components/dashboard/kpi-card';
import { ExecutiveIntelligenceCockpit } from '@/components/dashboard/cockpit';
import {
  RevenueTrendChart,
  ProjectStatusChart,
  ServiceCategoryChart,
  RatingDistributionChart,
} from '@/components/dashboard/charts';
import { SkeletonKPICard, SkeletonChartCard } from '@/components/ui/skeleton';
import { OnboardingEmptyState } from '@/components/common/empty-state';
import { PageTransition } from '@/components/ui/page-transition';
import { motion } from 'framer-motion';
import {
  Users,
  Briefcase,
  IndianRupee,
  Star,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Plus,
} from 'lucide-react';

export default function DashboardPage() {
  const { clients, projects, invoices, payments, tasks, reviews, kpis, isLoaded } = useApp();
  const [timeframe, setTimeframe] = useState<'Week' | 'Month' | 'Year'>('Month');

  if (!isLoaded) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonKPICard key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonChartCard />
          <SkeletonChartCard />
        </div>
      </div>
    );
  }

  // Calculate telemetry for Picture 2 Cockpit
  const totalRevenue = kpis.revenueReceived;
  // Estimated operating expenses (e.g. 28% of revenue or minimal baseline for realism)
  const estimatedExpenses = Math.round(totalRevenue * 0.28);
  const netProfit = Math.max(0, totalRevenue - estimatedExpenses);

  // Dynamic sparkline data derived from recent payments or stable curve
  const sparklineData =
    payments.length > 3
      ? payments.slice(-8).map((p) => p.amount_received)
      : [14, 22, 19, 32, 28, 45, 38, 56];

  // Service category breakdown
  const serviceFees = projects.reduce((acc, p) => {
    acc[p.service_category] = (acc[p.service_category] || 0) + p.fee;
    return acc;
  }, {} as Record<string, number>);

  const serviceCategories =
    Object.keys(serviceFees).length > 0
      ? Object.keys(serviceFees).map((category) => ({
          category,
          value: serviceFees[category],
        }))
      : [
          { category: 'Web Solutions', value: 45000 },
          { category: 'AI Automation', value: 65000 },
          { category: 'Smart Reviews', value: 25000 },
        ];

  // If there are zero clients and projects, show Cockpit initialized + refined onboarding
  if (clients.length === 0 && projects.length === 0) {
    return (
      <PageTransition className="space-y-6">
        {/* Quick action bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="surface-card p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0aa603] animate-pulse shadow-[0_0_8px_#0aa603]" />
              <h2 className="text-lg font-bold text-[#fffde8] tracking-tight font-display">Executive Summary</h2>
            </div>
            <p className="text-xs text-[#fffde8]/60 mt-0.5">
              Phoenix Intellex is initialized and waiting for operational data records.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <Link
              href="/clients"
              className="btn-primary inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-[#f4f0d5]" />
              Add First Client
            </Link>
            <Link
              href="/data-lab"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-xl bg-[#fffde8]/5 border border-[#fffde8]/15 text-[#fffde8] hover:bg-[#fffde8]/10 transition-colors shadow-2xs"
            >
              Open Data Lab
            </Link>
          </div>
        </motion.div>

        {/* PRIMARY REFERENCE: Executive Intelligence Cockpit matching Reference Picture 2 */}
        <ExecutiveIntelligenceCockpit
          revenue={0}
          profit={0}
          expenses={0}
          sparklineData={[10, 15, 12, 22, 18, 30, 25, 40]}
          timeframe={timeframe}
          onTimeframeChange={setTimeframe}
          serviceCategories={serviceCategories}
          budgetTotal={100000}
          budgetSpent={0}
        />

        {/* 8 Primary KPI Cards at zero baseline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            label="Total Clients"
            value={0}
            subValue="0 Active Accounts"
            comparison={{ text: 'Ready for records', neutral: true }}
            icon={Users}
            variant="green"
            delayIndex={0}
          />
          <KPICard
            label="Active Projects"
            value={0}
            subValue="0 In Progress"
            comparison={{ text: 'No active delivery', neutral: true }}
            icon={Briefcase}
            variant="default"
            delayIndex={1}
          />
          <KPICard
            label="Revenue Received"
            value="₹0"
            subValue="Settled in INR"
            comparison={{ text: '₹0.00 cash inflow', neutral: true }}
            icon={IndianRupee}
            variant="gold"
            delayIndex={2}
          />
          <KPICard
            label="Outstanding Balance"
            value="₹0"
            subValue="0 Unpaid Invoices"
            comparison={{ text: 'Accounts cleared', neutral: true }}
            icon={AlertCircle}
            variant="amber"
            delayIndex={3}
          />
          <KPICard
            label="Overdue Tasks"
            value={0}
            subValue="0 Action items"
            comparison={{ text: 'All on schedule', isPositive: true }}
            icon={Clock}
            variant="green"
            delayIndex={4}
          />
          <KPICard
            label="Smart Reviews"
            value={0}
            subValue="No ratings yet"
            comparison={{ text: 'Ready for QR feedback', neutral: true }}
            icon={Star}
            variant="gold"
            delayIndex={5}
          />
          <KPICard
            label="Completed Projects"
            value={0}
            subValue="100% SLA target"
            comparison={{ text: 'No archived scope', neutral: true }}
            icon={CheckCircle2}
            variant="green"
            delayIndex={6}
          />
          <KPICard
            label="Cash Collection Rate"
            value="100%"
            subValue="Invoiced vs Collected"
            comparison={{ text: 'Balanced ledger', isPositive: true }}
            icon={IndianRupee}
            variant="default"
            delayIndex={7}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <OnboardingEmptyState
            title="Welcome to Phoenix Intellex"
            description="Your workspace is clean with zero sample data. Add your first business client or upload an existing Excel/CSV dataset to populate real company intelligence."
          />
        </motion.div>
      </PageTransition>
    );
  }

  // Monthly Revenue Chart calculation
  const monthlyRevenueData = [
    { month: 'Jan', amount: payments.filter((p) => p.payment_date.includes('-01-')).reduce((a, b) => a + b.amount_received, 0) },
    { month: 'Feb', amount: payments.filter((p) => p.payment_date.includes('-02-')).reduce((a, b) => a + b.amount_received, 0) },
    { month: 'Mar', amount: payments.filter((p) => p.payment_date.includes('-03-')).reduce((a, b) => a + b.amount_received, 0) },
  ];

  // Project status distribution
  const statusCounts = projects.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const projectStatusData = [
    { status: 'Planned', count: statusCounts['Planned'] || 0 },
    { status: 'In Progress', count: statusCounts['In Progress'] || 0 },
    { status: 'Completed', count: statusCounts['Completed'] || 0 },
    { status: 'On Hold', count: statusCounts['On Hold'] || 0 },
    { status: 'Cancelled', count: statusCounts['Cancelled'] || 0 },
  ];

  // Review ratings distribution
  const ratingCounts = [1, 2, 3, 4, 5].map((star) => ({
    rating: `${star} Star`,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  const pendingTasks = tasks.filter((t) => t.status !== 'Completed').slice(0, 4);

  return (
    <PageTransition className="space-y-6">
      {/* Top Banner Alert / Quick Action Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="surface-card p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0aa603] animate-pulse shadow-[0_0_8px_#0aa603]" />
            <h2 className="text-lg font-bold text-[#fffde8] tracking-tight font-display">Executive Summary</h2>
          </div>
          <p className="text-xs text-[#fffde8]/60 mt-0.5">
            Real-time business performance derived from verified operational records.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href="/clients"
            className="btn-primary inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-[#f4f0d5]" />
            New Client
          </Link>
          <Link
            href="/data-lab"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-xl bg-[#fffde8]/5 border border-[#fffde8]/15 text-[#fffde8] hover:bg-[#fffde8]/10 transition-colors shadow-2xs"
          >
            Data Lab
          </Link>
        </div>
      </motion.div>

      {/* PRIMARY REFERENCE: Executive Intelligence Cockpit matching Reference Picture 2 */}
      <ExecutiveIntelligenceCockpit
        revenue={totalRevenue}
        profit={netProfit}
        expenses={estimatedExpenses}
        sparklineData={sparklineData}
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
        serviceCategories={serviceCategories}
        budgetTotal={Math.max(100000, totalRevenue * 1.2)}
        budgetSpent={estimatedExpenses}
      />

      {/* 8 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Total Clients"
          value={kpis.totalClients}
          subValue={`${kpis.activeClients} Active`}
          icon={Users}
          variant="green"
          delayIndex={0}
        />

        <KPICard
          label="Active Projects"
          value={kpis.activeProjects}
          subValue={`${kpis.completedProjects} Delivered`}
          icon={Briefcase}
          variant="default"
          delayIndex={1}
        />

        <KPICard
          label="Revenue Received"
          value={formatCurrencyINR(kpis.revenueReceived)}
          subValue="Settled in INR"
          icon={IndianRupee}
          variant="gold"
          delayIndex={2}
        />

        <KPICard
          label="Outstanding Balance"
          value={formatCurrencyINR(kpis.outstandingBalance)}
          subValue={`${invoices.filter((i) => i.status === 'Sent' || i.status === 'Partially Paid').length} Unpaid Invoices`}
          icon={AlertCircle}
          variant="amber"
          delayIndex={3}
        />

        <KPICard
          label="Overdue Tasks"
          value={kpis.overdueTasks}
          subValue="Action items"
          icon={Clock}
          variant={kpis.overdueTasks > 0 ? 'amber' : 'green'}
          delayIndex={4}
        />

        <KPICard
          label="Smart Reviews"
          value={kpis.totalReviews}
          subValue={kpis.averageRating ? `${kpis.averageRating} ★ Avg Rating` : 'No ratings'}
          icon={Star}
          variant="gold"
          delayIndex={5}
        />

        <KPICard
          label="Completed Projects"
          value={kpis.completedProjects}
          subValue="100% SLA target"
          icon={CheckCircle2}
          variant="green"
          delayIndex={6}
        />

        <KPICard
          label="Cash Collection Rate"
          value={
            invoices.reduce((a, b) => a + b.total_amount, 0) > 0
              ? `${((kpis.revenueReceived / invoices.reduce((a, b) => a + b.total_amount, 0)) * 100).toFixed(0)}%`
              : '100%'
          }
          subValue="Invoiced vs Collected"
          icon={IndianRupee}
          variant="default"
          delayIndex={7}
        />
      </div>

      {/* Analytics Section: 2x2 Charts */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <RevenueTrendChart data={monthlyRevenueData} />
        <ProjectStatusChart data={projectStatusData} />
        <ServiceCategoryChart data={serviceCategories} />
        <RatingDistributionChart data={ratingCounts} />
      </motion.div>

      {/* Operational Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invoices Reconciliation Table */}
        <div className="surface-card p-5 sm:p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#fffde8] font-display">Recent Invoices</h3>
                <p className="text-[11px] text-[#fffde8]/60">Latest billing & collection balances</p>
              </div>
              <Link
                href="/revenue"
                className="text-xs font-semibold text-[#0aa603] hover:text-[#f4f0d5] inline-flex items-center gap-1 transition-colors"
              >
                View all
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#fffde8]/10 text-[#fffde8]/60">
                    <th className="pb-2 font-semibold">Invoice #</th>
                    <th className="pb-2 font-semibold">Client</th>
                    <th className="pb-2 font-semibold text-right">Amount</th>
                    <th className="pb-2 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#fffde8]/5">
                  {invoices.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-[#fffde8]/50">
                        No invoices logged yet.
                      </td>
                    </tr>
                  ) : (
                    invoices.slice(0, 4).map((inv) => (
                      <tr key={inv.id} className="hover:bg-[#fffde8]/5 transition-colors">
                        <td className="py-2.5 font-bold text-[#fffde8] font-display">{inv.invoice_number}</td>
                        <td className="py-2.5 text-[#fffde8]/90 max-w-[140px] truncate">{inv.client_name}</td>
                        <td className="py-2.5 font-bold text-right text-[#fffde8]">
                          {formatCurrencyINR(inv.total_amount)}
                        </td>
                        <td className="py-2.5 text-right">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#026047]/30 text-[#fffde8] border border-[#026047]/60">
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Priority Action Tasks */}
        <div className="surface-card p-5 sm:p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#fffde8] font-display">Priority Deliverables</h3>
                <p className="text-[11px] text-[#fffde8]/60">Tasks requiring operational execution</p>
              </div>
              <Link
                href="/tasks"
                className="text-xs font-semibold text-[#0aa603] hover:text-[#f4f0d5] inline-flex items-center gap-1 transition-colors"
              >
                View all
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {pendingTasks.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#fffde8]/50">
                  No pending deliverables. Create your first task from the Tasks tab.
                </div>
              ) : (
                pendingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-xl bg-[#0f1c16]/70 border border-[#fffde8]/10 flex items-center justify-between gap-3 shadow-2xs hover:border-[#026047]/60 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#fffde8] truncate">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-[#fffde8]/60">
                        <span>{task.client_name || 'Internal'}</span>
                        <span>•</span>
                        <span>Due: {formatDate(task.due_date)}</span>
                      </div>
                    </div>
                    <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-[#026047]/30 text-[#fffde8] border border-[#026047]/50">
                      {task.priority}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
