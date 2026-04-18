import { UseCase } from '../../../../core/application/UseCase.js';
import { WorkflowState } from '../../domain/entities/WorkflowState.js';
import { WorkflowRepository } from '../../domain/repositories/WorkflowRepository.js';
import { CreateWorkflowStateInput, WorkflowStateOutput } from '../dtos/WorkflowDTOs.js';

export class CreateWorkflowStateUseCase implements UseCase<CreateWorkflowStateInput, WorkflowStateOutput> {
  constructor(private workflowRepository: WorkflowRepository) {}

  async execute(input: CreateWorkflowStateInput): Promise<WorkflowStateOutput> {
    const existing = await this.workflowRepository.findByNameInProject(input.projectId, input.name);
    if (existing) throw new Error('State name must be unique per project');

    if (input.isInitial) {
      await this.workflowRepository.resetInitialStates(input.projectId);
    }

    if (input.isDefault) {
      await this.workflowRepository.resetDefaultStates(input.projectId);
    }

    const state = new WorkflowState(
      input.name,
      input.projectId,
      input.order,
      input.color,
      input.isInitial,
      input.isFinal,
      input.isDefault,
      input.description
    );
    state.validate();

    const created = await this.workflowRepository.save(state);

    return {
      id: created.id!,
      name: created.name,
      projectId: created.projectId,
      order: created.order,
      color: created.color,
      isInitial: created.isInitial,
      isFinal: created.isFinal,
      isDefault: created.isDefault,
      description: created.description
    };
  }
}
