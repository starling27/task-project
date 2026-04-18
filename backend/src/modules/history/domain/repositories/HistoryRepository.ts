import { StatusHistory, AssigneeHistory } from '../entities/HistoryEntities.js';

export interface HistoryRepository {
  findStatusHistoryByStoryId(storyId: string): Promise<StatusHistory[]>;
  findAssigneeHistoryByStoryId(storyId: string): Promise<AssigneeHistory[]>;
  saveStatusHistory(history: StatusHistory): Promise<StatusHistory>;
  saveAssigneeHistory(history: AssigneeHistory): Promise<AssigneeHistory>;
}
