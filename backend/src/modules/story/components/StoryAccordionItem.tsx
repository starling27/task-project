import React, { useState, useEffect } from 'react';
import { ChevronRight, Hash, Trash2 } from 'lucide-react';
import { StatusDropdown } from './StatusDropdown';
import { AssigneeSelector } from '@modules/user/components/AssigneeSelector';
import { useBacklogStore } from '@core/store/useBacklogStore';

interface AccordionItemProps {
  id: string;
  title: string;
  status: string;
  priority: string;
  assigneeId?: string;
  points?: number;
  dueDate?: string | null;
  isOpen: boolean;
  onToggle: (id: string) => void;
  onUpdate: (id: string, updates: any) => Promise<void>;
  children: React.ReactNode;
}

export const StoryAccordionItem: React.FC<AccordionItemProps> = ({ 
  id, 
  title, 
  status, 
  priority, 
  assigneeId, 
  points, 
  dueDate,
  isOpen, 
  onToggle, 
  onUpdate,
  children 
}) => {
  const [localTitle, setLocalTitle] = useState(title);
  const { deleteStory } = useBacklogStore();

  useEffect(() => {
    setLocalTitle(title);
  }, [title]);

  // Debounced auto-save for title
  useEffect(() => {
    if (localTitle === title) return;

    const timer = setTimeout(async () => {
      await onUpdate(id, { title: localTitle });
    }, 500);

    return () => clearTimeout(timer);
  }, [localTitle, id, onUpdate, title]);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this story?')) {
      await deleteStory(id);
    }
  };

  return (
    <div className={`group transition-all duration-200 ${
      isOpen ? 'bg-white shadow-xl ring-1 ring-slate-200 my-4 rounded-xl' : 'bg-white border-b border-slate-100 hover:bg-slate-50'
    }`}>
      <div className="flex items-center px-6 py-3.5 gap-4">
        <div 
          className="p-1 hover:bg-slate-100 rounded-md cursor-pointer transition-colors"
          onClick={() => onToggle(id)}
        >
          <ChevronRight size={14} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-90 text-indigo-500' : ''}`} />
        </div>
        
        <div className="flex items-center gap-3 min-w-[100px]">
          <span className={`w-2 h-2 rounded-full ${getPriorityColor(priority)}`} />
          <span className="text-[11px] font-mono font-semibold text-slate-400">#{id.slice(-4)}</span>
        </div>

        <input
          className={`flex-1 text-sm font-medium bg-transparent border-none outline-none focus:ring-1 focus:ring-indigo-200 rounded px-2 py-1 transition-all ${isOpen ? 'text-indigo-600' : 'text-slate-700'}`}
          value={localTitle}
          onChange={(e) => setLocalTitle(e.target.value)}
          onClick={(e) => e.stopPropagation()}
        />

        <div className="flex items-center gap-4">
          <StatusDropdown storyId={id} currentStatus={status} />
          
          <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded text-slate-500 border border-slate-200">
            <Hash size={12} />
            <span className="text-[11px] font-bold">{points || 0}</span>
          </div>

          {dueDate && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 rounded text-amber-700 border border-amber-200">
              <span className="text-[10px] font-bold uppercase">{dueDate}</span>
            </div>
          )}

          <AssigneeSelector storyId={id} currentAssigneeId={assigneeId} />

          <button 
            onClick={handleDelete}
            className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover:opacity-100"
          >
            <Trash2 size={14} />
          </button>
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
