import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { useBacklogStore, FiltersState } from '../store/useBacklogStore';

interface DropdownProps {
  label: string;
  options: { id: string; name: string; color?: string | null }[];
  selected: string[];
  onToggle: (id: string) => void;
  onClear: () => void;
}

const FilterDropdown: React.FC<DropdownProps> = ({ label, options, selected, onToggle, onClear }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
          selected.length > 0 
            ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
        }`}
      >
        <span>{label}</span>
        {selected.length > 0 && (
          <span className="flex items-center justify-center bg-indigo-600 text-white text-[10px] w-4 h-4 rounded-full">
            {selected.length}
          </span>
        )}
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 max-h-72 overflow-y-auto">
          <div className="flex justify-between items-center px-2 py-1 mb-1 border-b border-slate-50">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
            {selected.length > 0 && (
              <button 
                onClick={(e) => { e.stopPropagation(); onClear(); }}
                className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800"
              >
                Clear
              </button>
            )}
          </div>
          {options.map(option => (
            <div
              key={option.id}
              onClick={() => onToggle(option.id)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${
                selected.includes(option.id) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white'
              }`}>
                {selected.includes(option.id) && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
              </div>
              <span className="text-sm text-slate-700 flex-1">{option.name}</span>
              {option.color && (
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: option.color }} />
              )}
            </div>
          ))}
          {options.length === 0 && (
            <div className="px-2 py-4 text-center text-xs text-slate-400">No options available</div>
          )}
        </div>
      )}
    </div>
  );
};

export const Filters: React.FC = () => {
  const { filters, workflowStates, users, toggleFilter, setFilters, clearFilters } = useBacklogStore();

  const priorities = [
    { id: 'low', name: 'Low' },
    { id: 'medium', name: 'Medium' },
    { id: 'high', name: 'High' },
    { id: 'critical', name: 'Critical' }
  ];

  const hasActiveFilters = filters.status.length > 0 || filters.priority.length > 0 || filters.assigneeId.length > 0;

  const renderBadges = () => {
    const badges: { type: keyof FiltersState; id: string; name: string }[] = [];
    
    filters.status.forEach(id => {
      const state = workflowStates.find(s => s.id === id);
      if (state) badges.push({ type: 'status', id, name: state.name });
    });
    
    filters.priority.forEach(id => {
      const p = priorities.find(p => p.id === id);
      if (p) badges.push({ type: 'priority', id, name: p.name });
    });
    
    filters.assigneeId.forEach(id => {
      const u = users.find(u => u.id === id);
      if (u) badges.push({ type: 'assigneeId', id, name: u.name });
    });

    return badges.map(badge => (
      <div 
        key={`${badge.type}-${badge.id}`}
        className="flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-bold border border-indigo-100 animate-in fade-in zoom-in duration-200"
      >
        <span>{badge.name}</span>
        <button 
          onClick={() => toggleFilter(badge.type, badge.id)}
          className="hover:bg-indigo-200 rounded-full p-0.5 transition-colors"
        >
          <X size={10} />
        </button>
      </div>
    ));
  };

  return (
    <div className="flex flex-col gap-2 p-3 bg-white border-b border-slate-100">
      <div className="flex gap-2 items-center">
        <FilterDropdown
          label="Status"
          options={workflowStates.map(s => ({ id: s.id, name: s.name, color: s.color }))}
          selected={filters.status}
          onToggle={(id) => toggleFilter('status', id)}
          onClear={() => setFilters({ status: [] })}
        />
        
        <FilterDropdown
          label="Priority"
          options={priorities}
          selected={filters.priority}
          onToggle={(id) => toggleFilter('priority', id)}
          onClear={() => setFilters({ priority: [] })}
        />

        <FilterDropdown
          label="Assignee"
          options={users.map(u => ({ id: u.id, name: u.name }))}
          selected={filters.assigneeId}
          onToggle={(id) => toggleFilter('assigneeId', id)}
          onClear={() => setFilters({ assigneeId: [] })}
        />

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-slate-500 hover:text-red-600 transition-colors ml-2"
          >
            <X size={14} />
            Reset All
          </button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-50 mt-1">
          {renderBadges()}
        </div>
      )}
    </div>
  );
};
