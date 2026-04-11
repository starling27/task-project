import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class WorkflowService {
  /**
   * Valida si una transición de estado es permitida para un proyecto específico.
   * Por ahora, permitimos todas si el estado existe en la BD para ese proyecto.
   * En el futuro, esto podría consultar una tabla de 'WorkflowTransitions'.
   */
  async validateTransition(oldStatus: string, newStatus: string, projectId: string): Promise<boolean> {
    if (oldStatus === newStatus) return true;

    const targetState = await prisma.workflowState.findUnique({
      where: {
        projectId_name: {
          projectId,
          name: newStatus,
        },
      },
    });

    if (!targetState) {
      throw new Error(`Target state '${newStatus}' does not exist in workflow for project ${projectId}`);
    }

    // Aquí se podrían añadir reglas de negocio por transición
    // Ej: if (oldStatus === 'To Do' && newStatus === 'Done') throw Error('Must go through In Progress');

    return true;
  }

  async getInitialState(projectId: string): Promise<string> {
    const state = await prisma.workflowState.findFirst({
      where: {
        projectId,
        isInitial: true,
      },
      orderBy: { order: 'asc' },
    });
    return state?.name || 'unassigned';
  }

  async getAllStates(projectId: string) {
    return prisma.workflowState.findMany({
      where: { projectId },
      orderBy: { order: 'asc' },
    });
  }
}
