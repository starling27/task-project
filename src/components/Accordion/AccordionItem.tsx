import React from 'react';
import { ChevronRight, Hash } from 'lucide-react';
import { StatusDropdown } from '../StatusDropdown';
import { AssigneeSelector } from '../AssigneeSelector';

interface AccordionItemProps {
  id: string;
  title: string;
  status: string;
  priority: string;
  assigneeId?: string;
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
  assigneeId, 
  points, 
  isOpen, 
  onToggle, 
  children 
}) => {
  return (
    <div className={`group transition-all duration-200 ${
      isOpen ? 'bg-white shadow-xl ring-1 ring-slate-200 my-4 rounded-xl' : 'bg-white border-b border-slate-100 hover:bg-slate-50'
    }`}>
      <div 
        className="flex items-center px-6 py-3.5 cursor-pointer gap-4"
        onClick={() => onToggle(id)}
      >
        <ChevronRight size={14} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-90 text-indigo-500' : ''}`} />
        
        <div className="flex items-center gap-3 min-w-[100px]">
          <span className={`w-2 h-2 rounded-full ${getPriorityColor(priority)}`} />
          <span className="text-[11px] font-mono font-semibold text-slate-400">#{id.slice(-4)}</span>
        </div>

        <h3 className={`flex-1 text-sm font-medium truncate ${isOpen ? 'text-indigo-600' : 'text-slate-700'}`}>
          {title}
        </h3>

        <div className="flex items-center gap-4">
          <StatusDropdown storyId={id} currentStatus={status} />
          
          <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded text-slate-500 border border-slate-200">
            <Hash size={12} />
            <span className="text-[11px] font-bold">{points || 0}</span>
          </div>

          <AssigneeSelector storyId={id} currentAssigneeId={assigneeId} />
        </div>
      </div>

      {isOpen && (
        <div className="px-14 pb-6 pt-2">
          <div className="border-t border-slate-100 pt-4">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

const getPriorityColor = (p: string) => {
  const colors: Record<string, string> = {
    critical: 'bg-red-500',
    high: 'bg-orange-400',
    medium: 'bg-blue-400',
    low: 'bg-slate-300'
  };
  return colors[p] || colors.medium;
};
