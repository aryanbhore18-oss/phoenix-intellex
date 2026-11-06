'use client';

import React from 'react';
import { Search, Bell, Calendar, User, Menu, Zap, Sparkles } from 'lucide-react';
import { useApp } from '@/context/app-context';

interface TopbarProps {
  sidebarCollapsed: boolean;
  onMobileMenuToggle: () => void;
  title: string;
}

export function Topbar({ sidebarCollapsed, onMobileMenuToggle, title }: TopbarProps) {
  const { dateRange, setDateRange } = useApp();

  return (
    <header
      className={`fixed top-0 right-0 h-18 z-20 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] bg-[#0a1410]/80 backdrop-blur-2xl border-b border-[#fffde8]/10 flex items-center justify-between px-5 sm:px-8 shadow-[0_4px_30px_rgba(0,0,0,0.5)] ${
        sidebarCollapsed ? 'left-20' : 'left-64'
      }`}
    >
      {/* Left side: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-xl hover:bg-[#fffde8]/10 text-[#fffde8] transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-extrabold text-[#fffde8] tracking-tight font-display">
              {title}
            </h1>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-[#026047]/60 text-[#0aa603] border border-[#0aa603]/30">
              Agency Suite
            </span>
          </div>
          <p className="text-[11px] text-[#fffde8]/60 hidden sm:flex items-center gap-2 font-medium">
            <span>Phoenix Tech Solutions</span>
            <span>•</span>
            <span className="text-[#0aa603] font-semibold">Digital Agency & Automation Engineering</span>
          </p>
        </div>
      </div>

      {/* Right side: Global Search, Date Range Filter, Notifications, Profile */}
      <div className="flex items-center gap-3">
        {/* Global Search */}
        <div className="relative hidden md:block w-60 lg:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#fffde8]/40" />
          <input
            type="text"
            placeholder="Search accounts, AI systems, projects..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-[#101e18]/90 rounded-xl border border-[#fffde8]/10 focus:outline-none focus:ring-1 focus:ring-[#0aa603] focus:border-[#0aa603] text-[#fffde8] placeholder-[#fffde8]/40 shadow-inner transition-all"
          />
        </div>

        {/* Date Range Selector */}
        <div className="flex items-center gap-1.5 bg-[#101e18]/90 px-3 py-2 rounded-xl border border-[#fffde8]/10 text-xs font-semibold text-[#fffde8] shadow-inner">
          <Calendar className="w-3.5 h-3.5 text-[#0aa603]" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-transparent focus:outline-none cursor-pointer pr-1 text-xs text-[#fffde8]"
          >
            <option value="7d" className="bg-[#101e18] text-[#fffde8]">Last 7 Days</option>
            <option value="30d" className="bg-[#101e18] text-[#fffde8]">Last 30 Days</option>
            <option value="90d" className="bg-[#101e18] text-[#fffde8]">Last 90 Days</option>
            <option value="1y" className="bg-[#101e18] text-[#fffde8]">Past 1 Year</option>
            <option value="all" className="bg-[#101e18] text-[#fffde8]">All Operational History</option>
          </select>
        </div>

        {/* Notification Bell */}
        <button
          className="p-2.5 rounded-xl bg-[#101e18]/90 border border-[#fffde8]/10 text-[#fffde8] hover:bg-[#fffde8]/10 transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4 text-[#fffde8]" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#0aa603] shadow-[0_0_8px_#0aa603]" />
        </button>

        {/* User Profile Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#fffde8]/10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#026047] to-[#0a1410] text-[#fffde8] flex items-center justify-center font-bold text-xs shadow-md border border-[#0aa603]/40">
            <User className="w-4 h-4 text-[#fffde8]" />
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-xs font-bold text-[#fffde8] font-display">Executive Team</span>
            <span className="text-[10px] text-[#0aa603] font-semibold">Engineering Lead</span>
          </div>
        </div>
      </div>
    </header>
  );
}
