import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class WorkflowService {
  private normalizeName(name: string) {
    return name.trim();
  }

  private validateHexColor(color: string) {
    // Accepts #RGB or #RRGGBB.
    if (!/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(color)) {
      throw new Error('Invalid color hex');
    }
  }

  async listStates(projectId: string) {
    return prisma.workflowState.findMany({
      where: { projectId },
      orderBy: { order: 'asc' },
    });
  }

  async createState(
    projectId: string,
    data: {
      name: string;
      description?: string;
      color?: string;
      order?: number;
      isDefault?: boolean;
      isInitial?: boolean;
      isFinal?: boolean;
    }
  ) {
    const name = this.normalizeName(data.name);
    if (name.length < 2 || name.length > 30) throw new Error('Invalid state name length');
    if (data.color) this.validateHexColor(data.color);

    return prisma.$transaction(async (tx) => {
      const existing = await tx.workflowState.findUnique({
        where: { projectId_name: { projectId, name } },
      });
      if (existing) throw new Error('State name must be unique per project');

      if (data.isInitial) {
        await tx.workflowState.updateMany({
          where: { projectId, isInitial: true },
          data: { isInitial: false },
        });
      }

      if (data.isDefault) {
        await tx.workflowState.updateMany({
          where: { projectId, isDefault: true },
          data: { isDefault: false },
        });
      }

      return tx.workflowState.create({
        data: {
          projectId,
          name,
          description: data.description,
          color: data.color,
          order: data.order ?? 0,
          isDefault: data.isDefault ?? false,
          isInitial: data.isInitial ?? false,
          isFinal: data.isFinal ?? false,
        },
      });
    });
  }

  async updateState(
    projectId: string,
    id: string,
    data: {
      name?: string;
      description?: string;
      color?: string | null;
      order?: number;
      isDefault?: boolean;
      isInitial?: boolean;
      isFinal?: boolean;
    }
  ) {
    if (data.name) {
      const normalized = this.normalizeName(data.name);
      if (normalized.length < 2 || normalized.length > 30) throw new Error('Invalid state name length');
      data.name = normalized;
    }
    if (data.color) this.validateHexColor(data.color);

    return prisma.$transaction(async (tx) => {
      const state = await tx.workflowState.findUnique({ where: { id } });
      if (!state || state.projectId !== projectId) throw new Error('WorkflowState not found for project');

      if (data.name && data.name !== state.name) {
        const dup = await tx.workflowState.findUnique({
          where: { projectId_name: { projectId, name: data.name } },
        });
        if (dup) throw new Error('State name must be unique per project');
      }

      if (data.isInitial) {
        await tx.workflowState.updateMany({
          where: { projectId, isInitial: true, NOT: { id } },
          data: { isInitial: false },
        });
      }

      if (data.isDefault) {
        await tx.workflowState.updateMany({
          where: { projectId, isDefault: true, NOT: { id } },
          data: { isDefault: false },
        });
      }

      return tx.workflowState.update({ where: { id }, data });
    });
  }

  async deleteState(projectId: string, id: string) {
    return prisma.$transaction(async (tx) => {
      const state = await tx.workflowState.findUnique({ where: { id } });
      if (!state || state.projectId !== projectId) throw new Error('WorkflowState not found for project');

      const count = await tx.workflowState.count({ where: { projectId } });
      if (count <= 1) throw new Error('Project must have at least one workflow state');

      const inUse = await tx.story.count({
        where: {
          status: state.name,
          epic: { projectId },
        },
      });
      if (inUse > 0) throw new Error('Cannot delete state while stories are using it');

      return tx.workflowState.delete({ where: { id } });
    });
  }

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
