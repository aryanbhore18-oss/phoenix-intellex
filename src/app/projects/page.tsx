'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/app-context';
import { formatCurrencyINR, formatDate } from '@/lib/utils';
import { ProjectModal } from '@/components/projects/project-modal';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Building2,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  PieChart,
} from 'lucide-react';
import { ProjectStatus, ServiceCategory } from '@/types';

export default function ProjectsPage() {
  const { projects, addProject } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.client_name && p.client_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.assigned_member && p.assigned_member.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || p.service_category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Calculate real performance metrics
  const activeCount = projects.filter((p) => p.status === 'In Progress' || p.status === 'Planned').length;
  const completedCount = projects.filter((p) => p.status === 'Completed').length;
  const nonCancelledCount = projects.filter((p) => p.status !== 'Cancelled').length;
  const completionRate = nonCancelledCount > 0 ? ((completedCount / nonCancelledCount) * 100).toFixed(0) : 0;
  const totalPipelineFees = projects.reduce((acc, p) => acc + p.fee, 0);

  const now = new Date('2026-03-15');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#164A3A]">Project Portfolio</h1>
          <p className="text-xs text-[#758078]">
            Work delivery tracking, scope management, and completion rates.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#164A3A] hover:bg-[#10382D] text-[#FAF7F0] text-xs font-semibold rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4 text-[#B89B5E]" />
          Create Project
        </button>
      </div>

      {/* Aggregate Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FAF7F0] p-4 rounded-xl border border-[#E3DED2] flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#164A3A]/10 text-[#164A3A]">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-[#758078] uppercase">Total Projects</div>
            <div className="text-xl font-bold text-[#164A3A]">{projects.length}</div>
          </div>
        </div>

        <div className="bg-[#FAF7F0] p-4 rounded-xl border border-[#E3DED2] flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#286653]/10 text-[#286653]">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-[#758078] uppercase">Active Delivery</div>
            <div className="text-xl font-bold text-[#286653]">{activeCount}</div>
          </div>
        </div>

        <div className="bg-[#FAF7F0] p-4 rounded-xl border border-[#E3DED2] flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#1b8755]/10 text-[#1b8755]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-[#758078] uppercase">Completion Rate</div>
            <div className="text-xl font-bold text-[#1b8755]">{completionRate}%</div>
          </div>
        </div>

        <div className="bg-[#FAF7F0] p-4 rounded-xl border border-[#E3DED2] flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#B89B5E]/15 text-[#8E743A]">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-[#758078] uppercase">Total Portfolio Value</div>
            <div className="text-xl font-bold text-[#164A3A]">{formatCurrencyINR(totalPipelineFees)}</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#FAF7F0] p-4 rounded-xl border border-[#E3DED2] flex flex-col md:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#758078]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search projects, client, team lead..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-lg border border-[#E3DED2] focus:outline-none focus:ring-1 focus:ring-[#164A3A] text-[#25342D]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-[#758078]">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-medium">Filter:</span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white rounded-lg border border-[#E3DED2] text-[#25342D] focus:outline-none focus:ring-1 focus:ring-[#164A3A]"
          >
            <option value="all">All Statuses</option>
            <option value="Planned">Planned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white rounded-lg border border-[#E3DED2] text-[#25342D] focus:outline-none focus:ring-1 focus:ring-[#164A3A]"
          >
            <option value="all">All Service Types</option>
            <option value="Website">Website</option>
            <option value="Automation">Automation</option>
            <option value="Smart Review">Smart Review</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-[#FAF7F0] rounded-xl border border-[#E3DED2] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F4EFE4]/60 border-b border-[#E3DED2] text-[#758078] font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Project Name</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Service Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Lead</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-right">Fee (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3DED2]/70 text-[#25342D]">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#758078]">
                    No projects found for the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => {
                  const isOverdue =
                    project.status !== 'Completed' &&
                    project.status !== 'Cancelled' &&
                    new Date(project.due_date) < now;

                  return (
                    <tr key={project.id} className="hover:bg-[#F4EFE4]/40 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-[#164A3A]">
                        <div>{project.name}</div>
                        {project.description && (
                          <div className="text-[11px] text-[#758078] font-normal truncate max-w-xs">
                            {project.description}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="flex items-center gap-1.5 font-medium text-[#25342D]">
                          <Building2 className="w-3.5 h-3.5 text-[#758078]" />
                          {project.client_name || 'Unassigned'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded bg-white border border-[#E3DED2] text-[10px] font-medium text-[#25342D]">
                          {project.service_category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                            project.status === 'Completed'
                              ? 'bg-[#1b8755]/15 text-[#1b8755]'
                              : project.status === 'In Progress'
                              ? 'bg-[#164A3A]/15 text-[#164A3A]'
                              : project.status === 'Planned'
                              ? 'bg-[#B89B5E]/20 text-[#8E743A]'
                              : project.status === 'On Hold'
                              ? 'bg-[#c27d14]/15 text-[#c27d14]'
                              : 'bg-[#758078]/15 text-[#758078]'
                          }`}
                        >
                          {project.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#758078]">{project.assigned_member || '—'}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className={isOverdue ? 'text-[#c83232] font-semibold' : 'text-[#758078]'}>
                            {formatDate(project.due_date)}
                          </span>
                          {isOverdue && (
                            <span title="Overdue deadline">
                              <AlertTriangle className="w-3.5 h-3.5 text-[#c83232]" />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-[#164A3A]">
                        {formatCurrencyINR(project.fee)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addProject}
      />
    </div>
  );
}
