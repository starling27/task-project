import { WorkflowState as PrismaWorkflowState } from '@prisma/client';
import { WorkflowState } from '../../domain/entities/WorkflowState.js';

export class WorkflowMapper {
  static toDomain(prismaState: PrismaWorkflowState): WorkflowState {
    return new WorkflowState(
      prismaState.name,
      prismaState.projectId,
      prismaState.order,
      prismaState.color,
      prismaState.isInitial,
      prismaState.isFinal,
      prismaState.isDefault,
      prismaState.description || undefined,
      prismaState.id,
      prismaState.createdAt,
      prismaState.updatedAt,
      prismaState.deletedAt
    );
  }

  static toPersistence(state: WorkflowState): Partial<PrismaWorkflowState> {
    return {
      name: state.name,
      projectId: state.projectId,
      order: state.order,
      color: state.color,
      isInitial: state.isInitial,
      isFinal: state.isFinal,
      isDefault: state.isDefault,
      description: state.description,
      deletedAt: state.deletedAt
    };
  }
}
