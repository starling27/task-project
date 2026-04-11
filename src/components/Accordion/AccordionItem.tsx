import { ChevronRight, Hash, User } from 'lucide-react';

export const StoryAccordionItem = ({ id, title, status, priority, assignee, points, isOpen, onToggle, children }) => {
  return (
    <div className={`group transition-all duration-200 ${
      isOpen ? 'bg-white shadow-xl ring-1 ring-slate-200 my-4 rounded-xl' : 'bg-white border-b border-slate-100 hover:bg-slate-50'
    }`}>
      <div 
        className="flex items-center px-6 py-3.5 cursor-pointer gap-4"
        onClick={() => onToggle(id)}
      >
        {/* Indicador de apertura - Pequeño y discreto */}
        <ChevronRight size={14} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-90 text-brand-primary' : ''}`} />
        
        {/* Prioridad + ID */}
        <div className="flex items-center gap-3 min-w-[100px]">
          <span className={`w-2 h-2 rounded-full ${getPriorityColor(priority)}`} />
          <span className="text-[11px] font-mono font-semibold text-slate-400">#{id.slice(-4)}</span>
        </div>

        {/* Título - Más pequeño (text-sm) */}
        <h3 className={`flex-1 text-sm font-medium truncate ${isOpen ? 'text-brand-primary' : 'text-slate-700'}`}>
          {title}
        </h3>

        {/* Badges - Más compactos */}
        <div className="flex items-center gap-4">
          <span className={`text-[10px] px-2.5 py-0.5 font-bold uppercase tracking-tighter rounded-md border ${getStatusStyles(status)}`}>
            {status}
          </span>
          
          <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded text-slate-500 border border-slate-200">
            <Hash size={12} />
            <span className="text-[11px] font-bold">{points || 0}</span>
          </div>

          {/* Avatar - Borde redondeado perfecto */}
          <div className="w-7 h-7 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-brand-primary overflow-hidden">
             <User size={12} />
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="px-14 pb-6 pt-2 animate-in fade-in zoom-in-95 duration-200">
          <div className="border-t border-slate-100 pt-4">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

// Colores más suaves para los puntos de prioridad
const getPriorityColor = (p: string) => {
  const colors: Record<string, string> = {
    critical: 'bg-red-500',
    high: 'bg-orange-400',
    medium: 'bg-blue-400',
    low: 'bg-slate-300'
  };
  return colors[p] || colors.medium;
};

const getStatusStyles = (s: string) => {
  if (s === 'done' || s === 'integrated') return 'bg-emerald-50 text-emerald-600 border-emerald-100';
  if (s === 'in_progress') return 'bg-amber-50 text-amber-600 border-amber-100';
  return 'bg-slate-50 text-slate-500 border-slate-200';
};