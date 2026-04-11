import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const DEFAULT_WORKFLOW_STATES = [
  { name: 'unassigned', isInitial: true, isFinal: false, order: 0 },
  { name: 'assigned', isInitial: false, isFinal: false, order: 1 },
  { name: 'in_progress', isInitial: false, isFinal: false, order: 2 },
  { name: 'done', isInitial: false, isFinal: true, order: 3 }
];

export class ProjectService {
  async create(data: { name: string; description?: string }) {
    const existing = await prisma.project.findUnique({ where: { name: data.name } });
    if (existing) throw new Error('Project name must be unique');

    if (data.name.length < 3) throw new Error('Project name too short');

    return prisma.$transaction(async (tx) => {
      const project = await tx.project.create({ data });

      await tx.workflowState.createMany({
        data: DEFAULT_WORKFLOW_STATES.map((state) => ({
          projectId: project.id,
          name: state.name,
          isInitial: state.isInitial,
          isFinal: state.isFinal,
          order: state.order
        }))
      });

      return project;
    });
  }

  async getAll() {
    return prisma.project.findMany({ include: { _count: { select: { epics: true } } } });
  }

  async getById(id: string) {
    return prisma.project.findUnique({ where: { id }, include: { epics: true } });
  }

  async update(id: string, data: { name?: string; description?: string }) {
    if (data.name) {
      const existing = await prisma.project.findUnique({ where: { name: data.name } });
      if (existing && existing.id !== id) throw new Error('Project name must be unique');
    }
    return prisma.project.update({ where: { id }, data });
  }

  async delete(id: string) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: { _count: { select: { epics: true } } }
    });

    if (!project) throw new Error('Project not found');
    if (project._count.epics > 0) throw new Error('Cannot delete project with epics');

    return prisma.project.delete({ where: { id } });
  }
}
