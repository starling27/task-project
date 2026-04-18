import { useBacklogStore } from '@core/store/useBacklogStore';

export const useStories = () => {
  const store = useBacklogStore();

  const loadStories = async (projectId: string) => {
    await store.fetchStoriesByProject(projectId);
  };

  const addStory = async (data: any) => {
    await store.createStory(data);
  };

  const updateStoryStatus = async (id: string, updates: any) => {
    await store.updateStory(id, updates);
  };

  return {
    stories: store.stories,
    loading: store.loading,
    loadStories,
    addStory,
    updateStoryStatus,
  };
};
