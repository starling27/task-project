import React, { useState, useEffect, useCallback } from 'react';

interface StoryDetails {
  id: string;
  description: string;
  acceptanceCriteria: string;
  observations: string;
}

interface StoryEditorProps {
  story: StoryDetails;
  onSave: (id: string, updates: Partial<StoryDetails>) => Promise<void>;
}

export const StoryEditor: React.FC<StoryEditorProps> = ({ story, onSave }) => {
  const [localData, setLocalData] = useState(story);
  const [saving, setSaving] = useState(false);

  // Debounced Auto-save
  useEffect(() => {
    if (JSON.stringify(localData) === JSON.stringify(story)) return;

    const timer = setTimeout(async () => {
      setSaving(true);
      await onSave(story.id, {
        description: localData.description,
        acceptanceCriteria: localData.acceptanceCriteria,
        observations: localData.observations
      });
      setSaving(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [localData, onSave, story]);

  const handleChange = (field: keyof StoryDetails, value: string) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Indicador de Guardado */}
      <div className="flex justify-between items-center h-6">
        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Story Details</h4>
        <div className="flex items-center gap-2">
          {saving ? (
            <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold animate-pulse border border-indigo-100">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping"></span>
              SAVING CHANGES...
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold border border-emerald-100">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              ALL CHANGES SAVED
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Descripción */}
        <div className="flex flex-col gap-2 group">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description</label>
            <span className="text-[10px] text-gray-300 font-medium group-focus-within:text-indigo-400 transition-colors uppercase">Markdown Supported</span>
          </div>
          <textarea
            className="w-full p-4 border border-gray-200 rounded-xl h-48 text-sm text-gray-700 bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none shadow-sm"
            placeholder="Describe the user story and its business value..."
            value={localData.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />
        </div>

        {/* Criterios de Aceptación */}
        <div className="flex flex-col gap-2 group">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Acceptance Criteria</label>
            <span className="text-[10px] text-gray-300 font-medium group-focus-within:text-indigo-400 transition-colors uppercase">Gherkin Format Recommended</span>
          </div>
          <textarea
            className="w-full p-4 border border-gray-200 rounded-xl h-48 text-sm font-mono text-gray-600 bg-gray-50/50 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none shadow-sm"
            placeholder="Given... When... Then..."
            value={localData.acceptanceCriteria}
            onChange={(e) => handleChange('acceptanceCriteria', e.target.value)}
          />
        </div>
      </div>

      {/* Observaciones */}
      <div className="flex flex-col gap-2 group">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Collaborator Observations</label>
        <textarea
          className="w-full p-4 border border-gray-200 rounded-xl h-24 text-sm italic text-gray-600 bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none shadow-sm"
          placeholder="Add any technical notes or blocking observations..."
          value={localData.observations}
          onChange={(e) => handleChange('observations', e.target.value)}
        />
      </div>
    </div>
  );
};
