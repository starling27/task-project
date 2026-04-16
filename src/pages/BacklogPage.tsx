import React, { useEffect, useState } from 'react';
import { Trash2, UserPlus, Users, LogOut } from 'lucide-react';
import { useBacklogStore } from '../store/useBacklogStore';
import { useAuthStore } from '../store/useAuthStore';
import { StoryAccordionItem } from '../components/Accordion/AccordionItem';
import { StoryEditor } from '../components/Accordion/StoryEditor';
import { useStories } from '../hooks/useStories';
import { useProjects } from '../hooks/useProjects';
import { Filters } from '../components/Filters';
import { WorkflowPanel } from '../components/WorkflowPanel';
import { LoginPage } from './Auth/LoginPage';
import { AuthLoader } from '../components/Auth/AuthLoader';
import { EmailEntryForm } from '../components/Auth/EmailEntryForm';

export const BacklogPage: React.FC = () => {
  const { 
    fetchInitialData, 
    createEpic, 
    deleteEpic, 
    createStory, 
    epics, 
    users, 
    createUser, 
    deleteUser,
    filters
  } = useBacklogStore();
  const { projects, selectedProjectId, selectProject, createProject, deleteProject } = useProjects();
  const { stories, loading: storiesLoading, updateStoryStatus } = useStories();
  const { 
    isAuthenticated, 
    loading: authLoading, 
    initAuth, 
    logout, 
    user, 
    partialUser,
    setSession,
    setPartialSession,
    setError
  } = useAuthStore();

  const [openStoryId, setOpenStoryId] = useState<string | null>(null);
  const [workflowOpen, setWorkflowOpen] = useState(false);
  const [showUserList, setShowUserList] = useState(false);

  // Handle OAuth callback from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userJson = params.get('user');
    const partialUserJson = params.get('partialUser');
    const error = params.get('error');

    if (token && userJson) {
      try {
        setSession(token, JSON.parse(userJson));
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (err) {
        console.error('Failed to parse user from URL', err);
      }
    } else if (partialUserJson) {
      try {
        setPartialSession(JSON.parse(partialUserJson));
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (err) {
        console.error('Failed to parse partial user from URL', err);
      }
    } else if (error) {
      setError(error);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    initAuth();
  }, []);

  useEffect(() => { 
    if (isAuthenticated) {
      fetchInitialData(); 
    }
  }, [fetchInitialData, isAuthenticated]);

  const handleCreateEpic = async () => {
    if (!selectedProjectId) {
      alert('Please create or select a project first.');
      return;
    }

    const epicName = prompt('Epic name?');
    if (!epicName || epicName.trim() === '') return;
    await createEpic(selectedProjectId, epicName.trim(), '');
  };

  const handleCreateStory = async (epicId?: string) => {
    if (!selectedProjectId) {
      alert('Please create or select a project first.');
      return;
    }

    if (epics.length === 0) {
      const epicName = prompt('This project has no epics yet. Enter a name for the first epic:');
      if (!epicName || epicName.trim() === '') return;
      await createEpic(selectedProjectId, epicName.trim(), '');
      return;
    }

    const title = prompt('Story title?');
    if (!title) return;

    // Use provided epicId or fallback to the first epic
    const targetEpicId = epicId || epics[0]?.id;
    if (title && targetEpicId) {
      await createStory({ title, epicId: targetEpicId, description: '', priority: 'medium' });
    }
  };

  const handleCreateUser = async () => {
    const name = prompt('User Name?');
    if (!name) return;
    const email = prompt('User Email?');
    if (!email) return;
    await createUser(name, email);
  };

  const handleDeleteProject = async (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete the project "${name}" and all its contents?`)) {
      await deleteProject(id);
    }
  };

  const handleDeleteEpic = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the epic "${name}" and all its stories?`)) {
      await deleteEpic(id);
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete user "${name}"?`)) {
      await deleteUser(id);
    }
  };

  const filteredStories = stories.filter(s => 
    (filters.status.length === 0 || filters.status.includes(s.status)) &&
    (filters.priority.length === 0 || filters.priority.includes(s.priority)) &&
    (filters.assigneeId.length === 0 || (s.assigneeId && filters.assigneeId.includes(s.assigneeId)))
  );

  if (authLoading) return <AuthLoader />;
  if (partialUser) return <EmailEntryForm />;
  if (!isAuthenticated) return <LoginPage />;

  if (storiesLoading && projects.length === 0) return <div className="flex items-center justify-center h-screen bg-slate-50 text-indigo-500 font-medium">Loading Workspace...</div>;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      <div className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shadow-xl z-20">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center shrink-0">
          <h2 className="font-bold text-lg tracking-tight text-white">Projects</h2>
          <button onClick={() => { const n = prompt('Project name?'); if(n) createProject(n, ''); }} className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-indigo-500 transition-colors text-white">+</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {projects.map(p => (
            <div key={p.id} onClick={() => selectProject(p.id)} className={`group px-4 py-3 cursor-pointer rounded-xl transition-all text-sm font-medium flex justify-between items-center ${selectedProjectId === p.id ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <span className="truncate mr-2">{p.name}</span>
              <button 
                onClick={(e) => handleDeleteProject(e, p.id, p.name)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500 hover:text-white rounded transition-all"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 p-2 bg-slate-800/50 rounded-xl">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white uppercase">
                {user?.name?.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
            </div>
            <button 
              onClick={() => logout()}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
              title="Cerrar sesión"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="bg-white border-b border-slate-200 px-8 h-16 flex justify-between items-center z-10 shrink-0">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">{projects.find(p => p.id === selectedProjectId)?.name || 'Select a Project'}</h1>
            {selectedProjectId && (
              <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded-lg text-xs font-bold border border-slate-200">
                {filteredStories.length} stories found
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 relative">
            <div className="relative">
              <button
                onClick={() => setShowUserList(!showUserList)}
                className="bg-white text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold border border-slate-300 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
              >
                <Users size={16} />
                Team
              </button>
              
              {showUserList && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-2xl z-[100] p-4">
                  <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800 text-sm">Manage Team</h3>
                    <button 
                      onClick={handleCreateUser}
                      className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all"
                      title="Add User"
                    >
                      <UserPlus size={14} />
                    </button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {users.map(u => (
                      <div key={u.id} className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-lg group transition-colors">
                        <div className="flex items-center gap-2 min-w-0">
                          {u.avatarUrl ? (
                            <img src={u.avatarUrl} alt={u.name} className="w-6 h-6 rounded-full" />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="text-xs font-medium text-slate-700 truncate">{u.name}</span>
                        </div>
                        <button 
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-all"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                    {users.length === 0 && <div className="text-center py-4 text-xs text-slate-400">No users found</div>}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setWorkflowOpen(true)}
              disabled={!selectedProjectId}
              className="bg-white text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold border border-slate-300 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Workflow
            </button>
            <button
              onClick={handleCreateEpic}
              disabled={!selectedProjectId}
              className="bg-white text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold border border-slate-300 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + New Epic
            </button>
          </div>
        </header>

        {selectedProjectId && <Filters />}

        <main className="flex-1 overflow-y-auto p-8 bg-slate-50">
          <div className="max-w-5xl mx-auto">
            {epics.length === 0 ? (
              <section className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-sm">
                <h2 className="text-lg font-semibold text-slate-800">No epics yet</h2>
                <p className="text-sm text-slate-500 mt-2">Create your first epic to start adding stories to this project.</p>
                <button
                  onClick={handleCreateEpic}
                  disabled={!selectedProjectId}
                  className="mt-6 bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-600 transition-all shadow-sm disabled:bg-indigo-300 disabled:cursor-not-allowed"
                >
                  + Create First Epic
                </button>
              </section>
            ) : filteredStories.length === 0 && stories.length > 0 ? (
              <section className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-sm animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users size={32} />
                </div>
                <h2 className="text-lg font-semibold text-slate-800">No stories match your filters</h2>
                <p className="text-sm text-slate-500 mt-2">Try adjusting your filters or clear them to see all stories.</p>
                <button
                  onClick={() => useBacklogStore.getState().clearFilters()}
                  className="mt-6 text-indigo-500 font-bold text-sm hover:underline"
                >
                  Clear all filters
                </button>
              </section>
            ) : (
              epics.map(epic => (
                <section key={epic.id} className="mb-8">
                  <div className="flex items-center justify-between mb-3 px-2">
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 text-xs font-bold tracking-widest uppercase">Epic</span>
                      <h2 className="text-base font-bold text-slate-800">{epic.name}</h2>
                      <span className="px-2 py-0.5 bg-slate-200 text-[10px] text-slate-600 rounded font-bold">{filteredStories.filter(s => s.epicId === epic.id).length}</span>
                      <button 
                        onClick={() => handleDeleteEpic(epic.id, epic.name)}
                        className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-all"
                        title="Delete Epic"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <button 
                      onClick={() => handleCreateStory(epic.id)}
                      className="text-[10px] font-bold text-indigo-500 hover:text-indigo-600 uppercase tracking-widest"
                    >
                      + New Story
                    </button>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    {filteredStories.filter(s => s.epicId === epic.id).map(story => (
                      <StoryAccordionItem 
                        key={story.id} 
                        {...story} 
                        isOpen={openStoryId === story.id} 
                        onToggle={(id: string) => setOpenStoryId(openStoryId === id ? null : id)}
                        onUpdate={async (id, updates) => { await updateStoryStatus(id, updates); }}
                      >
                        <StoryEditor story={story as any} onSave={async (id, updates) => { await updateStoryStatus(id, updates); }} />
                      </StoryAccordionItem>
                    ))}
                    {filteredStories.filter(s => s.epicId === epic.id).length === 0 && <div className="p-6 text-center text-sm text-slate-400">No stories in this epic</div>}
                  </div>
                </section>
              ))
            )}
          </div>
        </main>
      </div>

      {workflowOpen && selectedProjectId && (
        <WorkflowPanel projectId={selectedProjectId} onClose={() => setWorkflowOpen(false)} />
      )}
    </div>
  );
};
