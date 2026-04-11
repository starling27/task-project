import { ChevronDown, User, Hash } from 'lucide-react';

export const StoryAccordionItem = ({ id, title, status, priority, assignee, points, isOpen, onToggle, children }) => {
  return (
    <div className={`group bg-white border rounded-xl transition-all duration-300 ${
      isOpen ? 'shadow-xl border-blue-200 ring-1 ring-blue-100' : 'shadow-sm border-slate-200 hover:border-slate-300'
    }`}>
      <div 
        className="grid grid-cols-12 gap-4 items-center p-4 cursor-pointer"
        onClick={() => onToggle(id)}
      >
        <div className="col-span-6 flex items-center gap-3">
          <div className={`transition-transform duration-300 ${isOpen ? 'rotate-0 text-blue-600' : '-rotate-90 text-slate-400'}`}>
            <ChevronDown size={18} />
          </div>
          <span className={`w-2 h-2 rounded-full shrink-0 ${getPriorityDot(priority)}`} />
          <h3 className={`text-sm font-semibold truncate ${isOpen ? 'text-blue-700' : 'text-slate-700'}`}>
            {title}
          </h3>
        </div>

        <div className="col-span-2 flex justify-center">
          <span className={`text-[10px] px-2.5 py-1 font-bold uppercase tracking-wider rounded-full border ${getStatusStyles(status)}`}>
            {status.replace('_', ' ')}
          </span>
        </div>

        <div className="col-span-2 flex justify-center">
          <span className="bg-slate-100 text-slate-600 text-[11px] px-2 py-1 rounded-lg font-mono flex items-center gap-1 border border-slate-200">
             <Hash size={12} /> {points || 0}
          </span>
        </div>

        <div className="col-span-2 flex justify-end">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 hidden sm:block">
              {assignee?.split(' ')[0] || 'Sin asignar'}
            </span>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 border border-blue-200">
               <User size={14} />
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="px-6 pb-6 pt-2 border-t border-slate-50 animate-in fade-in slide-in-from-top-2">
          {children}
        </div>
      )}
    </div>
  );
};

const getPriorityDot = (p) => {
  if (p === 'critical') return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]';
  if (p === 'high') return 'bg-orange-500';
  return 'bg-blue-400';
};

const getStatusStyles = (s) => {
  if (s === 'done' || s === 'integrated') return 'bg-emerald-50 text-emerald-700 border-emerald-100';
  if (s === 'in_progress') return 'bg-amber-50 text-amber-700 border-amber-100';
  return 'bg-slate-50 text-slate-500 border-slate-200';
};