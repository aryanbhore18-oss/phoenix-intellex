'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client, Project, Review, Invoice, Payment, Task, KPISummary } from '@/types';
import { calculateKPISummary } from '@/lib/mock-data';
import { useToast } from '@/context/toast-context';

interface AppContextType {
  clients: Client[];
  projects: Project[];
  reviews: Review[];
  invoices: Invoice[];
  payments: Payment[];
  tasks: Task[];
  kpis: KPISummary;
  isLoaded: boolean;
  dateRange: string;
  setDateRange: (range: string) => void;
  addClient: (client: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  toggleTaskStatus: (id: string) => void;
  addReview: (review: Omit<Review, 'id'>) => void;
  addPayment: (payment: Omit<Payment, 'id'>) => void;
  clearAllData: () => void;
}

const initialKPIs: KPISummary = {
  totalClients: 0,
  activeClients: 0,
  activeProjects: 0,
  completedProjects: 0,
  overdueTasks: 0,
  revenueReceived: 0,
  outstandingBalance: 0,
  averageRating: null,
  totalReviews: 0,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dateRange, setDateRange] = useState<string>('30d');
  const [isLoaded, setIsLoaded] = useState(false);
  const [kpis, setKpis] = useState<KPISummary>(initialKPIs);

  // Toast hook — available because ToastProvider wraps AppProvider
  const { showToast } = useToast();

  // Load from browser localStorage inside client-side useEffect
  useEffect(() => {
    try {
      const storedClients = localStorage.getItem('phoenix_clients');
      const storedProjects = localStorage.getItem('phoenix_projects');
      const storedReviews = localStorage.getItem('phoenix_reviews');
      const storedInvoices = localStorage.getItem('phoenix_invoices');
      const storedPayments = localStorage.getItem('phoenix_payments');
      const storedTasks = localStorage.getItem('phoenix_tasks');

      const loadedClients = storedClients ? JSON.parse(storedClients) : [];
      const loadedProjects = storedProjects ? JSON.parse(storedProjects) : [];
      const loadedReviews = storedReviews ? JSON.parse(storedReviews) : [];
      const loadedInvoices = storedInvoices ? JSON.parse(storedInvoices) : [];
      const loadedPayments = storedPayments ? JSON.parse(storedPayments) : [];
      const loadedTasks = storedTasks ? JSON.parse(storedTasks) : [];

      setClients(loadedClients);
      setProjects(loadedProjects);
      setReviews(loadedReviews);
      setInvoices(loadedInvoices);
      setPayments(loadedPayments);
      setTasks(loadedTasks);

      const nowIso = new Date().toISOString();
      setKpis(
        calculateKPISummary(
          loadedClients,
          loadedProjects,
          loadedInvoices,
          loadedPayments,
          loadedTasks,
          loadedReviews,
          nowIso
        )
      );
    } catch {
      // LocalStorage error or SSR
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Update localStorage and KPIs whenever state changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('phoenix_clients', JSON.stringify(clients));
      localStorage.setItem('phoenix_projects', JSON.stringify(projects));
      localStorage.setItem('phoenix_reviews', JSON.stringify(reviews));
      localStorage.setItem('phoenix_invoices', JSON.stringify(invoices));
      localStorage.setItem('phoenix_payments', JSON.stringify(payments));
      localStorage.setItem('phoenix_tasks', JSON.stringify(tasks));
    } catch {
      // ignore
    }

    const nowIso = new Date().toISOString();
    setKpis(calculateKPISummary(clients, projects, invoices, payments, tasks, reviews, nowIso));
  }, [clients, projects, reviews, invoices, payments, tasks, isLoaded]);

  const addClient = (newCli: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
    const id = `cli-${Date.now()}`;
    const timestamp = new Date().toISOString();
    const client: Client = {
      ...newCli,
      id,
      created_at: timestamp,
      updated_at: timestamp,
    };
    setClients((prev) => [client, ...prev]);
    showToast({
      type: 'success',
      title: 'Client Profile Created',
      description: `${client.business_name} was securely added to your enterprise directory.`,
    });
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c))
    );
    showToast({
      type: 'info',
      title: 'Client Updated',
      description: 'The client record and parameters have been synchronized.',
    });
  };

  const addProject = (newProj: Omit<Project, 'id'>) => {
    const id = `proj-${Date.now()}`;
    setProjects((prev) => [{ ...newProj, id }, ...prev]);
    showToast({
      type: 'success',
      title: 'Project Initiated',
      description: `Contract scope for "${newProj.name}" is now active in delivery.`,
    });
  };

  const addTask = (newTask: Omit<Task, 'id'>) => {
    const id = `task-${Date.now()}`;
    setTasks((prev) => [{ ...newTask, id }, ...prev]);
    showToast({
      type: 'success',
      title: 'Operational Task Queued',
      description: `Action item assigned with ${newTask.priority} priority.`,
    });
  };

  const toggleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === 'Completed' ? 'Todo' : 'Completed';
          const isDone = nextStatus === 'Completed';
          showToast({
            type: isDone ? 'success' : 'info',
            title: isDone ? 'Task Completed' : 'Task Reopened',
            description: `"${t.title}" marked as ${nextStatus}.`,
          });
          return {
            ...t,
            status: nextStatus,
            completed_at: nextStatus === 'Completed' ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };

  const addReview = (newRev: Omit<Review, 'id'>) => {
    const id = `rev-${Date.now()}`;
    setReviews((prev) => [{ ...newRev, id }, ...prev]);
    showToast({
      type: 'success',
      title: 'Smart Review Recorded',
      description: `New verified review received (${newRev.rating}★ rating logged).`,
    });
  };

  const addPayment = (newPay: Omit<Payment, 'id'>) => {
    const id = `pay-${Date.now()}`;
    const payment = { ...newPay, id };
    setPayments((prev) => [payment, ...prev]);

    // Reconcile Invoice
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === newPay.invoice_id) {
          const newPaid = inv.amount_paid + newPay.amount_received;
          const newOutstanding = Math.max(0, inv.total_amount - newPaid);
          const newStatus =
            newOutstanding <= 0 ? 'Paid' : newPaid > 0 ? 'Partially Paid' : inv.status;
          return {
            ...inv,
            amount_paid: newPaid,
            outstanding_balance: newOutstanding,
            status: newStatus,
          };
        }
        return inv;
      })
    );

    showToast({
      type: 'success',
      title: 'Payment Reconciled',
      description: `Inflow of ₹${newPay.amount_received.toLocaleString('en-IN')} successfully settled.`,
    });
  };

  const clearAllData = () => {
    setClients([]);
    setProjects([]);
    setReviews([]);
    setInvoices([]);
    setPayments([]);
    setTasks([]);
    localStorage.clear();
    showToast({
      type: 'warning',
      title: 'Storage Cleared',
      description: 'All local operational records have been reset to zero.',
    });
  };

  return (
    <AppContext.Provider
      value={{
        clients,
        projects,
        reviews,
        invoices,
        payments,
        tasks,
        kpis,
        isLoaded,
        dateRange,
        setDateRange,
        addClient,
        updateClient,
        addProject,
        addTask,
        toggleTaskStatus,
        addReview,
        addPayment,
        clearAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
