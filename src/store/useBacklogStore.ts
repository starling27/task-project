import { create } from 'zustand';

interface Story {
  id: string;
  title: string;
  status: string;
  assigneeId?: string;
  storyPoints?: number;
  priority: string;
  epicId: string;
}

interface BacklogState {
  stories: Story[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchStories: () => Promise<void>;
  updateStoryStatus: (storyId: string, newStatus: string) => Promise<void>;
  assignUser: (storyId: string, userId: string) => Promise<void>;
  
  // Optimistic Utils
  addStoryLocally: (story: Story) => void;
  removeStoryLocally: (id: string) => void;
}

export const useBacklogStore = create<BacklogState>((set, get) => ({
  stories: [],
  loading: false,
  error: null,

  fetchStories: async () => {
    set({ loading: true });
    try {
      const response = await fetch('/api/v1/stories');
      const data = await response.json();
      set({ stories: data, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch stories', loading: false });
    }
  },

  updateStoryStatus: async (storyId, newStatus) => {
    const previousStories = get().stories;

    // Optimistic Update
    set({
      stories: previousStories.map(s => 
        s.id === storyId ? { ...s, status: newStatus } : s
      )
    });

    try {
      const response = await fetch(`/api/v1/stories/${storyId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Update failed');
    } catch (err) {
      // Rollback
      set({ stories: previousStories, error: 'Failed to update status' });
    }
  },

  assignUser: async (storyId, userId) => {
    const previousStories = get().stories;

    // Optimistic Update
    set({
      stories: previousStories.map(s => 
        s.id === storyId ? { ...s, assigneeId: userId } : s
      )
    });

    try {
      const response = await fetch(`/api/v1/stories/${storyId}/assign`, {
        method: 'PATCH',
        body: JSON.stringify({ assigneeId: userId }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Assignment failed');
    } catch (err) {
      // Rollback
      set({ stories: previousStories, error: 'Failed to assign user' });
    }
  },

  addStoryLocally: (story) => set((state) => ({ stories: [...state.stories, story] })),
  removeStoryLocally: (id) => set((state) => ({ 
    stories: state.stories.filter(s => s.id !== id) 
  })),
}));
