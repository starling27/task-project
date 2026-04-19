import React, { useEffect, useState } from 'react';
import { useBacklogStore, HistoryItem } from '@core/store/useBacklogStore';

interface HistoryTimelineProps {
  storyId: string;
}

export const HistoryTimeline: React.FC<HistoryTimelineProps> = ({ storyId }) => {
  const { fetchHistory } = useBacklogStore();
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    fetchHistory(storyId).then(setHistory);
  }, [storyId]);

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b pb-2">Audit Trail</h4>
      
      <div className="max-h-60 overflow-y-auto space-y-4 pr-2 pl-2">
        {history.map((item) => (
          <div key={item.id} className="relative pl-6 border-l-2 border-slate-100 last:pb-0 pb-4 animate-in fade-in slide-in-from-left-2 duration-300">
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-slate-200" />
            
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-bold uppercase mb-1">
                {new Date((item as any).changedAt || (item as any).assignedAt).toLocaleDateString()} {new Date((item as any).changedAt || (item as any).assignedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              
              {item.type === 'status' ? (
                <div className="text-xs text-gray-600 bg-white p-2 border border-gray-100 rounded-lg shadow-sm">
                  Status changed: <span className="font-bold text-gray-400">{item.oldStatus}</span> → <span className="font-bold text-indigo-600">{item.newStatus}</span>
                </div>
              ) : (
                <div className="text-xs text-gray-600 bg-white p-2 border border-gray-100 rounded-xl shadow-sm">
                  Assignee changed: <span className="font-bold text-indigo-600">{item.newAssignee?.name || 'Unassigned'}</span>
                </div>
              )}
            </div>
          </div>
        ))}
        {history.length === 0 && <p className="text-xs text-gray-400 italic py-4 text-center">No history recorded yet.</p>}
      </div>
    </div>
  );
};
