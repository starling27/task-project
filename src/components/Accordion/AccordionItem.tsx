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
    <div className={`group bg-white border rounded-xl overflow-hidden transition-all duration-300 ${
      isOpen ? 'ring-2 ring-indigo-500 shadow-xl scale-[1.01] mb-4' : 'hover:shadow-md hover:border-indigo-200'
    }`}>
      {/* Header */}
      <div 
        className={`flex items-center justify-between p-4 cursor-pointer select-none transition-colors ${
          isOpen ? 'bg-indigo-50/30' : 'bg-white hover:bg-gray-50/50'
        }`}
        onClick={() => onToggle(id)}
      >
        <div className="flex items-center gap-4 flex-1">
          <div className={`w-1.5 h-8 rounded-full ${getPriorityStripColor(priority)}`}></div>
          <div className="flex flex-col">
            <h3 className={`font-semibold text-gray-800 transition-colors ${isOpen ? 'text-indigo-900' : ''}`}>
              {title}
            </h3>
            <div className="flex items-center gap-3 mt-1">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${getPriorityColor(priority)}`}>
                {priority}
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{points || 0} Points</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full shadow-sm transition-all ${getStatusColor(status)}`}>
            {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
          
          <div className="flex items-center gap-3 border-l pl-6 border-gray-100">
            <span className="text-xs font-medium text-gray-500 hidden sm:block">{assignee || 'Unassigned'}</span>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm transition-transform group-hover:scale-110 ${assignee ? 'bg-indigo-500' : 'bg-gray-300'}`}>
              {assignee ? assignee.charAt(0).toUpperCase() : '?'}
            </div>
          </div>
        </div>
      </div>

      {/* Details Panel */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-8 bg-gradient-to-b from-white to-gray-50 border-t border-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
};

const getPriorityStripColor = (p: string) => {
  switch (p) {
    case 'critical': return 'bg-red-500';
    case 'high': return 'bg-orange-500';
    case 'medium': return 'bg-indigo-400';
    default: return 'bg-gray-300';
  }
};

const getPriorityColor = (p: string) => {
  switch (p) {
    case 'critical': return 'bg-red-50 text-red-600 border border-red-100';
    case 'high': return 'bg-orange-50 text-orange-600 border border-orange-100';
    case 'medium': return 'bg-indigo-50 text-indigo-600 border border-indigo-100';
    default: return 'bg-gray-50 text-gray-600 border border-gray-100';
  }
};

const getStatusColor = (s: string) => {
  switch (s) {
    case 'integrated':
    case 'done': 
      return 'bg-emerald-100 text-emerald-700';
    case 'in_progress': 
      return 'bg-blue-100 text-blue-700';
    case 'blocked':
      return 'bg-red-100 text-red-700';
    case 'in_pr_review':
      return 'bg-amber-100 text-amber-700';
    case 'assigned':
      return 'bg-indigo-100 text-indigo-700';
    default: 
      return 'bg-gray-100 text-gray-600';
  }
};
