import { Client, Project, Review, Invoice, Payment, Task, KPISummary } from '@/types';

// Zero initial sample records for production
export const mockClients: Client[] = [];
export const mockProjects: Project[] = [];
export const mockReviews: Review[] = [];
export const mockInvoices: Invoice[] = [];
export const mockPayments: Payment[] = [];
export const mockTasks: Task[] = [];

export function calculateKPISummary(
  clients: Client[],
  projects: Project[],
  invoices: Invoice[],
  payments: Payment[],
  tasks: Task[],
  reviews: Review[],
  currentDateIso?: string
): KPISummary {
  const activeClients = clients.filter((c) => c.status === 'active').length;
  const activeProjects = projects.filter(
    (p) => p.status === 'In Progress' || p.status === 'Planned'
  ).length;
  const completedProjects = projects.filter((p) => p.status === 'Completed').length;

  const overdueTasks = currentDateIso
    ? tasks.filter((t) => {
        if (t.status === 'Completed') return false;
        return new Date(t.due_date) < new Date(currentDateIso);
      }).length
    : 0;

  const revenueReceived = payments.reduce((acc, p) => acc + p.amount_received, 0);
  const outstandingBalance = invoices.reduce((acc, inv) => acc + inv.outstanding_balance, 0);

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1))
      : null;

  return {
    totalClients: clients.length,
    activeClients,
    activeProjects,
    completedProjects,
    overdueTasks,
    revenueReceived,
    outstandingBalance,
    averageRating,
    totalReviews,
  };
}
