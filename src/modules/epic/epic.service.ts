import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class EpicService {
  async create(projectId: string, data: { name: string; description?: string }) {
    const project = await prisma.project.findFirst({ where: { id: projectId, deletedAt: null } });
    if (!project) throw new Error('Project does not exist');

    const existing = await prisma.epic.findFirst({
      where: { projectId, name: data.name, deletedAt: null }
    });
    if (existing) throw new Error('Epic name must be unique within project');

    return prisma.epic.create({
      data: {
        ...data,
        projectId
      }
    });
  }

  async getByProject(projectId: string) {
    return prisma.epic.findMany({
      where: { projectId, deletedAt: null },
      include: { _count: { select: { stories: true } } }
    });
  }

  async getById(id: string) {
    return prisma.epic.findFirst({
      where: { id, deletedAt: null },
      include: { stories: { where: { deletedAt: null } } }
    });
  }

  async update(id: string, data: { name?: string; description?: string; status?: string }) {
    const epic = await prisma.epic.findFirst({ where: { id, deletedAt: null } });
    if (!epic) throw new Error('Epic not found');

    if (epic.status === 'archived') throw new Error('Archived epics cannot be updated');

    if (data.name) {
      const existing = await prisma.epic.findFirst({
        where: { projectId: epic.projectId, name: data.name, deletedAt: null }
      });
      if (existing && existing.id !== id) throw new Error('Epic name must be unique within project');
    }

    return prisma.epic.update({ where: { id }, data });
  }

  async delete(id: string) {
    const epic = await prisma.epic.findFirst({
      where: { id, deletedAt: null }
    });

    if (!epic) throw new Error('Epic not found');

    const now = new Date();

    return prisma.$transaction(async (tx) => {
      await tx.story.updateMany({
        where: { epicId: id, deletedAt: null },
        data: { deletedAt: now }
      });

      return tx.epic.update({ 
        where: { id }, 
        data: { deletedAt: now } 
      });
    });
  }
}
