export interface CreateStoryInput {
  epicId: string;
  title: string;
  description: string;
  storyPoints?: number;
  priority?: string;
  type?: string;
  assigneeId?: string;
  dueDate?: string | Date;
}

export interface UpdateStoryInput {
  id: string;
  title?: string;
  description?: string;
  storyPoints?: number;
  priority?: string;
  type?: string;
  assigneeId?: string;
  dueDate?: string | Date;
  status?: string;
}

export interface StoryOutput {
  id: string;
  epicId: string;
  title: string;
  description: string;
  status: string;
  storyPoints?: number;
  priority: string;
  type: string;
  assigneeId?: string;
  dueDate?: Date;
  jiraIssueKey?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}
