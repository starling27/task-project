import { UseCase } from '../../../../core/application/UseCase.js';
import { WorkflowRepository } from '../../domain/repositories/WorkflowRepository.js';
import { WorkflowStateOutput } from '../dtos/WorkflowDTOs.js';

export class GetWorkflowStatesUseCase implements UseCase<string, WorkflowStateOutput[]> {
  constructor(private workflowRepository: WorkflowRepository) {}

  async execute(projectId: string): Promise<WorkflowStateOutput[]> {
    const states = await this.workflowRepository.findByProjectId(projectId);
    return states.map(s => ({
      id: s.id!,
      name: s.name,
      projectId: s.projectId,
      order: s.order,
      color: s.color,
      isInitial: s.isInitial,
      isFinal: s.isFinal,
      isDefault: s.isDefault,
      description: s.description
    }));
  }
}
