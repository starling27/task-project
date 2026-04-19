import React, { useState, useEffect } from 'react';
import { CommentSection } from '@modules/comment/components/CommentSection';
import { HistoryTimeline } from './HistoryTimeline';

interface StoryDetails {
  id: string;
  description: string;
  acceptanceCriteria: string;
  observations: string;
  dueDate?: string | null;
}

interface StoryEditorProps {
  story: StoryDetails;
  onSave: (id: string, updates: Partial<StoryDetails>) => Promise<void>;
}

export const StoryEditor: React.FC<StoryEditorProps> = ({ story, onSave }) => {
  const [localData, setLocalData] = useState(story);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'discussion' | 'history'>('content');

  useEffect(() => {
    setLocalData(story);
  }, [story]);

  // Debounced Auto-save
  useEffect(() => {
    if (JSON.stringify(localData) === JSON.stringify(story)) return;

    const timer = setTimeout(async () => {
      setSaving(true);
      setSaveError(null);
      try {
        await onSave(story.id, {
          description: localData.description,
          acceptanceCriteria: localData.acceptanceCriteria,
          observations: localData.observations,
          dueDate: localData.dueDate
        });
      } catch (error) {
        setSaveError('Save failed. Restored latest data from server.');
        setLocalData(story);
      } finally {
        setSaving(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localData, onSave, story]);

  const handleChange = (field: keyof StoryDetails, value: string) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        <button 
          onClick={() => setActiveTab('content')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${activeTab === 'content' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          Details
        </button>
        <button 
          onClick={() => setActiveTab('discussion')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${activeTab === 'discussion' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          Discussion
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${activeTab === 'history' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          History
        </button>
      </div>

      {activeTab === 'content' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Description</label>
              <textarea
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm leading-relaxed focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-40 shadow-inner"
                value={localData.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Acceptance Criteria</label>
              <textarea
                className="w-full p-4 bg-slate-900 text-blue-100 border border-slate-800 rounded-xl text-xs font-mono leading-relaxed focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-40 shadow-2xl"
                value={localData.acceptanceCriteria}
                onChange={(e) => handleChange('acceptanceCriteria', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Observations</label>
              <textarea
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm leading-relaxed focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-32 shadow-inner"
                value={localData.observations}
                onChange={(e) => handleChange('observations', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Due Date</label>
              <input
                type="date"
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner"
                value={localData.dueDate || ''}
                onChange={(e) => handleChange('dueDate', e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 justify-end">
            <div className={`w-2 h-2 rounded-full ${saving ? 'bg-indigo-500 animate-ping' : 'bg-emerald-500'}`} />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {saving ? 'Syncing...' : saveError ? 'Save failed' : 'All changes saved'}
            </span>
          </div>
          {saveError && <p className="text-[11px] text-red-500 text-right">{saveError}</p>}
        </div>
      )}

      {activeTab === 'discussion' && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <CommentSection storyId={story.id} />
        </div>
      )}

      {activeTab === 'history' && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <HistoryTimeline storyId={story.id} />
        </div>
      )}
    </div>
  );
};
