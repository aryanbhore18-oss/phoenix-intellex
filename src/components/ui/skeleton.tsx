'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-[#12231b] before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-[#1c382c]/60 before:to-transparent ${className}`}
    />
  );
}

export function SkeletonKPICard() {
  return (
    <div className="surface-card rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between h-[142px]">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-8 w-8 rounded-xl" />
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-3 w-36" />
      </div>
    </div>
  );
}

export function SkeletonTableRow() {
  return (
    <tr className="border-b border-[#fffde8]/5">
      <td className="py-4 px-4"><Skeleton className="h-4 w-32" /></td>
      <td className="py-4 px-4"><Skeleton className="h-4 w-24" /></td>
      <td className="py-4 px-4"><Skeleton className="h-4 w-28" /></td>
      <td className="py-4 px-4"><Skeleton className="h-4 w-16" /></td>
      <td className="py-4 px-4"><Skeleton className="h-4 w-20" /></td>
    </tr>
  );
}

export function SkeletonChartCard() {
  return (
    <div className="surface-card p-6 rounded-2xl h-80 flex flex-col justify-between">
      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-64" />
      </div>
      <div className="h-48 w-full flex items-end gap-3 pt-6">
        <Skeleton className="h-[40%] flex-1 rounded-t-lg" />
        <Skeleton className="h-[75%] flex-1 rounded-t-lg" />
        <Skeleton className="h-[55%] flex-1 rounded-t-lg" />
        <Skeleton className="h-[90%] flex-1 rounded-t-lg" />
        <Skeleton className="h-[65%] flex-1 rounded-t-lg" />
        <Skeleton className="h-[80%] flex-1 rounded-t-lg" />
      </div>
    </div>
  );
}
