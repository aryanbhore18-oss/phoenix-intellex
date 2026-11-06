'use client';

import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: Toast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    // Auto-dismiss after 4.5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}

      {/* Toast Notification Container in Top-Right */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => {
            const isSuccess = toast.type === 'success';
            const isWarning = toast.type === 'warning';
            const isError = toast.type === 'error';

            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="pointer-events-auto surface-card p-4 rounded-2xl flex items-start gap-3 shadow-[0_12px_35px_rgba(0,0,0,0.6)] border border-[#fffde8]/15 bg-[#0f1c16]/95 backdrop-blur-xl relative overflow-hidden group"
              >
                {/* Status indicator line */}
                <div
                  className={`absolute top-0 left-0 bottom-0 w-1 ${
                    isSuccess
                      ? 'bg-[#0aa603]'
                      : isWarning
                      ? 'bg-[#c27d14]'
                      : isError
                      ? 'bg-[#ef4444]'
                      : 'bg-[#026047]'
                  }`}
                />

                <div className="shrink-0 mt-0.5">
                  {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#0aa603]" />}
                  {isWarning && <AlertTriangle className="w-5 h-5 text-[#c27d14]" />}
                  {isError && <AlertCircle className="w-5 h-5 text-[#ef4444]" />}
                  {toast.type === 'info' && <Info className="w-5 h-5 text-[#026047]" />}
                </div>

                <div className="flex-1 min-w-0 pr-2">
                  <h4 className="text-xs font-bold text-[#fffde8] font-display tracking-tight">
                    {toast.title}
                  </h4>
                  {toast.description && (
                    <p className="text-[11px] text-[#fffde8]/60 mt-0.5 leading-relaxed font-sans">
                      {toast.description}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => removeToast(toast.id)}
                  className="shrink-0 p-1 rounded-lg text-[#fffde8]/40 hover:text-[#fffde8] hover:bg-[#fffde8]/10 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
