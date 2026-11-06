import { Client, Project, Invoice, Payment, Task, Review } from '@/types';
import { formatCurrencyINR } from './utils';

export interface BusinessInsight {
  id: string;
  title: string;
  category: 'Revenue' | 'Projects' | 'Reviews' | 'Operations';
  severity: 'info' | 'warning' | 'success';
  explanation: string;
  metricComparison: string;
  actionRecommendation: string;
}

export function generateAutomatedInsights(
  clients: Client[],
  projects: Project[],
  invoices: Invoice[],
  payments: Payment[],
  tasks: Task[],
  reviews: Review[]
): BusinessInsight[] {
  const insights: BusinessInsight[] = [];
  const now = new Date('2026-03-15');

  // 1. Revenue & Cash Collection Insight
  const totalInvoiced = invoices.reduce((acc, i) => acc + i.total_amount, 0);
  const totalCollected = payments.reduce((acc, p) => acc + p.amount_received, 0);
  const collectionRate = totalInvoiced > 0 ? (totalCollected / totalInvoiced) * 100 : 0;

  if (totalInvoiced === 0) {
    insights.push({
      id: 'ins-rev-none',
      title: 'Insufficient Billing History',
      category: 'Revenue',
      severity: 'info',
      explanation: 'No client invoices have been issued in the system yet.',
      metricComparison: '₹0.00 Invoiced',
      actionRecommendation: 'Issue client milestone invoices from the Revenue module.',
    });
  } else if (collectionRate < 70) {
    const overdueCount = invoices.filter(
      (i) => i.status !== 'Paid' && i.status !== 'Cancelled' && new Date(i.due_date) < now
    ).length;

    insights.push({
      id: 'ins-rev-lag',
      title: 'Collection Liquidity Lag Detected',
      category: 'Revenue',
      severity: 'warning',
      explanation: `Cash collections stand at ${collectionRate.toFixed(1)}% of total accounts receivable. ${overdueCount} invoices are currently overdue.`,
      metricComparison: `Collected ${formatCurrencyINR(totalCollected)} of ${formatCurrencyINR(totalInvoiced)}`,
      actionRecommendation: 'Initiate automated payment reminders to clients with outstanding balances.',
    });
  } else {
    insights.push({
      id: 'ins-rev-healthy',
      title: 'Strong Cash Liquidity Ratio',
      category: 'Revenue',
      severity: 'success',
      explanation: `Operational collections exceed 70% threshold at ${collectionRate.toFixed(1)}%.`,
      metricComparison: `Collected ${formatCurrencyINR(totalCollected)}`,
      actionRecommendation: 'Maintain ongoing payment milestones and prompt billing cycles.',
    });
  }

  // 2. Project Delivery & Overdue Rate Insight
  const activeProjects = projects.filter((p) => p.status === 'In Progress' || p.status === 'Planned');
  const overdueProjects = projects.filter(
    (p) => p.status !== 'Completed' && p.status !== 'Cancelled' && new Date(p.due_date) < now
  );

  if (projects.length === 0) {
    insights.push({
      id: 'ins-proj-none',
      title: 'No Project Records Available',
      category: 'Projects',
      severity: 'info',
      explanation: 'No projects registered in the portfolio database.',
      metricComparison: '0 Active Projects',
      actionRecommendation: 'Create project records linked to clients to begin delivery tracking.',
    });
  } else if (overdueProjects.length > 0) {
    insights.push({
      id: 'ins-proj-overdue',
      title: 'Project Milestone Delay Alert',
      category: 'Projects',
      severity: 'warning',
      explanation: `${overdueProjects.length} of ${projects.length} contracted projects have exceeded their targeted delivery due dates without being finalized.`,
      metricComparison: `${((overdueProjects.length / projects.length) * 100).toFixed(0)}% Overdue Rate`,
      actionRecommendation: 'Review project delivery bottlenecks with assigned team leads.',
    });
  } else {
    insights.push({
      id: 'ins-proj-ontrack',
      title: 'All Active Deliverables On Schedule',
      category: 'Projects',
      severity: 'success',
      explanation: 'No projects currently exceed their target deadlines.',
      metricComparison: '0 Overdue Projects',
      actionRecommendation: 'Maintain standard weekly sprint cadence.',
    });
  }

  // 3. Customer Reviews & Sentiment Trend
  if (reviews.length < 3) {
    insights.push({
      id: 'ins-rev-sample',
      title: 'Limited Review Sample Size',
      category: 'Reviews',
      severity: 'info',
      explanation: `Only ${reviews.length} customer reviews are recorded. A sample of at least 5 reviews is recommended for reliable sentiment generalization.`,
      metricComparison: `${reviews.length} Records Logged`,
      actionRecommendation: 'Deploy Smart Review QR codes across client retail/office locations.',
    });
  } else {
    const negReviews = reviews.filter((r) => r.rating <= 2 || r.sentiment_label === 'Negative');
    const avgRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);

    if (negReviews.length > 0) {
      insights.push({
        id: 'ins-rev-neg',
        title: 'Customer Experience Friction Detected',
        category: 'Reviews',
        severity: 'warning',
        explanation: `${negReviews.length} customer reviews report dissatisfaction or star ratings ≤ 2. Average rating stands at ${avgRating} ★.`,
        metricComparison: `${negReviews.length} Critical Reviews`,
        actionRecommendation: 'Inspect feedback details in Smart Review Analytics and address recurring complaints.',
      });
    } else {
      insights.push({
        id: 'ins-rev-high',
        title: 'Exceptional Customer Satisfaction Benchmark',
        category: 'Reviews',
        severity: 'success',
        explanation: `100% of customer reviews are favorable with a high ${avgRating} ★ average satisfaction benchmark.`,
        metricComparison: `${avgRating} ★ / 5.0 Average`,
        actionRecommendation: 'Share positive case study testimonials in future client proposals.',
      });
    }
  }

  // 4. Task Urgency & Overdue Operations
  const overdueTasks = tasks.filter((t) => t.status !== 'Completed' && new Date(t.due_date) < now);
  if (overdueTasks.length > 0) {
    insights.push({
      id: 'ins-task-overdue',
      title: 'Pending Action Items Require Execution',
      category: 'Operations',
      severity: 'warning',
      explanation: `${overdueTasks.length} internal tasks have passed their scheduled completion date.`,
      metricComparison: `${overdueTasks.length} Overdue Tasks`,
      actionRecommendation: 'Reassign or complete priority tasks in the Task Operations board.',
    });
  }

  return insights;
}
