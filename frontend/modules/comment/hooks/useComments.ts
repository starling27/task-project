import { useBacklogStore } from '@core/store/useBacklogStore';

export const useComments = (storyId: string) => {
  const store = useBacklogStore();

  const getComments = async () => {
    return await store.fetchComments(storyId);
  };

  const postComment = async (content: string) => {
    await store.addComment(storyId, content);
  };

  return {
    getComments,
    postComment,
  };
};
