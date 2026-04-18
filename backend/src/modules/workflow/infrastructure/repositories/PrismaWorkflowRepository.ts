import { prisma } from '../../../../core/infrastructure/PrismaClient.js';
import { WorkflowState } from '../../domain/entities/WorkflowState.js';
import { WorkflowRepository } from '../../domain/repositories/WorkflowRepository.js';
import { WorkflowMapper } from '../mappers/WorkflowMapper.js';

export class PrismaWorkflowRepository implements WorkflowRepository {
  async findById(id: string): Promise<WorkflowState | null> {
    const prismaState = await prisma.workflowState.findUnique({ where: { id } });
    return prismaState ? WorkflowMapper.toDomain(prismaState) : null;
  }

  async findByProjectId(projectId: string): Promise<WorkflowState[]> {
    const prismaStates = await prisma.workflowState.findMany({
      where: { projectId },
      orderBy: { order: 'asc' }
    });
    return prismaStates.map(WorkflowMapper.toDomain);
  }

  async findByNameInProject(projectId: string, name: string): Promise<WorkflowState | null> {
    const prismaState = await prisma.workflowState.findUnique({
      where: { projectId_name: { projectId, name } }
    });
    return prismaState ? WorkflowMapper.toDomain(prismaState) : null;
  }

  async getInitialState(projectId: string): Promise<WorkflowState | null> {
    const prismaState = await prisma.workflowState.findFirst({
      where: { projectId, isInitial: true },
      orderBy: { order: 'asc' }
    });
    return prismaState ? WorkflowMapper.toDomain(prismaState) : null;
  }

  async resetInitialStates(projectId: string): Promise<void> {
    await prisma.workflowState.updateMany({
      where: { projectId, isInitial: true },
      data: { isInitial: false }
    });
  }

  async resetDefaultStates(projectId: string): Promise<void> {
    await prisma.workflowState.updateMany({
      where: { projectId, isDefault: true },
      data: { isDefault: false }
    });
  }

  async findAll(): Promise<WorkflowState[]> {
    const prismaStates = await prisma.workflowState.findMany();
    return prismaStates.map(WorkflowMapper.toDomain);
  }

  async save(state: WorkflowState): Promise<WorkflowState> {
    const data = WorkflowMapper.toPersistence(state);
    let prismaState;

    if (state.id) {
      prismaState = await prisma.workflowState.update({
        where: { id: state.id },
        data: {
          name: data.name,
          order: data.order,
          color: data.color,
          isInitial: data.isInitial,
          isFinal: data.isFinal,
          isDefault: data.isDefault,
          description: data.description,
          deletedAt: data.deletedAt
        }
      });
    } else {
      prismaState = await prisma.workflowState.create({
        data: {
          name: data.name!,
          projectId: data.projectId!,
          order: data.order!,
          color: data.color!,
          isInitial: data.isInitial!,
          isFinal: data.isFinal!,
          isDefault: data.isDefault!,
          description: data.description
        }
      });
    }

    return WorkflowMapper.toDomain(prismaState);
  }

  async delete(id: string): Promise<void> {
    await prisma.workflowState.delete({ where: { id } });
  }
}
