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
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
      {/* Sidebar - Projects */}
      <div className="w-64 bg-white border-r flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-bold text-gray-700">Projects</h2>
          <button 
            onClick={() => {
              const name = prompt('Project name?');
              if (name) createProject(name, '');
            }}
            className="text-blue-500 hover:text-blue-700 font-bold"
          >
            +
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {projects.map(p => (
            <div 
              key={p.id}
              onClick={() => selectProject(p.id)}
              className={`p-2 cursor-pointer rounded mb-1 ${selectedProjectId === p.id ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-gray-50'}`}
            >
              {p.name}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b p-4 flex justify-between items-center shadow-sm z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-800">
              {projects.find(p => p.id === selectedProjectId)?.name || 'Select a Project'}
            </h1>
            <div className="flex bg-gray-100 rounded p-1 text-sm">
              <button 
                onClick={() => setGroupBy('epic')}
                className={`px-3 py-1 rounded ${groupBy === 'epic' ? 'bg-white shadow-sm' : ''}`}
              >
                By Epic
              </button>
              <button 
                onClick={() => setGroupBy('sprint')}
                className={`px-3 py-1 rounded ${groupBy === 'sprint' ? 'bg-white shadow-sm' : ''}`}
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
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            + New Story
          </button>
        </header>

        {/* Backlog Container */}
        <main className="flex-1 overflow-y-auto p-6 space-y-8">
          {groupBy === 'epic' ? (
            epics.map(epic => (
              <section key={epic.id}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                    <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                    {epic.name}
                  </h2>
                  <span className="text-xs text-gray-400 uppercase font-bold">
                    {stories.filter(s => s.epicId === epic.id).length} Stories
                  </span>
                </div>
                
                <div className="space-y-2">
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
                    <div className="text-sm text-gray-400 italic p-4 border border-dashed rounded">No stories in this epic.</div>
                  )}
                </div>
              </section>
            ))
          ) : (
            sprints.map(sprint => (
              <section key={sprint.id}>
                <h2 className="text-lg font-bold text-gray-700 mb-4">{sprint.name}</h2>
                <div className="space-y-2">
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
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <p className="mb-4">No epics found for this project.</p>
              <button 
                onClick={() => {
                  const name = prompt('Epic name?');
                  if (name && selectedProjectId) createEpic(selectedProjectId, name, '');
                }}
                className="text-blue-500 border border-blue-500 px-4 py-2 rounded hover:bg-blue-50"
              >
                Create First Epic
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
