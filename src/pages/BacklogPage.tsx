import React, { useEffect, useState } from 'react';
import { useBacklogStore } from '../store/useBacklogStore';
import { StoryAccordionItem } from '../components/Accordion/AccordionItem';
import { StoryEditor } from '../components/Accordion/StoryEditor';

export const BacklogPage: React.FC = () => {
  const { 
    projects, epics, stories, sprints, users, loading, selectedProjectId,
    fetchInitialData, selectProject, createProject, createEpic, createStory, updateStory 
  } = useBacklogStore();

  const [openStoryId, setOpenStoryId] = useState<string | null>(null);
  const [groupBy, setGroupBy] = useState<'epic' | 'sprint'>('epic');

  useEffect(() => { fetchInitialData(); }, [fetchInitialData]);

  if (loading && projects.length === 0) return <div className="flex items-center justify-center h-screen bg-slate-50 text-indigo-500 font-medium">Loading Workspace...</div>;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      <div className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shadow-xl z-20">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h2 className="font-bold text-lg tracking-tight text-white">Projects</h2>
          <button onClick={() => { const n = prompt('Project name?'); if(n) createProject(n, ''); }} className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-indigo-500 transition-colors text-white">+</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {projects.map(p => (
            <div key={p.id} onClick={() => selectProject(p.id)} className={`px-4 py-3 cursor-pointer rounded-xl transition-all text-sm font-medium ${selectedProjectId === p.id ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              {p.name}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="bg-white border-b border-slate-200 px-8 h-16 flex justify-between items-center z-10 shrink-0">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">{projects.find(p => p.id === selectedProjectId)?.name || 'Select a Project'}</h1>
            <div className="flex bg-slate-100 rounded-lg p-1 text-xs font-semibold border border-slate-200">
              <button onClick={() => setGroupBy('epic')} className={`px-3 py-1.5 rounded-md transition-all ${groupBy === 'epic' ? 'bg-white text-indigo-500 shadow-sm' : 'text-slate-500'}`}>By Epic</button>
              <button onClick={() => setGroupBy('sprint')} className={`px-3 py-1.5 rounded-md transition-all ${groupBy === 'sprint' ? 'bg-white text-indigo-500 shadow-sm' : 'text-slate-500'}`}>By Sprint</button>
            </div>
          </div>
          <button onClick={() => {
              const title = prompt('Story title?');
              const epicId = epics[0]?.id;
              if (title && epicId) createStory({ title, epicId, description: '', priority: 'medium', status: 'unassigned' });
            }} className="bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-600 transition-all shadow-sm">
            + New Story
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-slate-50">
          <div className="max-w-5xl mx-auto">
            {groupBy === 'epic' ? epics.map(epic => (
              <section key={epic.id} className="mb-8">
                <div className="flex items-center gap-3 mb-3 px-2">
                  <span className="text-slate-400 text-xs font-bold tracking-widest uppercase">Epic</span>
                  <h2 className="text-base font-bold text-slate-800">{epic.name}</h2>
                  <span className="px-2 py-0.5 bg-slate-200 text-[10px] text-slate-600 rounded font-bold">{stories.filter(s => s.epicId === epic.id).length}</span>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  {stories.filter(s => s.epicId === epic.id).map(story => (
                    <StoryAccordionItem key={story.id} {...story} isOpen={openStoryId === story.id} onToggle={(id: string) => setOpenStoryId(openStoryId === id ? null : id)}>
                      <StoryEditor story={story as any} onSave={async (id, updates) => { await updateStory(id, updates); }} />
                    </StoryAccordionItem>
                  ))}
                  {stories.filter(s => s.epicId === epic.id).length === 0 && <div className="p-6 text-center text-sm text-slate-400">No stories in this epic</div>}
                </div>
              </section>
            )) : <div className="text-center text-slate-500 py-10">Sprint view logic here</div>}
          </div>
        </main>
      </div>
    </div>
  );
};