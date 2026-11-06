'use client';

import React, { useState } from 'react';
import { X, CheckSquare, Building2, Calendar, AlertCircle } from 'lucide-react';
import { useApp } from '@/context/app-context';
import { TaskPriority, TaskStatus } from '@/types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description?: string;
    client_id?: string;
    client_name?: string;
    priority: TaskPriority;
    status: TaskStatus;
    due_date: string;
    assigned_to?: string;
  }) => void;
}

export function TaskModal({ isOpen, onClose, onSubmit }: TaskModalProps) {
  const { clients } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [clientId, setClientId] = useState<string>('');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) {
      setError('Please provide a task title and due date.');
      return;
    }

    const selectedClient = clients.find((c) => c.id === clientId);

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      client_id: clientId || undefined,
      client_name: selectedClient?.business_name,
      priority,
      status: 'Todo',
      due_date: dueDate,
      assigned_to: assignedTo.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-[#FAF7F0] border border-[#E3DED2] rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E3DED2]">
          <h2 className="text-base font-bold text-[#164A3A]">Create New Task</h2>
          <button onClick={onClose} className="p-1 rounded-md text-[#758078] hover:text-[#25342D]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-[#c83232]/10 border border-[#c83232]/20 flex items-center gap-2 text-xs text-[#c83232]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#25342D] mb-1">Task Title *</label>
            <div className="relative">
              <CheckSquare className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#758078]" />
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Test feedback QR sync"
                className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-lg border border-[#E3DED2] focus:outline-none focus:ring-1 focus:ring-[#164A3A] text-[#25342D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#25342D] mb-1">Related Client</label>
            <div className="relative">
              <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#758078]" />
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-lg border border-[#E3DED2] focus:outline-none focus:ring-1 focus:ring-[#164A3A] text-[#25342D]"
              >
                <option value="">(None / General Internal)</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.business_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#25342D] mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 text-xs bg-white rounded-lg border border-[#E3DED2] focus:outline-none focus:ring-1 focus:ring-[#164A3A] text-[#25342D]"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#25342D] mb-1">Due Date *</label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#758078]" />
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-lg border border-[#E3DED2] focus:outline-none focus:ring-1 focus:ring-[#164A3A] text-[#25342D]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#25342D] mb-1">Assigned Colleague</label>
            <input
              type="text"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              placeholder="e.g. Neha Verma"
              className="w-full px-3 py-2 text-xs bg-white rounded-lg border border-[#E3DED2] focus:outline-none focus:ring-1 focus:ring-[#164A3A] text-[#25342D]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#25342D] mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Checklist or instructions..."
              className="w-full px-3 py-2 text-xs bg-white rounded-lg border border-[#E3DED2] focus:outline-none focus:ring-1 focus:ring-[#164A3A] text-[#25342D]"
            />
          </div>

          <div className="pt-3 border-t border-[#E3DED2] flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#758078] hover:text-[#25342D] rounded-lg hover:bg-[#F4EFE4]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-[#164A3A] hover:bg-[#10382D] text-[#FAF7F0] rounded-lg shadow-xs"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
