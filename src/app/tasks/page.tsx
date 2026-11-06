'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/app-context';
import { formatDate } from '@/lib/utils';
import { TaskModal } from '@/components/tasks/task-modal';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Calendar,
  AlertCircle,
  Building2,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { TaskPriority, TaskStatus } from '@/types';

export default function TasksPage() {
  const { tasks, addTask, toggleTaskStatus } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const now = new Date('2026-03-15');

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.client_name && t.client_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.assigned_to && t.assigned_to.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const todoCount = tasks.filter((t) => t.status === 'Todo').length;
  const inProgressCount = tasks.filter((t) => t.status === 'In Progress').length;
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;
  const overdueCount = tasks.filter(
    (t) => t.status !== 'Completed' && new Date(t.due_date) < now
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#164A3A]">Task Operations</h1>
          <p className="text-xs text-[#758078]">
            Action items, internal milestones, and deliverable checklists.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#164A3A] hover:bg-[#10382D] text-[#FAF7F0] text-xs font-semibold rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4 text-[#B89B5E]" />
          New Task
        </button>
      </div>

      {/* Task Status Overview Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#FAF7F0] p-4 rounded-xl border border-[#E3DED2] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-[#758078] uppercase">To-Do</div>
            <div className="text-xl font-bold text-[#25342D]">{todoCount}</div>
          </div>
          <Clock className="w-5 h-5 text-[#758078]" />
        </div>

        <div className="bg-[#FAF7F0] p-4 rounded-xl border border-[#E3DED2] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-[#758078] uppercase">In Progress</div>
            <div className="text-xl font-bold text-[#164A3A]">{inProgressCount}</div>
          </div>
          <CheckSquare className="w-5 h-5 text-[#164A3A]" />
        </div>

        <div className="bg-[#FAF7F0] p-4 rounded-xl border border-[#E3DED2] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-[#758078] uppercase">Completed</div>
            <div className="text-xl font-bold text-[#1b8755]">{completedCount}</div>
          </div>
          <CheckCircle className="w-5 h-5 text-[#1b8755]" />
        </div>

        <div className="bg-[#FAF7F0] p-4 rounded-xl border border-[#E3DED2] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-[#758078] uppercase">Overdue</div>
            <div className="text-xl font-bold text-[#c83232]">{overdueCount}</div>
          </div>
          <AlertCircle className="w-5 h-5 text-[#c83232]" />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#FAF7F0] p-4 rounded-xl border border-[#E3DED2] flex flex-col md:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#758078]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tasks, client, or assignee..."
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
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white rounded-lg border border-[#E3DED2] text-[#25342D] focus:outline-none focus:ring-1 focus:ring-[#164A3A]"
          >
            <option value="all">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-[#FAF7F0] rounded-xl border border-[#E3DED2] shadow-xs overflow-hidden">
        <div className="divide-y divide-[#E3DED2]">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#758078]">
              No tasks match your active filters.
            </div>
          ) : (
            filteredTasks.map((task) => {
              const isOverdue = task.status !== 'Completed' && new Date(task.due_date) < now;
              const isDone = task.status === 'Completed';

              return (
                <div
                  key={task.id}
                  className="p-4 hover:bg-[#F4EFE4]/50 transition-colors flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0 ${
                        isDone
                          ? 'bg-[#1b8755] border-[#1b8755] text-white'
                          : 'bg-white border-[#E3DED2] hover:border-[#164A3A]'
                      }`}
                    >
                      {isDone && <CheckCircle className="w-3.5 h-3.5" />}
                    </button>

                    <div>
                      <h4
                        className={`text-xs font-semibold ${
                          isDone ? 'line-through text-[#758078]' : 'text-[#25342D]'
                        }`}
                      >
                        {task.title}
                      </h4>

                      {task.description && (
                        <p className="text-[11px] text-[#758078] mt-0.5 leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-[#758078]">
                        {task.client_name && (
                          <span className="flex items-center gap-1 font-medium text-[#164A3A]">
                            <Building2 className="w-3 h-3" />
                            {task.client_name}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Due: {formatDate(task.due_date)}
                        </span>
                        {task.assigned_to && <span>Assignee: {task.assigned_to}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isOverdue && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#c83232]/15 text-[#c83232] uppercase">
                        Overdue
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        task.priority === 'Urgent'
                          ? 'bg-[#c83232]/15 text-[#c83232]'
                          : task.priority === 'High'
                          ? 'bg-[#c27d14]/15 text-[#c27d14]'
                          : task.priority === 'Medium'
                          ? 'bg-[#B89B5E]/20 text-[#8E743A]'
                          : 'bg-[#164A3A]/10 text-[#164A3A]'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addTask}
      />
    </div>
  );
}
