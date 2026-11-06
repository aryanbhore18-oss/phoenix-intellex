import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Sora, Syne } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/app-context';
import { AppShell } from '@/components/layout/app-shell';
import { ToastProvider } from '@/context/toast-context';

// Fonts matching Phoenix Tech Solutions brand architecture
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-sora',
  display: 'swap',
});

const syne = Syne({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Phoenix Intellex | Turn Data Into Decisions',
  description: 'Enterprise Business Intelligence, Workflow Automation & Web Engineering Operations Platform for Phoenix Tech Solutions',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} ${sora.variable} ${syne.variable}`}>
      <body className="min-h-screen bg-[#0a1410] text-[#fffde8] font-sans antialiased selection:bg-[#026047] selection:text-[#fffde8]">
        <ToastProvider>
          <AppProvider>
            <AppShell pageTitle="Executive Intelligence">
              {children}
            </AppShell>
          </AppProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
