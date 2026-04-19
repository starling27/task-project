import { create } from 'zustand';
import { apiService } from '@shared/services/apiService';

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

export interface Story {
  id: string;
  epicId: string;
  assigneeId?: string;
  title: string;
  description: string;
  storyPoints?: number;
  priority: string;
  status: string;
  acceptanceCriteria?: string;
  observations?: string;
  dueDate?: string | null;
  assignee?: User;
}

export interface WorkflowState {
  id: string;
  name: string;
  description?: string | null;
  color?: string | null;
  isDefault?: boolean;
  isInitial?: boolean;
  isFinal?: boolean;
  order: number;
  projectId: string;
}

export interface Comment {
  id: string;
  storyId: string;
  content: string;
  createdAt: string;
  author: string;
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

export interface FiltersState {
  status: string[];
  priority: string[];
  assigneeId: string[];
}

interface BacklogState {
  projects: Project[];
  epics: Epic[];
  stories: Story[];
  users: User[];
  workflowStates: WorkflowState[];
  
  selectedProjectId: string | null;
  loading: boolean;
  error: string | null;

  filters: FiltersState;

  // Actions
  fetchInitialData: () => Promise<void>;
  selectProject: (id: string) => void;
  
  // Filters
  setFilters: (filters: Partial<FiltersState>) => void;
  clearFilters: () => void;
  toggleFilter: (category: keyof FiltersState, value: string) => void;
  
