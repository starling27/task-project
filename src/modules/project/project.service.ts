import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const DEFAULT_WORKFLOW_STATES = [
  { name: 'unassigned', isInitial: true, isFinal: false, isDefault: true, order: 0, color: '#94a3b8' },
  { name: 'assigned', isInitial: false, isFinal: false, isDefault: false, order: 1, color: '#6366f1' },
  { name: 'in_progress', isInitial: false, isFinal: false, isDefault: false, order: 2, color: '#f59e0b' },
  { name: 'done', isInitial: false, isFinal: true, isDefault: false, order: 3, color: '#10b981' }
];

export class ProjectService {
  async create(data: { name: string; description?: string }) {
    const existing = await prisma.project.findFirst({ where: { name: data.name, deletedAt: null } });
    if (existing) throw new Error('Project name must be unique');

    if (data.name.length < 3) throw new Error('Project name too short');

    return prisma.$transaction(async (tx) => {
      const project = await tx.project.create({ data });

      await tx.workflowState.createMany({
        data: DEFAULT_WORKFLOW_STATES.map((state) => ({
          projectId: project.id,
          name: state.name,
          color: state.color,
          isDefault: state.isDefault,
          isInitial: state.isInitial,
          isFinal: state.isFinal,
          order: state.order
        }))
      });

      return project;
    });
  }

  async getAll() {
    return prisma.project.findMany({ 
      where: { deletedAt: null },
      include: { _count: { select: { epics: true } } } 
    });
  }

  async getById(id: string) {
    return prisma.project.findFirst({ 
      where: { id, deletedAt: null }, 
      include: { epics: { where: { deletedAt: null } } } 
    });
  }

  async update(id: string, data: { name?: string; description?: string }) {
    const project = await prisma.project.findFirst({ where: { id, deletedAt: null } });
    if (!project) throw new Error('Project not found');

    if (data.name) {
      const existing = await prisma.project.findFirst({ where: { name: data.name, deletedAt: null } });
      if (existing && existing.id !== id) throw new Error('Project name must be unique');
    }
    return prisma.project.update({ where: { id }, data });
  }

  async delete(id: string) {
    const project = await prisma.project.findFirst({
      where: { id, deletedAt: null }
    });

    if (!project) throw new Error('Project not found');

    const now = new Date();

    return prisma.$transaction(async (tx) => {
      const epics = await tx.epic.findMany({
        where: { projectId: id, deletedAt: null },
        select: { id: true }
      });
      const epicIds = epics.map(e => e.id);

      if (epicIds.length > 0) {
        await tx.story.updateMany({
          where: { epicId: { in: epicIds }, deletedAt: null },
          data: { deletedAt: now }
        });

        await tx.epic.updateMany({
          where: { projectId: id, deletedAt: null },
          data: { deletedAt: now }
        });
      }

      return tx.project.update({ 
        where: { id }, 
        data: { deletedAt: now } 
      });
    });
  }
}
