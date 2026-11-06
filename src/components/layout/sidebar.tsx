'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Star,
  IndianRupee,
  CheckSquare,
  FlaskConical,
  FileBarChart,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { name: 'Overview', href: '/', icon: LayoutDashboard },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Projects', href: '/projects', icon: Briefcase },
  { name: 'Reviews', href: '/reviews', icon: Star },
  { name: 'Revenue', href: '/revenue', icon: IndianRupee },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Data Lab', href: '/data-lab', icon: FlaskConical },
  { name: 'Reports', href: '/reports', icon: FileBarChart },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-30 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col bg-[#0f1c16]/95 backdrop-blur-2xl text-[#fffde8] border-r border-[#fffde8]/10 shadow-[10px_0_40px_rgba(0,0,0,0.6)] ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-18 flex items-center justify-between px-5 border-b border-[#fffde8]/10 bg-[#0a1410]/50">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-3 overflow-hidden group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#026047] via-[#0aa603]/80 to-[#013d2d] flex items-center justify-center font-bold text-[#fffde8] text-xl shadow-[0_0_20px_rgba(2,96,71,0.5)] group-hover:shadow-[0_0_25px_rgba(10,166,3,0.7)] group-hover:scale-105 transition-all duration-300 shrink-0 border border-[#fffde8]/20">
              P
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-wider text-[#fffde8] uppercase font-display leading-tight flex items-center gap-1.5">
                PHOENIX
              </span>
              <span className="text-[10px] font-semibold tracking-widest text-[#0aa603] uppercase">
                Intellex Platform
              </span>
            </div>
          </Link>
        )}
        {collapsed && (
          <Link
            href="/"
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#026047] to-[#013d2d] flex items-center justify-center font-bold text-[#fffde8] text-xl mx-auto shadow-md border border-[#fffde8]/20 hover:scale-105 transition-transform"
          >
            P
          </Link>
        )}

        <button
          onClick={onToggle}
          className={`p-1.5 rounded-lg hover:bg-[#fffde8]/10 text-[#fffde8]/60 hover:text-[#fffde8] transition-colors ${
            collapsed ? 'hidden' : 'block'
          }`}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-5 px-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.name : undefined}
              className={`relative flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-tight transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-[#026047] to-[#026047]/60 text-[#fffde8] shadow-[0_4px_20px_rgba(2,96,71,0.4)] border border-[#fffde8]/20'
                  : 'text-[#fffde8]/60 hover:bg-[#fffde8]/5 hover:text-[#fffde8]'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              {/* Active Indicator Glow */}
              {isActive && (
                <motion.div
                  layoutId="activeGlowPill"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-r-full bg-[#0aa603] shadow-[0_0_12px_#0aa603]"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}

              <Icon
                className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'text-[#fffde8]' : 'text-[#fffde8]/60 group-hover:text-[#fffde8]'
                }`}
              />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Toggle Button for Collapsed View */}
      {collapsed && (
        <div className="p-3 border-t border-[#fffde8]/10 flex justify-center">
          <button
            onClick={onToggle}
            className="p-2 rounded-xl hover:bg-[#fffde8]/10 text-[#fffde8]/60 hover:text-white transition-colors"
            title="Expand sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Footer System Status */}
      <div className="p-3 border-t border-[#fffde8]/10 bg-[#0a1410]/40">
        <div
          className={`flex items-center gap-3 p-2.5 rounded-xl bg-[#14261f]/60 border border-[#fffde8]/10 ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#026047] to-[#0a1410] flex items-center justify-center text-[10px] font-bold text-[#fffde8] shrink-0 border border-[#0aa603]/40 shadow-[0_0_10px_rgba(10,166,3,0.3)]">
            <Zap className="w-3.5 h-3.5 text-[#0aa603]" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-[#fffde8] truncate font-display">
                Phoenix Agency
              </span>
              <span className="text-[10px] text-[#0aa603] flex items-center gap-1 font-semibold tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0aa603] animate-pulse" />
                Verified Operations
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
