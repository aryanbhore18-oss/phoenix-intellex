'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { formatCurrencyINR } from '@/lib/utils';

// Color definitions aligned with Phoenix Tech Solutions live website
const COLORS = {
  emerald: '#026047',
  brightGreen: '#0aa603',
  cream: '#fffde8',
  creamMuted: 'rgba(255, 253, 232, 0.45)',
  surface: '#14261f',
  cardBg: '#0f1c16',
  border: 'rgba(255, 253, 232, 0.1)',
  pieColors: ['#026047', '#0aa603', '#f4f0d5', '#42584e', '#c27d14'],
};

// 1. Monthly Revenue Trend Chart
interface RevenueTrendProps {
  data: { month: string; amount: number }[];
}

export function RevenueTrendChart({ data }: RevenueTrendProps) {
  return (
    <div className="surface-card p-6 rounded-2xl">
      <div className="mb-4">
        <h3 className="text-base font-bold text-[#fffde8] font-display">Cash Inflow Dynamics</h3>
        <p className="text-xs text-[#fffde8]/60">Verified collections in INR (₹) across billing milestones</p>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="phoenixEmeraldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.brightGreen} stopOpacity={0.35} />
                <stop offset="95%" stopColor={COLORS.emerald} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,253,232,0.06)" />
            <XAxis dataKey="month" tick={{ fill: COLORS.creamMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fill: COLORS.creamMuted, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value) => [formatCurrencyINR(Number(value) || 0), 'Cash Settled']}
              contentStyle={{
                backgroundColor: '#0f1c16',
                border: '1px solid rgba(255,253,232,0.15)',
                borderRadius: '12px',
                fontSize: '12px',
                color: '#fffde8',
                boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
              }}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke={COLORS.brightGreen}
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#phoenixEmeraldGrad)"
              isAnimationActive={true}
              animationDuration={900}
              animationEasing="ease-out"
              animationBegin={200}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// 2. Project Status Distribution Chart
interface ProjectStatusProps {
  data: { status: string; count: number }[];
}

export function ProjectStatusChart({ data }: ProjectStatusProps) {
  return (
    <div className="surface-card p-6 rounded-2xl">
      <div className="mb-4">
        <h3 className="text-base font-bold text-[#fffde8] font-display">Client Delivery Pipeline</h3>
        <p className="text-xs text-[#fffde8]/60">Breakdown of AI systems, websites & automation contracts</p>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,253,232,0.06)" />
            <XAxis type="number" tick={{ fill: COLORS.creamMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="status"
              tick={{ fill: '#fffde8', fontSize: 11, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              width={85}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f1c16',
                border: '1px solid rgba(255,253,232,0.15)',
                borderRadius: '12px',
                fontSize: '12px',
                color: '#fffde8',
              }}
            />
            <Bar
              dataKey="count"
              fill={COLORS.emerald}
              radius={[0, 6, 6, 0]}
              barSize={22}
              isAnimationActive={true}
              animationDuration={850}
              animationEasing="ease-out"
              animationBegin={250}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// 3. Service Category Revenue Breakdown
interface ServiceRevenueProps {
  data: { category: string; value: number }[];
}

export function ServiceCategoryChart({ data }: ServiceRevenueProps) {
  return (
    <div className="surface-card p-6 rounded-2xl">
      <div className="mb-4">
        <h3 className="text-base font-bold text-[#fffde8] font-display">Revenue by Agency Capability</h3>
        <p className="text-xs text-[#fffde8]/60">Workflow Automation, AI Agents, Web Engineering & Review QR</p>
      </div>
      <div className="h-64 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
              nameKey="category"
              isAnimationActive={true}
              animationDuration={1000}
              animationEasing="ease-out"
              animationBegin={300}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS.pieColors[index % COLORS.pieColors.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [formatCurrencyINR(Number(value) || 0), 'Contracted Value']}
              contentStyle={{
                backgroundColor: '#0f1c16',
                border: '1px solid rgba(255,253,232,0.15)',
                borderRadius: '12px',
                fontSize: '12px',
                color: '#fffde8',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3 mt-2 text-xs">
        {data.map((entry, idx) => (
          <div key={entry.category} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: COLORS.pieColors[idx % COLORS.pieColors.length] }}
            />
            <span className="text-[#fffde8]/80 font-medium">{entry.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 4. Review Rating Distribution
interface RatingDistributionProps {
  data: { rating: string; count: number }[];
}

export function RatingDistributionChart({ data }: RatingDistributionProps) {
  return (
    <div className="surface-card p-6 rounded-2xl">
      <div className="mb-4">
        <h3 className="text-base font-bold text-[#fffde8] font-display">Client Satisfaction Benchmarks</h3>
        <p className="text-xs text-[#fffde8]/60">Smart Review ratings and sentiment satisfaction spread</p>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,253,232,0.06)" />
            <XAxis dataKey="rating" tick={{ fill: COLORS.creamMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: COLORS.creamMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f1c16',
                border: '1px solid rgba(255,253,232,0.15)',
                borderRadius: '12px',
                fontSize: '12px',
                color: '#fffde8',
              }}
            />
            <Bar
              dataKey="count"
              fill={COLORS.brightGreen}
              radius={[6, 6, 0, 0]}
              barSize={26}
              isAnimationActive={true}
              animationDuration={850}
              animationEasing="ease-out"
              animationBegin={250}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
