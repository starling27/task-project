import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class WorkflowService {
  /**
   * Valida si una transición de estado es permitida.
   * Por ahora, permitimos todas si el estado existe en la BD.
   * En el futuro, esto podría consultar una tabla de 'WorkflowTransitions'.
   */
  async validateTransition(oldStatus: string, newStatus: string): Promise<boolean> {
    if (oldStatus === newStatus) return true;

    const targetState = await prisma.workflowState.findUnique({
      where: { name: newStatus }
    });

    if (!targetState) {
      throw new Error(`Target state '${newStatus}' does not exist in workflow`);
    }

    // Aquí se podrían añadir reglas de negocio por transición
    // Ej: if (oldStatus === 'To Do' && newStatus === 'Done') throw Error('Must go through In Progress');

    return true;
  }

  async getInitialState(): Promise<string> {
    const state = await prisma.workflowState.findFirst({
      where: { isInitial: true },
      orderBy: { order: 'asc' }
    });
    return state?.name || 'unassigned';
  }

  async getAllStates() {
    return prisma.workflowState.findMany({
      orderBy: { order: 'asc' }
    });
  }
}
