'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
} from 'recharts';
import { GlowingSparkline } from './glowing-sparkline';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { formatCurrencyINR } from '@/lib/utils';
import { ArrowUpRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface ExecutiveIntelligenceCockpitProps {
  revenue: number;
  profit: number;
  expenses: number;
  sparklineData?: number[];
  timeframe: 'Week' | 'Month' | 'Year';
  onTimeframeChange: (tf: 'Week' | 'Month' | 'Year') => void;
  serviceCategories?: { category: string; value: number }[];
  budgetTotal?: number;
  budgetSpent?: number;
}

export function ExecutiveIntelligenceCockpit({
  revenue,
  profit,
  expenses,
  sparklineData = [12, 18, 14, 25, 22, 38, 30, 48],
  timeframe,
  onTimeframeChange,
  serviceCategories = [],
  budgetTotal = 100000,
  budgetSpent = 0,
}: ExecutiveIntelligenceCockpitProps) {
  // Income vs Expenses donut data
  const donutData = [
    { name: 'Income', value: revenue || 1 },
    { name: 'Expenses', value: expenses || 0 },
  ];
  // Colors from the Picture 2 reference: Mint/Emerald for Income, Lavender/Periwinkle for Expenses
  const DONUT_COLORS = ['#38ef7d', '#9b94f1'];

  // Top Operating Categories data
  const barData =
    serviceCategories.length > 0
      ? serviceCategories.slice(0, 4).map((c) => ({
          name: c.category.length > 9 ? c.category.slice(0, 8) + '…' : c.category,
          amount: c.value,
        }))
      : [
          { name: 'Marketing', amount: 45000 },
          { name: 'Operations', amount: 32000 },
          { name: 'Engineering', amount: 58000 },
        ];
  const BAR_COLORS = ['#9b94f1', '#5c91f1', '#38ef7d', '#f4f0d5'];

  const budgetPct = Math.min(100, Math.round((budgetSpent / (budgetTotal || 1)) * 100));

  return (
    <div className="surface-card rounded-3xl p-6 sm:p-7 relative overflow-hidden border border-[#fffde8]/15 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),0_0_35px_rgba(2,96,71,0.2)]">
      {/* Ambient background light matching Picture 2 */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#026047]/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-20 left-10 w-80 h-80 bg-[#0aa603]/10 rounded-full blur-[90px] pointer-events-none" />

      {/* 1. Cockpit Header Bar with Logo and Timeframe Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#fffde8]/10 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#026047] via-[#0aa603]/80 to-[#013d2d] flex items-center justify-center border border-[#fffde8]/20 shadow-[0_0_18px_rgba(10,166,3,0.35)] shrink-0">
            <span className="font-display font-extrabold text-[#fffde8] text-base">⨂</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0aa603] animate-pulse shadow-[0_0_8px_#0aa603]" />
              <h2 className="text-base sm:text-lg font-bold text-[#fffde8] tracking-tight font-display">
                Executive Cockpit
              </h2>
            </div>
            <p className="text-xs text-[#fffde8]/60 mt-0.5">
              Live executive financial telemetry & cash distribution
            </p>
          </div>
        </div>

        {/* Timeframe Pill Selectors (Week / Month / Year) */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0a1410]/70 border border-[#fffde8]/10 backdrop-blur-md self-start sm:self-auto">
          {(['Week', 'Month', 'Year'] as const).map((tf) => {
            const isActive = timeframe === tf;
            return (
              <button
                key={tf}
                onClick={() => onTimeframeChange(tf)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                  isActive
                    ? 'text-[#0a1410] font-bold shadow-xs'
                    : 'text-[#fffde8]/60 hover:text-[#fffde8]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCockpitTimeframe"
                    className="absolute inset-0 bg-[#fffde8] rounded-lg"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tf}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Top Row: 3 Premium Glassmorphic Cards (Revenue, Profit, Earnings Sparkline) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 relative z-10">
        {/* Card A: Revenue */}
        <motion.div
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="p-5 rounded-2xl bg-[#0f1c16]/80 border border-[#fffde8]/10 backdrop-blur-xl shadow-lg relative overflow-hidden flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#fffde8]/60 font-sans">
              Revenue
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#026047]/30 text-[#38ef7d] border border-[#026047]/60">
              Live Settled
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#fffde8] font-display tracking-tight">
              <AnimatedCounter value={revenue} prefix="₹" duration={1100} />
            </div>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#fffde8]/10">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#38ef7d]/20 text-[#38ef7d] border border-[#38ef7d]/40 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38ef7d]" />
                Income
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#9b94f1]/20 text-[#b5aef4] border border-[#9b94f1]/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9b94f1]" />
                Expenses: ₹{expenses.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Card B: Profit */}
        <motion.div
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="p-5 rounded-2xl bg-[#0f1c16]/80 border border-[#fffde8]/10 backdrop-blur-xl shadow-lg relative overflow-hidden flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#fffde8]/60 font-sans">
              Net Profit
            </span>
            <span className="p-1.5 rounded-lg bg-[#38ef7d]/15 text-[#38ef7d]">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#38ef7d] font-display tracking-tight flex items-center gap-1">
              <span>+</span>
              <AnimatedCounter value={profit} prefix="₹" duration={1200} />
            </div>
            <p className="text-xs text-[#fffde8]/60 font-medium mt-3 pt-3 border-t border-[#fffde8]/10">
              vs. Last {timeframe}: <span className="text-[#38ef7d] font-semibold">+14.2% yield</span>
            </p>
          </div>
        </motion.div>

        {/* Card C: Earnings with Glowing Sparkline Curve */}
        <motion.div
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="p-5 rounded-2xl bg-[#0f1c16]/80 border border-[#fffde8]/10 backdrop-blur-xl shadow-lg relative overflow-hidden flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#fffde8]/60 font-sans">
              Earnings Pulse
            </span>
            <span className="text-[10px] text-[#fffde8]/50 font-medium">Trajectory</span>
          </div>
          <div className="mt-2 flex items-center justify-center py-1">
            <GlowingSparkline
              data={sparklineData}
              color="#0aa603"
              glowColor="rgba(10, 166, 3, 0.5)"
              height={52}
              width={200}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#fffde8]/60 pt-2 border-t border-[#fffde8]/10">
            <span>Dynamic pace</span>
            <span className="text-[#0aa603] font-bold">Optimal Rate</span>
          </div>
        </motion.div>
      </div>

      {/* 3. Section Header: Cash Flow Analysis */}
      <div className="flex items-center justify-between mt-8 mb-4 relative z-10">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-[#fffde8] font-display">
            Cash Flow Analysis
          </h3>
          <p className="text-xs text-[#fffde8]/60">{timeframe}ly Trends & Operating Benchmarks</p>
        </div>
        <Link
          href="/revenue"
          className="btn-secondary px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 hover:border-[#0aa603]/60 transition-colors shadow-2xs"
        >
          View Details
          <ArrowUpRight className="w-3.5 h-3.5 text-[#0aa603]" />
        </Link>
      </div>

      {/* 4. Bottom Row: 3 Visual Analysis Cards (Income vs Expense Donut, Categories Bars, Budget Overview) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
        {/* Card 1: Income vs Expenses Donut */}
        <div className="p-5 rounded-2xl bg-[#0f1c16]/80 border border-[#fffde8]/10 backdrop-blur-xl shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#fffde8] font-display">Income vs. Expenses</span>
              <span className="text-[10px] text-[#fffde8]/50">Split</span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#38ef7d]/15 text-[#38ef7d] border border-[#38ef7d]/30 font-semibold">
                Income
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#9b94f1]/15 text-[#b5aef4] border border-[#9b94f1]/30 font-semibold">
                Expenses
              </span>
            </div>
          </div>

          <div className="h-36 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  innerRadius={40}
                  outerRadius={58}
                  paddingAngle={5}
                  dataKey="value"
                  isAnimationActive={true}
                  animationDuration={1000}
                >
                  {donutData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => [formatCurrencyINR(Number(val) || 0), 'Amount']}
                  contentStyle={{
                    backgroundColor: '#0a1410',
                    border: '1px solid rgba(255,253,232,0.15)',
                    borderRadius: '10px',
                    fontSize: '11px',
                    color: '#fffde8',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#fffde8]/10 text-[#fffde8]/60">
            <span>Inflow: <strong className="text-[#38ef7d]">₹{revenue.toLocaleString('en-IN')}</strong></span>
            <span>Outflow: <strong className="text-[#b5aef4]">₹{expenses.toLocaleString('en-IN')}</strong></span>
          </div>
        </div>

        {/* Card 2: Top Operating Categories Vertical Rounded Bar Chart */}
        <div className="p-5 rounded-2xl bg-[#0f1c16]/80 border border-[#fffde8]/10 backdrop-blur-xl shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#fffde8] font-display">
                Top Operating Categories
              </span>
              <span className="text-[10px] text-[#fffde8]/50">Services</span>
            </div>
            <p className="text-[11px] text-[#fffde8]/60 mb-2">Volume across agency contracts</p>
          </div>

          <div className="h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: 'rgba(255,253,232,0.5)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(val) => [formatCurrencyINR(Number(val) || 0), 'Value']}
                  contentStyle={{
                    backgroundColor: '#0a1410',
                    border: '1px solid rgba(255,253,232,0.15)',
                    borderRadius: '10px',
                    fontSize: '11px',
                    color: '#fffde8',
                  }}
                />
                <Bar
                  dataKey="amount"
                  radius={[8, 8, 4, 4]}
                  barSize={20}
                  isAnimationActive={true}
                  animationDuration={900}
                >
                  {barData.map((_, index) => (
                    <Cell key={`bar-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-[#fffde8]/60 pt-2 border-t border-[#fffde8]/10 flex items-center justify-between">
            <span>Distribution</span>
            <span className="text-[#fffde8] font-bold">100% Balanced</span>
          </div>
        </div>

        {/* Card 3: Budget Overview with Pill Progress Bar */}
        <div className="p-5 rounded-2xl bg-[#0f1c16]/80 border border-[#fffde8]/10 backdrop-blur-xl shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#fffde8] font-display">Budget Overview</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0aa603]/15 text-[#0aa603] border border-[#0aa603]/30">
                On Target
              </span>
            </div>
            <p className="text-[11px] text-[#fffde8]/60">Monthly operational allocation cap</p>
          </div>

          <div className="my-auto py-3 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#fffde8]/80 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#9b94f1]" />
                Spent: ₹{budgetSpent.toLocaleString('en-IN')}
              </span>
              <span className="font-bold text-[#fffde8] font-display">{budgetPct}%</span>
            </div>

            {/* Glowing Periwinkle / Purple Progress bar from Picture 2 */}
            <div className="w-full h-3 bg-[#0a1410] rounded-full overflow-hidden p-0.5 border border-[#fffde8]/10 shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(5, budgetPct)}%` }}
                transition={{ duration: 1.1, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-[#9b94f1] via-[#b5aef4] to-[#38ef7d] shadow-[0_0_12px_rgba(155,148,241,0.5)]"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#fffde8]/50">
              <span>Cap: ₹{budgetTotal.toLocaleString('en-IN')}</span>
              <span>Remaining: ₹{Math.max(0, budgetTotal - budgetSpent).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="text-[11px] text-[#fffde8]/60 pt-2 border-t border-[#fffde8]/10 flex items-center justify-between">
            <span>Status</span>
            <span className="text-[#38ef7d] font-semibold">Under Budget</span>
          </div>
        </div>
      </div>
    </div>
  );
}
