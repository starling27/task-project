import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class EpicService {
  async create(projectId: string, data: { name: string; description?: string }) {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new Error('Project does not exist');

    const existing = await prisma.epic.findFirst({
      where: { projectId, name: data.name }
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
      where: { projectId },
      include: { _count: { select: { stories: true } } }
    });
  }

  async getById(id: string) {
    return prisma.epic.findUnique({
      where: { id },
      include: { stories: true }
    });
  }

  async update(id: string, data: { name?: string; description?: string; status?: string }) {
    const epic = await prisma.epic.findUnique({ where: { id } });
    if (!epic) throw new Error('Epic not found');

    if (epic.status === 'archived') throw new Error('Archived epics cannot be updated');

    if (data.name) {
      const existing = await prisma.epic.findFirst({
        where: { projectId: epic.projectId, name: data.name }
      });
      if (existing && existing.id !== id) throw new Error('Epic name must be unique within project');
    }

    return prisma.epic.update({ where: { id }, data });
  }

  async delete(id: string) {
    const epic = await prisma.epic.findUnique({
      where: { id },
      include: { _count: { select: { stories: true } } }
    });

    if (!epic) throw new Error('Epic not found');
    if (epic._count.stories > 0) throw new Error('Cannot delete epic with stories');

    return prisma.epic.delete({ where: { id } });
  }
}
