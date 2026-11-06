export type ClientStatus = 'active' | 'pending' | 'archived';

export interface Client {
  id: string;
  business_name: string;
  business_category: string;
  contact_name: string;
  email: string;
  phone?: string;
  website_url?: string;
  services_purchased: string[];
  status: ClientStatus;
  start_date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type ProjectStatus = 'Planned' | 'In Progress' | 'On Hold' | 'Completed' | 'Cancelled';
export type ServiceCategory = 'Website' | 'Automation' | 'Smart Review' | 'Other';

export interface Project {
  id: string;
  client_id: string;
  client_name?: string;
  name: string;
  service_category: ServiceCategory;
  description?: string;
  status: ProjectStatus;
  start_date: string;
  due_date: string;
  completed_date?: string;
  fee: number;
  assigned_member?: string;
  notes?: string;
}

export interface Review {
  id: string;
  client_id: string;
  client_name?: string;
  external_id?: string;
  rating: number; // 1 to 5
  review_text?: string;
  review_date: string;
  source: string;
  sentiment_label?: 'Positive' | 'Neutral' | 'Negative';
  sentiment_score?: number;
}

export type InvoiceStatus = 'Draft' | 'Sent' | 'Partially Paid' | 'Paid' | 'Overdue' | 'Cancelled';

export interface Invoice {
  id: string;
  invoice_number: string;
  client_id: string;
  client_name?: string;
  project_id?: string;
  issue_date: string;
  due_date: string;
  subtotal: number;
  tax: number;
  total_amount: number;
  status: InvoiceStatus;
  amount_paid: number;
  outstanding_balance: number;
}

export interface Payment {
  id: string;
  invoice_id: string;
  invoice_number?: string;
  client_name?: string;
  payment_date: string;
  amount_received: number;
  payment_method: string;
  reference_number?: string;
  notes?: string;
}

export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TaskStatus = 'Todo' | 'In Progress' | 'Completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  client_id?: string;
  client_name?: string;
  project_id?: string;
  assigned_to?: string;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string;
  completed_at?: string;
}

export interface KPISummary {
  totalClients: number;
  activeClients: number;
  activeProjects: number;
  completedProjects: number;
  overdueTasks: number;
  revenueReceived: number;
  outstandingBalance: number;
  averageRating: number | null;
  totalReviews: number;
}
