import React, { useEffect, useMemo, useState } from 'react';
import { useBacklogStore, WorkflowState } from '@core/store/useBacklogStore';

interface WorkflowPanelProps {
  projectId: string;
  onClose: () => void;
}

export const WorkflowPanel: React.FC<WorkflowPanelProps> = ({ projectId, onClose }) => {
  const { workflowStates, fetchWorkflowStatesByProject, createWorkflowState, updateWorkflowState, deleteWorkflowState } = useBacklogStore();
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#94a3b8');

  const sortedStates = useMemo(() => {
    return [...workflowStates].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [workflowStates]);

  useEffect(() => {
    fetchWorkflowStatesByProject(projectId);
  }, [fetchWorkflowStatesByProject, projectId]);

  const handleCreate = async () => {
    const name = newName.trim();
    if (!name) return;
    setCreating(true);
    try {
      await createWorkflowState(projectId, { name, color: newColor, order: sortedStates.length });
      setNewName('');
    } finally {
      setCreating(false);
    }
  };

  const patch = async (state: WorkflowState, updates: Partial<WorkflowState>) => {
    await updateWorkflowState(projectId, state.id, updates);
  };

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-white border-l border-slate-200 shadow-2xl flex flex-col">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Workflow</h2>
            <p className="text-xs text-slate-500 mt-1">Configure states for this project.</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900 text-sm font-semibold">
            Close
          </button>
        </div>

        <div className="p-6 border-b border-slate-200 space-y-3">
          <div className="flex gap-3 items-center">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="New state name"
              className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="color"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="h-10 w-12 rounded-lg border border-slate-200 bg-white"
              title="Color"
            />
            <button
              onClick={handleCreate}
              disabled={creating || !newName.trim()}
              className="px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm font-semibold disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {sortedStates.map((s) => (
            <div key={s.id} className="border border-slate-200 rounded-xl p-4 bg-white">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color || '#94a3b8' }} />
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-800 truncate">{s.name}</div>
                    <div className="text-[11px] text-slate-500">Order: {s.order ?? 0}</div>
                  </div>
                </div>
                <button
                  onClick={() => deleteWorkflowState(projectId, s.id)}
                  className="text-xs font-semibold text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={!!s.isInitial}
                    onChange={(e) => patch(s, { isInitial: e.target.checked })}
                  />
                  Initial
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={!!s.isFinal}
                    onChange={(e) => patch(s, { isFinal: e.target.checked })}
                  />
                  Final
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={!!s.isDefault}
                    onChange={(e) => patch(s, { isDefault: e.target.checked })}
                  />
                  Default
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600">Color</span>
                  <input
                    type="color"
                    value={s.color || '#94a3b8'}
                    onChange={(e) => patch(s, { color: e.target.value })}
                    className="h-8 w-10 rounded border border-slate-200 bg-white"
                  />
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <span className="text-xs text-slate-600">Name</span>
                  <input
                    defaultValue={s.name}
                    onBlur={(e) => {
                      const value = e.target.value.trim();
                      if (value && value !== s.name) patch(s, { name: value });
                      if (!value) e.target.value = s.name;
                    }}
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <span className="text-xs text-slate-600">Order</span>
                  <input
                    type="number"
                    defaultValue={s.order ?? 0}
                    onBlur={(e) => {
                      const n = Number(e.target.value);
                      if (!Number.isNaN(n) && n !== s.order) patch(s, { order: n });
                    }}
                    className="w-24 px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          ))}

          {sortedStates.length === 0 && (
            <div className="text-center text-sm text-slate-500 py-10">No states yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};
