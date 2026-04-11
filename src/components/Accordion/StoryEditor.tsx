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
  // Dentro del return de StoryEditor:
  <div className="space-y-6 pt-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Descripción</label>
        <textarea
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm leading-relaxed focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all h-40 shadow-inner"
          value={localData.description}
          onChange={(e) => handleChange('description', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Criterios de Aceptación</label>
        <textarea
          className="w-full p-4 bg-slate-900 text-blue-100 border border-slate-800 rounded-xl text-xs font-mono leading-relaxed focus:ring-2 focus:ring-blue-500 outline-none transition-all h-40 shadow-2xl"
          value={localData.acceptanceCriteria}
          onChange={(e) => handleChange('acceptanceCriteria', e.target.value)}
        />
      </div>
    </div>
    
    {/* Indicador de autoguardado elegante */}
    <div className="flex items-center gap-2 justify-end px-2">
      <div className={`w-2 h-2 rounded-full ${saving ? 'bg-blue-500 animate-ping' : 'bg-emerald-500'}`} />
      <span className="text-[10px] font-bold text-slate-400 uppercase">
        {saving ? 'Sincronizando...' : 'Cambios guardados localmente'}
      </span>
    </div>
  </div>
  );
};