  // Projects
  createProject: (name: string, description: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  
  // Epics
  createEpic: (projectId: string, name: string, description: string) => Promise<void>;
  deleteEpic: (id: string) => Promise<void>;
  
  // Stories
  fetchStoriesByProject: (projectId: string) => Promise<void>;
  createStory: (data: Partial<Story>) => Promise<void>;
  updateStory: (id: string, updates: Partial<Story>) => Promise<void>;
  deleteStory: (id: string) => Promise<void>;

  // Users
  createUser: (name: string, email: string) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;

  // Workflow config
  fetchWorkflowStatesByProject: (projectId: string) => Promise<void>;
  createWorkflowState: (projectId: string, data: Partial<WorkflowState> & { name: string }) => Promise<void>;
  updateWorkflowState: (projectId: string, id: string, data: Partial<WorkflowState>) => Promise<void>;
  deleteWorkflowState: (projectId: string, id: string) => Promise<void>;

  // Comments & History
  addComment: (storyId: string, content: string) => Promise<void>;
  fetchComments: (storyId: string) => Promise<Comment[]>;
  fetchHistory: (storyId: string) => Promise<HistoryItem[]>;
  clearError: () => void;
}

export const useBacklogStore = create<BacklogState>((set, get) => ({
  projects: [],
  epics: [],
  stories: [],
  users: [],
  workflowStates: [],
  selectedProjectId: null,
  loading: false,
  error: null,
  filters: {
    status: [],
    priority: [],
    assigneeId: []
  },

  fetchInitialData: async () => {
    set({ loading: true, error: null });
    try {
      // Load filters from localStorage
      const savedFilters = localStorage.getItem('backlog_filters');
      if (savedFilters) {
        try {
          set({ filters: JSON.parse(savedFilters) });
        } catch (e) {
          console.error('Failed to parse saved filters', e);
        }
      }

      const [projects, users] = await Promise.all([
        apiService.get<Project[]>('/api/v1/projects'),
        apiService.get<User[]>('/api/v1/users')
      ]);

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
      const [epics, workflowStates] = await Promise.all([
        apiService.get<Epic[]>(`/api/v1/epics/project/${id}`),
        apiService.get<WorkflowState[]>(`/api/v1/projects/${id}/workflow`)
      ]);

      set({ 
        epics,
        workflowStates,
        loading: false 
      });
      
      await get().fetchStoriesByProject(id);
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Project data error', loading: false });
    }
  },

  fetchWorkflowStatesByProject: async (projectId: string) => {
    try {
      const data = await apiService.get<WorkflowState[]>(`/api/v1/projects/${projectId}/workflow`);
      set({ workflowStates: data });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Workflow fetch error' });
    }
  },

  fetchStoriesByProject: async (projectId: string) => {
    try {
      const data = await apiService.get<Story[]>(`/api/v1/stories/project/${projectId}`);
      set({ stories: data });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Stories fetch error' });
    }
  },

  createProject: async (name, description) => {
    try {
      const newProject = await apiService.post<Project>('/api/v1/projects', { name, description });
      set(state => ({ projects: [...state.projects, newProject] }));
      await get().selectProject(newProject.id);
    } catch (err) {
      console.error(err);
    }
  },

  deleteProject: async (id: string) => {
    try {
      await apiService.delete(`/api/v1/projects/${id}`);
      set(state => ({ 
        projects: state.projects.filter(p => p.id !== id),
        selectedProjectId: state.selectedProjectId === id ? null : state.selectedProjectId
      }));
    } catch (err) {
      console.error(err);
    }
  },
  
  createEpic: async (projectId, name, description) => {
    set({ error: null });
    try {
      const newEpic = await apiService.post<Epic>(`/api/v1/epics/${projectId}`, { name, description });
      set(state => ({ epics: [...state.epics, newEpic] }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create epic';
      set({ error: message });
      console.error(err);
    }
  },

  deleteEpic: async (id: string) => {
    try {
      await apiService.delete(`/api/v1/epics/${id}`);
      set(state => ({ epics: state.epics.filter(e => e.id !== id) }));
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

      const newStory = await apiService.post<Story>('/api/v1/stories', data);
      set(state => ({ stories: [...state.stories, newStory] }));
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An unknown error occurred while creating the story.';
      set({ error });
      console.error(error);
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
      // The backend uses the general story update route for assigneeId, 
      // so we only use the special /status endpoint when ONLY updating status.
      const endpoint = isStatusOnly
        ? `/api/v1/stories/${id}/status`
        : `/api/v1/stories/${id}`;

      await apiService.patch(endpoint, updates);
    } catch (err) {
      set({ stories: previousStories, error: 'Failed to update story' });
      throw err;
    }
  },

  deleteStory: async (id) => {
    try {
      await apiService.delete(`/api/v1/stories/${id}`);
      set(state => ({ stories: state.stories.filter(s => s.id !== id) }));
    } catch (err) {
      console.error(err);
    }
  },

  createUser: async (name, email) => {
    try {
      const newUser = await apiService.post<User>('/api/v1/users', { name, email });
      set(state => ({ users: [...state.users, newUser] }));
    } catch (err) {
      console.error(err);
    }
  },

  deleteUser: async (id) => {
    try {
      await apiService.delete(`/api/v1/users/${id}`);
      set(state => ({ users: state.users.filter(u => u.id !== id) }));
    } catch (err) {
      console.error(err);
    }
  },

  createWorkflowState: async (projectId, data) => {
    set({ error: null });
    try {
      await apiService.post(`/api/v1/projects/${projectId}/workflow`, data);
      await get().fetchWorkflowStatesByProject(projectId);
    } catch (err) {
      set({ error: 'Failed to create workflow state' });
    }
  },

  updateWorkflowState: async (projectId, id, data) => {
    set({ error: null });
    try {
      await apiService.put(`/api/v1/projects/${projectId}/workflow/${id}`, data);
      await get().fetchWorkflowStatesByProject(projectId);
    } catch (err) {
      set({ error: 'Failed to update workflow state' });
    }
  },

  deleteWorkflowState: async (projectId, id) => {
    set({ error: null });
    try {
      await apiService.delete(`/api/v1/projects/${projectId}/workflow/${id}`);
      await get().fetchWorkflowStatesByProject(projectId);
    } catch (err) {
      set({ error: 'Failed to delete workflow state' });
    }
  },

  addComment: async (storyId, content) => {
    const userName = get().users[0]?.name || 'Anonymous';

    try {
      await apiService.post('/api/v1/comments', { storyId, author: userName, content });
    } catch (err) {
      console.error(err);
    }
  },

  fetchComments: async (storyId) => {
    try {
      return await apiService.get<Comment[]>(`/api/v1/comments/story/${storyId}`);
    } catch (err) {
      return [];
    }
  },

  fetchHistory: async (storyId) => {
    try {
      return await apiService.get<HistoryItem[]>(`/api/v1/history/story/${storyId}`);
    } catch (err) {
      return [];
    }
  },

  setFilters: (newFilters) => {
    set(state => {
      const updatedFilters = { ...state.filters, ...newFilters };
      localStorage.setItem('backlog_filters', JSON.stringify(updatedFilters));
      return { filters: updatedFilters };
    });
  },

  clearFilters: () => {
    const emptyFilters = { status: [], priority: [], assigneeId: [] };
    localStorage.setItem('backlog_filters', JSON.stringify(emptyFilters));
    set({ filters: emptyFilters });
  },

  toggleFilter: (category, value) => {
    set(state => {
      const current = state.filters[category];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      
      const updatedFilters = { ...state.filters, [category]: updated };
      localStorage.setItem('backlog_filters', JSON.stringify(updatedFilters));
      return { filters: updatedFilters };
    });
  },

  clearError: () => set({ error: null })
}));
