import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SprintService {
  async create(data: { projectId: string; name: string; goal?: string }) {
    const project = await prisma.project.findUnique({ where: { id: data.projectId } });
    if (!project) throw new Error('Project not found');

    return prisma.sprint.create({
      data: {
        projectId: data.projectId,
        name: data.name,
        goal: data.goal,
        status: 'planned'
      }
    });
  }

  async getByProject(projectId: string) {
    return prisma.sprint.findMany({
      where: { projectId },
      include: { stories: true }
    });
  }

  async update(id: string, data: any) {
    return prisma.sprint.update({
      where: { id },
      data
    });
  }
}
