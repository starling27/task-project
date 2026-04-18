import { JiraSyncTask } from '../entities/JiraSyncTask.js';

export interface JiraSyncRepository {
  findById(id: string): Promise<JiraSyncTask | null>;
  findByStoryId(storyId: string): Promise<JiraSyncTask | null>;
  findPending(limit: number): Promise<JiraSyncTask[]>;
  save(task: JiraSyncTask): Promise<JiraSyncTask>;
  delete(id: string): Promise<void>;
  upsert(task: Partial<JiraSyncTask>): Promise<JiraSyncTask>;
}
