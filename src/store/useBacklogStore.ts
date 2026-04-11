import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
}

export interface Epic {
  id: string;
  projectId: string;
  name: string;
  description?: string;
}

export interface Sprint {
  id: string;
  projectId: string;
  name: string;
  goal?: string;
  status: string;
}

export interface Story {
  id: string;
  epicId: string;
  sprintId?: string;
  assigneeId?: string;
  title: string;
  description: string;
  storyPoints?: number;
  priority: string;
  status: string;
  acceptanceCriteria?: string;
  observations?: string;
  assignee?: User;
}

interface BacklogState {
  projects: Project[];
  epics: Epic[];
  sprints: Sprint[];
  stories: Story[];
  users: User[];
  
  selectedProjectId: string | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchInitialData: () => Promise<void>;
  selectProject: (id: string) => void;
  
  // Projects
  createProject: (name: string, description: string) => Promise<void>;
  
  // Epics
  createEpic: (projectId: string, name: string, description: string) => Promise<void>;
  
  // Sprints
  createSprint: (projectId: string, name: string, goal: string) => Promise<void>;
  
  // Stories
  fetchStories: () => Promise<void>;
  createStory: (data: Partial<Story>) => Promise<void>;
  updateStory: (id: string, updates: Partial<Story>) => Promise<void>;
}

export const useBacklogStore = create<BacklogState>((set, get) => ({
  projects: [],
  epics: [],
  sprints: [],
  stories: [],
  users: [],
  selectedProjectId: null,
  loading: false,
  error: null,

  fetchInitialData: async () => {
    set({ loading: true });
    try {
      const [projectsRes, usersRes] = await Promise.all([
        fetch('/api/v1/projects'),
        fetch('/api/v1/users')
      ]);
      
      const projects = await projectsRes.json();
      const users = await usersRes.json();
      
      set({ 
        projects, 
        users, 
        selectedProjectId: projects[0]?.id || null,
        loading: false 
      });

      if (projects[0]?.id) {
        get().selectProject(projects[0].id);
      }
    } catch (err) {
      set({ error: 'Failed to load initial data', loading: false });
    }
  },

  selectProject: async (id: string) => {
    set({ selectedProjectId: id, loading: true });
    try {
      const [epicsRes, sprintsRes] = await Promise.all([
        fetch(`/api/v1/epics/project/${id}`),
        fetch(`/api/v1/sprints/project/${id}`)
      ]);
      
      set({ 
        epics: await epicsRes.json(),
        sprints: await sprintsRes.json(),
        loading: false 
      });
      
      await get().fetchStories();
    } catch (err) {
      set({ error: 'Failed to load project data', loading: false });
    }
  },

  fetchStories: async () => {
    try {
      const response = await fetch('/api/v1/stories');
      const data = await response.json();
      set({ stories: data });
    } catch (err) {
      set({ error: 'Failed to fetch stories' });
    }
  },

  createProject: async (name, description) => {
    const res = await fetch('/api/v1/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description })
    });
    if (res.ok) {
      const newProject = await res.json();
      set(state => ({ projects: [...state.projects, newProject] }));
    }
  },

  createEpic: async (projectId, name, description) => {
    const res = await fetch(`/api/v1/epics/${projectId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description })
    });
    if (res.ok) {
      const newEpic = await res.json();
      set(state => ({ epics: [...state.epics, newEpic] }));
    }
  },

  createSprint: async (projectId, name, goal) => {
    const res = await fetch('/api/v1/sprints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, name, goal })
    });
    if (res.ok) {
      const newSprint = await res.json();
      set(state => ({ sprints: [...state.sprints, newSprint] }));
    }
  },

  createStory: async (data) => {
    const res = await fetch('/api/v1/stories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      const newStory = await res.json();
      set(state => ({ stories: [...state.stories, newStory] }));
    }
  },

  updateStory: async (id, updates) => {
    const previousStories = get().stories;
    
    // Optimistic Update
    set(state => ({
      stories: state.stories.map(s => s.id === id ? { ...s, ...updates } : s)
    }));

    try {
      const res = await fetch(`/api/v1/stories/${id}/status`, { // Simplificado para usar el mismo endpoint de update general si existiera
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error();
    } catch (err) {
      set({ stories: previousStories, error: 'Failed to update story' });
    }
  }
}));
