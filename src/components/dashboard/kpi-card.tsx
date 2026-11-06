'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedCounter } from '@/components/ui/animated-counter';

interface KPICardProps {
  label: string;
  value: string | number;
  subValue?: string;
  comparison?: {
    text: string;
    isPositive?: boolean;
    neutral?: boolean;
  };
  icon: LucideIcon;
  variant?: 'default' | 'gold' | 'green' | 'amber';
  delayIndex?: number;
}

export function KPICard({
  label,
  value,
  subValue,
  comparison,
  icon: Icon,
  variant = 'default',
  delayIndex = 0,
}: KPICardProps) {
  const getBadgeStyle = () => {
    switch (variant) {
      case 'gold':
        return 'bg-[#f4f0d5]/10 text-[#f4f0d5] border-[#f4f0d5]/25 shadow-[0_0_15px_rgba(244,240,213,0.15)]';
      case 'green':
        return 'bg-[#0aa603]/15 text-[#0aa603] border-[#0aa603]/35 shadow-[0_0_15px_rgba(10,166,3,0.25)]';
      case 'amber':
        return 'bg-[#c27d14]/15 text-[#e59828] border-[#c27d14]/35 shadow-[0_0_15px_rgba(194,125,20,0.2)]';
      default:
        return 'bg-[#026047]/30 text-[#fffde8] border-[#026047]/60 shadow-[0_0_15px_rgba(2,96,71,0.3)]';
    }
  };

  const getAccentBar = () => {
    switch (variant) {
      case 'gold':
        return 'bg-gradient-to-r from-[#f4f0d5] via-[#f4f0d5]/40 to-transparent';
      case 'green':
        return 'bg-gradient-to-r from-[#0aa603] via-[#026047] to-transparent';
      case 'amber':
        return 'bg-gradient-to-r from-[#c27d14] to-transparent';
      default:
        return 'bg-gradient-to-r from-[#026047] via-[#0aa603]/40 to-transparent';
    }
  };

  // Helper to determine if value is formatted currency (e.g. "₹24,000") or percentage or plain number
  const renderValue = () => {
    if (typeof value === 'number') {
      return <AnimatedCounter value={value} duration={1000} />;
    }

    if (typeof value === 'string') {
      if (value.startsWith('₹')) {
        const rawNum = parseFloat(value.replace(/[^0-9.-]+/g, '')) || 0;
        return <AnimatedCounter value={rawNum} prefix="₹" duration={1100} />;
      }
      if (value.endsWith('%')) {
        const rawNum = parseFloat(value.replace('%', '')) || 0;
        return <AnimatedCounter value={rawNum} suffix="%" duration={900} />;
      }
    }

    return <span>{value}</span>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delayIndex * 0.06, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{
        y: -4,
        scale: 1.01,
        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px rgba(2,96,71,0.35)',
        borderColor: 'rgba(2,96,71,0.7)',
        transition: { duration: 0.22, ease: 'easeOut' },
      }}
      whileTap={{ scale: 0.99 }}
      className="surface-card rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between group cursor-default transition-all"
    >
      {/* Top delicate luminous bar */}
      <div className={`absolute top-0 left-0 right-0 h-[2.5px] ${getAccentBar()}`} />

      <div>
        <div className="flex items-start justify-between">
          <span className="text-[11px] font-bold tracking-wider uppercase text-[#fffde8]/60 font-sans">
            {label}
          </span>
          <div
            className={`p-2.5 rounded-xl border ${getBadgeStyle()} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
          >
            <Icon className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#fffde8] tracking-tight font-display">
              {renderValue()}
            </span>
          </div>
          {subValue && (
            <p className="text-xs text-[#fffde8]/60 font-medium mt-1 tracking-tight">
              {subValue}
            </p>
          )}
        </div>
      </div>

      {comparison && (
        <div className="mt-4 pt-3 border-t border-[#fffde8]/10 flex items-center justify-between text-xs">
          <span
            className={`font-semibold inline-flex items-center gap-1.5 ${
              comparison.neutral
                ? 'text-[#fffde8]/60'
                : comparison.isPositive
                ? 'text-[#0aa603]'
                : 'text-[#ef4444]'
            }`}
          >
            {comparison.text}
          </span>
          <span className="text-[10px] text-[#fffde8]/40 font-medium">performance delta</span>
        </div>
      )}
    </motion.div>
  );
}
