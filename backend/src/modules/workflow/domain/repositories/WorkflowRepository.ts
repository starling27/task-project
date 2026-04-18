import { Repository } from '../../../../core/domain/Repository.js';
import { WorkflowState } from '../entities/WorkflowState.js';

export interface WorkflowRepository extends Repository<WorkflowState> {
  findByProjectId(projectId: string): Promise<WorkflowState[]>;
  findByNameInProject(projectId: string, name: string): Promise<WorkflowState | null>;
  getInitialState(projectId: string): Promise<WorkflowState | null>;
  resetInitialStates(projectId: string): Promise<void>;
  resetDefaultStates(projectId: string): Promise<void>;
}
