'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SparklineProps {
  data: number[];
  color?: string;
  glowColor?: string;
  height?: number;
  width?: number;
}

export function GlowingSparkline({
  data = [12, 18, 14, 25, 22, 38, 30, 48],
  color = '#0aa603',
  glowColor = 'rgba(10, 166, 3, 0.45)',
  height = 54,
  width = 160,
}: SparklineProps) {
  if (!data || data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * (width - 12) + 6;
    const y = height - ((val - min) / range) * (height - 16) - 8;
    return { x, y };
  });

  // Build smooth bezier SVG path
  const pathD = points.reduce((acc, point, i, arr) => {
    if (i === 0) return `M ${point.x},${point.y}`;
    const prev = arr[i - 1];
    const cx = (prev.x + point.x) / 2;
    return `${acc} C ${cx},${prev.y} ${cx},${point.y} ${point.x},${point.y}`;
  }, '');

  const lastPoint = points[points.length - 1];

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
      >
        <defs>
          <filter id={`glow-${color.replace(/[^a-zA-Z0-9]/g, '')}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Subtle glow shadow path */}
        <motion.path
          d={pathD}
          fill="none"
          stroke={glowColor}
          strokeWidth="4"
          strokeLinecap="round"
          filter={`url(#glow-${color.replace(/[^a-zA-Z0-9]/g, '')})`}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.8 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />

        {/* Crisp core stroke path */}
        <motion.path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />

        {/* Terminal Glowing Target Pulse Dot */}
        {lastPoint && (
          <>
            <motion.circle
              cx={lastPoint.x}
              cy={lastPoint.y}
              r="7"
              fill={color}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [1, 1.6, 1], opacity: [0.7, 0.2, 0.7] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            />
            <motion.circle
              cx={lastPoint.x}
              cy={lastPoint.y}
              r="3.5"
              fill="#fffde8"
              stroke={color}
              strokeWidth="1.5"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, duration: 0.3 }}
            />
          </>
        )}
      </svg>
    </div>
  );
}
