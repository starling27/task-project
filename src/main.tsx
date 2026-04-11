import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { LayoutDashboard, Database, RefreshCw } from 'lucide-react';
import { useBacklogStore } from './store/useBacklogStore';
import { StoryAccordionItem } from './components/Accordion/AccordionItem';
import { StoryEditor } from './components/Accordion/StoryEditor';

const App = () => {
  const { stories, fetchStories, loading } = useBacklogStore();
  const [openStoryId, setOpenStoryId] = useState<string | null>(null);

  useEffect(() => { fetchStories().catch(err => console.error(err)); }, [fetchStories]);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      <aside className="w-64 bg-slate-900 flex flex-col shrink-0 shadow-xl text-slate-300 border-r border-slate-800">
        <div className="p-6">
          <div className="flex items-center gap-3 text-white font-bold text-xl mb-10 px-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center"><Database size={16} /></div>
            <span>TaskFlow</span>
          </div>
          <nav className="space-y-1">
            <NavItem icon={<LayoutDashboard size={18}/>} label="Dashboard" />
            <NavItem icon={<Database size={18}/>} label="Backlog" active />
            <NavItem icon={<RefreshCw size={18}/>} label="Jira Sync" />
          </nav>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 shadow-sm z-10">
          <h1 className="text-lg font-bold text-slate-800">Global Backlog</h1>
          <button onClick={() => fetchStories()} className="flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-600 transition-all">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Syncing...' : 'Sync'}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">
             <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                {stories?.map(story => (
                  <StoryAccordionItem key={story.id} {...story} isOpen={openStoryId === story.id} onToggle={(id: string) => setOpenStoryId(openStoryId === id ? null : id)}>
                    <StoryEditor story={{ id: story.id, description: '', acceptanceCriteria: '', observations: ''}} onSave={async () => {}} />
                  </StoryAccordionItem>
                ))}
             </div>
          </div>
        </div>
      </main>
    </div>
  )
}

const NavItem = ({ icon, label, active = false }: any) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${active ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
    {icon} <span>{label}</span>
  </div>
)

const rootElement = document.getElementById('root');
if (rootElement) ReactDOM.createRoot(rootElement).render(<React.StrictMode><App /></React.StrictMode>);