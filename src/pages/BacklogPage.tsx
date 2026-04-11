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

  useEffect(() => {
    fetchInitialData();
  }, []);

  if (loading && projects.length === 0) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const handleToggle = (id: string) => {
    setOpenStoryId(openStoryId === id ? null : id);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-gray-900">
      {/* Sidebar - Projects */}
      <div className="w-64 bg-gray-900 text-white flex flex-col border-r border-gray-800 shadow-xl z-20">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h2 className="font-bold text-lg tracking-tight">Projects</h2>
          <button 
            onClick={() => {
              const name = prompt('Project name?');
              if (name) createProject(name, '');
            }}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition-colors text-indigo-400"
          >
            +
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {projects.map(p => (
            <div 
              key={p.id}
              onClick={() => selectProject(p.id)}
              className={`px-4 py-3 cursor-pointer rounded-lg transition-all duration-200 ${
                selectedProjectId === p.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20 font-medium' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              }`}
            >
              {p.name}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-center shadow-sm z-10">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {projects.find(p => p.id === selectedProjectId)?.name || 'Select a Project'}
            </h1>
            <div className="flex bg-gray-100 rounded-lg p-1 text-sm font-medium">
              <button 
                onClick={() => setGroupBy('epic')}
                className={`px-4 py-1.5 rounded-md transition-all ${groupBy === 'epic' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                By Epic
              </button>
              <button 
                onClick={() => setGroupBy('sprint')}
                className={`px-4 py-1.5 rounded-md transition-all ${groupBy === 'sprint' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                By Sprint
              </button>
            </div>
          </div>
          
          <button 
            onClick={() => {
              const title = prompt('Story title?');
              const epicId = epics[0]?.id;
              if (title && epicId) createStory({ title, epicId, description: '', priority: 'medium', status: 'unassigned' });
              else if (!epicId) alert('Create an epic first!');
            }}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20 active:scale-95"
          >
            + New Story
          </button>
        </header>

        {/* Backlog Container */}
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
          <div className="max-w-5xl mx-auto space-y-10">
            {groupBy === 'epic' ? (
              epics.map(epic => (
                <section key={epic.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-3">
                      <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
                      {epic.name}
                    </h2>
                    <span className="px-3 py-1 bg-white border border-gray-200 text-xs text-gray-500 rounded-full font-bold shadow-sm">
                      {stories.filter(s => s.epicId === epic.id).length} Stories
                    </span>
                  </div>
                  
                  <div className="p-6 space-y-3">
                    {stories.filter(s => s.epicId === epic.id).map(story => (
                      <StoryAccordionItem
                        key={story.id}
                        id={story.id}
                        title={story.title}
                        status={story.status}
                        priority={story.priority}
                        points={story.storyPoints}
                        assignee={users.find(u => u.id === story.assigneeId)?.name}
                        isOpen={openStoryId === story.id}
                        onToggle={handleToggle}
                      >
                        <StoryEditor 
                          story={story as any} 
                          onSave={async (id, updates) => {
                            await updateStory(id, updates);
                          }} 
                        />
                      </StoryAccordionItem>
                    ))}
                    {stories.filter(s => s.epicId === epic.id).length === 0 && (
                      <div className="text-sm text-gray-400 text-center py-10 border-2 border-dashed border-gray-100 rounded-xl">
                        <p className="font-medium">No stories in this epic.</p>
                        <p className="text-xs mt-1">Add a story to get started.</p>
                      </div>
                    )}
                  </div>
                </section>
              ))
            ) : (
              sprints.map(sprint => (
                <section key={sprint.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-3">
                      <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                      {sprint.name}
                    </h2>
                    <span className="px-3 py-1 bg-white border border-gray-200 text-xs text-gray-500 rounded-full font-bold shadow-sm capitalize">
                      {sprint.status}
                    </span>
                  </div>
                  <div className="p-6 space-y-3">
                    {stories.filter(s => s.sprintId === sprint.id).map(story => (
                      <StoryAccordionItem
                        key={story.id}
                        id={story.id}
                        title={story.title}
                        status={story.status}
                        priority={story.priority}
                        points={story.storyPoints}
                        assignee={users.find(u => u.id === story.assigneeId)?.name}
                        isOpen={openStoryId === story.id}
                        onToggle={handleToggle}
                      >
                        <StoryEditor 
                          story={story as any} 
                          onSave={async (id, updates) => {
                            await updateStory(id, updates);
                          }} 
                        />
                      </StoryAccordionItem>
                    ))}
                  </div>
                </section>
              ))
            )}
            
            {epics.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">📁</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-700">No epics found</h3>
                <p className="text-sm mt-1 mb-6">Create an epic to organize your user stories.</p>
                <button 
                  onClick={() => {
                    const name = prompt('Epic name?');
                    if (name && selectedProjectId) createEpic(selectedProjectId, name, '');
                  }}
                  className="bg-white text-indigo-600 border border-indigo-200 px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-50 transition-colors shadow-sm"
                >
                  Create First Epic
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
