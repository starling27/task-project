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
    <div className="space-y-4">
      {/* Indicador de Guardado */}
      <div className="flex justify-end h-4">
        {saving && <span className="text-xs text-blue-500 animate-pulse">Saving changes...</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Descripción */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
          <textarea
            className="w-full p-2 border rounded h-32 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={localData.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />
        </div>

        {/* Criterios de Aceptación */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Acceptance Criteria</label>
          <textarea
            className="w-full p-2 border rounded h-32 text-sm font-mono bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
            value={localData.acceptanceCriteria}
            onChange={(e) => handleChange('acceptanceCriteria', e.target.value)}
          />
        </div>
      </div>

      {/* Observaciones */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-gray-500 uppercase">Observations</label>
        <textarea
          className="w-full p-2 border rounded h-20 text-sm italic focus:ring-2 focus:ring-blue-500 outline-none"
          value={localData.observations}
          onChange={(e) => handleChange('observations', e.target.value)}
        />
      </div>
    </div>
  );
};
