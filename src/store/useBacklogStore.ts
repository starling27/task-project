import { create } from 'zustand';

// Interfaces
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

export interface WorkflowState {
  id: string;
  name: string;
  order: number;
  projectId: string;
}

export interface Comment {
  id: string;
  storyId: string;
  content: string;
  createdAt: string;
  user: User;
}

export interface HistoryItem {
  id: string;
  type: 'status' | 'assignee';
  oldStatus?: string;
  newStatus?: string;
  oldAssigneeId?: string;
  newAssigneeId?: string;
  newAssignee?: User;
  changedAt?: string;
  assignedAt?: string;
}

interface BacklogState {
  projects: Project[];
  epics: Epic[];
  sprints: Sprint[];
  stories: Story[];
  users: User[];
  workflowStates: WorkflowState[];
  
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
  fetchStoriesByProject: (projectId: string) => Promise<void>;
  createStory: (data: Partial<Story>) => Promise<void>;
  updateStory: (id: string, updates: Partial<Story>) => Promise<void>;

  // Comments & History
  addComment: (storyId: string, content: string) => Promise<void>;
  fetchComments: (storyId: string) => Promise<Comment[]>;
  fetchHistory: (storyId: string) => Promise<HistoryItem[]>;
}

export const useBacklogStore = create<BacklogState>((set, get) => ({
  projects: [],
  epics: [],
  sprints: [],
  stories: [],
  users: [],
  workflowStates: [],
  selectedProjectId: null,
  loading: false,
  error: null,

  fetchInitialData: async () => {
    set({ loading: true, error: null });
    try {
      const [projectsRes, usersRes] = await Promise.all([
        fetch('/api/v1/projects'),
        fetch('/api/v1/users')
      ]);
      
      if (!projectsRes.ok || !usersRes.ok) throw new Error('Failed to fetch initial data from server');

      const projects = await projectsRes.json();
      const users = await usersRes.json();
      
      const firstProjectId = projects[0]?.id || null;

      set({ 
        projects, 
        users,
        selectedProjectId: firstProjectId,
        loading: false 
      });

      if (firstProjectId) {
        await get().selectProject(firstProjectId);
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Unknown error', loading: false });
    }
  },

  selectProject: async (id: string) => {
    set({ selectedProjectId: id, loading: true, stories: [], error: null });
    try {
      const [epicsRes, sprintsRes, workflowStatesRes] = await Promise.all([
        fetch(`/api/v1/epics/project/${id}`),
        fetch(`/api/v1/sprints/project/${id}`),
        fetch(`/api/v1/workflow/states/project/${id}`)
      ]);
      
      if (!epicsRes.ok || !sprintsRes.ok || !workflowStatesRes.ok) {
        throw new Error(`Project data fetch failed (Status: ${epicsRes.status})`);
      }

      set({ 
        epics: await epicsRes.json(),
        sprints: await sprintsRes.json(),
        workflowStates: await workflowStatesRes.json(),
        loading: false 
      });
      
      await get().fetchStoriesByProject(id);
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Project data error', loading: false });
    }
  },

  fetchStoriesByProject: async (projectId: string) => {
    try {
      const res = await fetch(`/api/v1/stories/project/${projectId}`);
      if (!res.ok) throw new Error(`Stories fetch failed (Status: ${res.status})`);
      
      const data = await res.json();
      set({ stories: data });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Stories fetch error' });
    }
  },

  createProject: async (name, description) => {
    try {
      const res = await fetch('/api/v1/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description })
      });
      if (res.ok) {
        const newProject = await res.json();
        set(state => ({ projects: [...state.projects, newProject] }));
        await get().selectProject(newProject.id);
      }
    } catch (err) {
      console.error(err);
    }
  },

  createEpic: async (projectId, name, description) => {
    try {
      const res = await fetch(`/api/v1/epics/${projectId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description })
      });
      if (res.ok) {
        const newEpic = await res.json();
        set(state => ({ epics: [...state.epics, newEpic] }));
      }
    } catch (err) {
      console.error(err);
    }
  },

  createSprint: async (projectId, name, goal) => {
    try {
      const res = await fetch('/api/v1/sprints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, name, goal })
      });
      if (res.ok) {
        const newSprint = await res.json();
        set(state => ({ sprints: [...state.sprints, newSprint] }));
      }
    } catch (err) {
      console.error(err);
    }
  },

  createStory: async (data) => {
    set({ error: null });
    try {
      if (!data.title || data.title.trim() === '') {
        throw new Error('Story title cannot be empty.');
      }
      if (!data.epicId) {
        throw new Error('Cannot create a story without assigning it to an Epic.');
      }

      const res = await fetch('/api/v1/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create story on the server.');
      }

      const newStory = await res.json();
      set(state => ({ stories: [...state.stories, newStory] }));
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An unknown error occurred while creating the story.';
      set({ error });
      console.error(error); // Keep console log for debugging
    }
  },

  updateStory: async (id, updates) => {
    const previousStories = get().stories;
    
    // Optimistic Update
    set(state => ({
      stories: state.stories.map(s => s.id === id ? { ...s, ...updates } : s)
    }));

    try {
      const updateKeys = Object.keys(updates);
      const isStatusOnly = updateKeys.length === 1 && updateKeys[0] === 'status';
      const isAssigneeOnly = updateKeys.length === 1 && updateKeys[0] === 'assigneeId';
      const endpoint = isStatusOnly
        ? `/api/v1/stories/${id}/status`
        : isAssigneeOnly
          ? `/api/v1/stories/${id}/assign`
          : `/api/v1/stories/${id}`;

      const res = await fetch(endpoint, { 
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error('Failed to update story on server');
    } catch (err) {
      set({ stories: previousStories, error: 'Failed to update story' });
      throw err;
    }
  },

  addComment: async (storyId, content) => {
    const userId = get().users[0]?.id;
    if (!userId) return;

    try {
      await fetch('/api/v1/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyId, userId, content })
      });
    } catch (err) {
      console.error(err);
    }
  },

  fetchComments: async (storyId) => {
    try {
      const res = await fetch(`/api/v1/comments/story/${storyId}`);
      if (!res.ok) return [];
      return res.json();
    } catch (err) {
      return [];
    }
  },

  fetchHistory: async (storyId) => {
    try {
      const res = await fetch(`/api/v1/history/story/${storyId}`);
      if (!res.ok) return [];
      return res.json();
    } catch (err) {
      return [];
    }
  }
}));
