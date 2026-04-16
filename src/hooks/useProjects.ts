import { useBacklogStore } from '../store/useBacklogStore';

export const useProjects = () => {
  const store = useBacklogStore();

  const selectProject = (id: string) => {
    store.selectProject(id);
  };

  const createProject = async (name: string, description: string) => {
    await store.createProject(name, description);
  };

  const deleteProject = async (id: string) => {
    await store.deleteProject(id);
  };

  return {
    projects: store.projects,
    selectedProjectId: store.selectedProjectId,
    selectProject,
    createProject,
    deleteProject,
  };
};
