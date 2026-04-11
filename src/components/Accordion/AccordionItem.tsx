import React, { useState } from 'react';

interface AccordionItemProps {
  id: string;
  title: string;
  status: string;
  priority: string;
  assignee?: string;
  points?: number;
  isOpen: boolean;
  onToggle: (id: string) => void;
  children: React.ReactNode;
}

export const StoryAccordionItem: React.FC<AccordionItemProps> = ({
  id,
  title,
  status,
  priority,
  assignee,
  points,
  isOpen,
  onToggle,
  children
}) => {
  return (
    <div className={`border rounded mb-2 overflow-hidden ${isOpen ? 'ring-2 ring-blue-500' : ''}`}>
      {/* Header */}
      <div 
        className="flex items-center justify-between p-3 cursor-pointer bg-white hover:bg-gray-50 select-none"
        onClick={() => onToggle(id)}
      >
        <div className="flex items-center gap-3">
          <span className={`px-2 py-1 text-xs font-bold rounded ${getPriorityColor(priority)}`}>
            {priority.toUpperCase()}
          </span>
          <h3 className="font-medium text-gray-800">{title}</h3>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="bg-gray-100 px-2 py-0.5 rounded">{points || '-'} pts</span>
          <span className={`capitalize px-2 rounded-full ${getStatusColor(status)}`}>
            {status.replace('_', ' ')}
          </span>
          <span className="w-24 text-right truncate">{assignee || 'Unassigned'}</span>
        </div>
      </div>

      {/* Details Panel */}
      {isOpen && (
        <div className="p-4 bg-gray-50 border-t">
          {children}
        </div>
      )}
    </div>
  );
};

const getPriorityColor = (p: string) => {
  switch (p) {
    case 'critical': return 'bg-red-100 text-red-800';
    case 'high': return 'bg-orange-100 text-orange-800';
    case 'medium': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusColor = (s: string) => {
  if (s === 'done' || s === 'integrated') return 'bg-green-100 text-green-800';
  if (s === 'in_progress') return 'bg-yellow-100 text-yellow-800';
  return 'bg-gray-200 text-gray-700';
};
