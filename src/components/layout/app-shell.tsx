'use client';

import React, { Suspense } from 'react';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';

interface AppShellProps {
  children: React.ReactNode;
  pageTitle?: string;
}

export function AppShell({ children, pageTitle = 'Executive Overview' }: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#0a1410] text-[#fffde8] flex relative selection:bg-[#026047] selection:text-[#fffde8]">
      {/* Ambient Radial Luxury Lighting Background matching phoenix-tech-solutions */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-[#026047]/18 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-[#0aa603]/10 rounded-full blur-[150px]" />
        <div className="absolute -bottom-40 left-1/3 w-[700px] h-[500px] bg-[#013d2d]/25 rounded-full blur-[160px]" />
      </div>

      {/* Desktop/Collapsible Sidebar */}
      <div className="hidden lg:block relative z-30">
        <Suspense fallback={<div className="w-64 h-screen bg-[#0f1c16]" />}>
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </Suspense>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 lg:hidden backdrop-blur-md"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-64 h-full bg-[#0f1c16]"
            onClick={(e) => e.stopPropagation()}
          >
            <Suspense fallback={<div className="w-64 h-full bg-[#0f1c16]" />}>
              <Sidebar collapsed={false} onToggle={() => setMobileMenuOpen(false)} />
            </Suspense>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 relative z-10 min-h-screen ${
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <Topbar
          sidebarCollapsed={sidebarCollapsed}
          onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          title={pageTitle}
        />

        <main className="flex-1 mt-18 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Suspense fallback={<div className="p-8 text-center text-[#fffde8]/50 text-xs">Loading operational state...</div>}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
