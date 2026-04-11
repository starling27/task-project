import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { LayoutDashboard, Database, RefreshCw, Search, CheckCircle2, User, Hash, ChevronDown } from 'lucide-react';
import { useBacklogStore } from './store/useBacklogStore';
import { StoryAccordionItem } from './components/Accordion/AccordionItem';
import { StoryEditor } from './components/Accordion/StoryEditor';

// Estilos globales rápidos por si acaso el CSS no carga
const App = () => {
  const { stories, fetchStories, loading } = useBacklogStore();
  const [openStoryId, setOpenStoryId] = useState<string | null>(null);

  useEffect(() => { 
    // Intentamos cargar los datos al iniciar
    fetchStories().catch(err => console.error("Error cargando historias:", err));
  }, [fetchStories]);

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 flex flex-col shrink-0 shadow-xl text-white">
        <div className="p-6">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-xl mb-10">
            <Database size={20} />
            <span>TaskSync</span>
          </div>
          <nav className="space-y-1">
            <NavItem icon={<LayoutDashboard size={18}/>} label="Dashboard" />
            <NavItem icon={<Database size={18}/>} label="Backlog" active />
            <NavItem icon={<RefreshCw size={18}/>} label="Jira Sync" />
          </nav>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-lg font-bold text-slate-800">Backlog Global</h1>
          <button 
            onClick={() => fetchStories()} 
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Cargando...' : 'Sincronizar'}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">
            {!stories || stories.length === 0 ? (
              <div className="text-center py-20 bg-white border-2 border-dashed rounded-2xl text-slate-400">
                {loading ? "Conectando con el backend..." : "No se encontraron historias en la base de datos."}
              </div>
            ) : (
              <div className="space-y-3">
                {stories.map(story => (
                  <StoryAccordionItem 
                    key={story.id} 
                    id={story.id}
                    title={story.title || "Sin título"}
                    status={story.status || "backlog"}
                    priority={story.priority || "medium"}
                    assignee={story.assigneeId || "Unassigned"}
                    points={story.storyPoints || 0}
                    isOpen={openStoryId === story.id}
                    onToggle={(id) => setOpenStoryId(openStoryId === id ? null : id)}
                  >
                    {/* Pasamos datos seguros al editor */}
                    <StoryEditor 
                       story={{
                         id: story.id, 
                         description: '', 
                         acceptanceCriteria: '', 
                         observations: ''
                       }} 
                       onSave={async () => {}} 
                    />
                  </StoryAccordionItem>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

const NavItem = ({ icon, label, active = false }: any) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
    active ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'
  }`}>
    {icon} <span>{label}</span>
  </div>
)

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}