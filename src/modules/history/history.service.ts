import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class HistoryService {
  async getStoryStatusHistory(storyId: string) {
    return prisma.statusHistory.findMany({
      where: { storyId },
      orderBy: { changedAt: 'desc' }
    });
  }

  async getStoryAssigneeHistory(storyId: string) {
    return prisma.assigneeHistory.findMany({
      where: { storyId },
      include: { newAssignee: true },
      orderBy: { assignedAt: 'desc' }
    });
  }

  async getFullStoryHistory(storyId: string) {
    const [status, assignee] = await Promise.all([
      this.getStoryStatusHistory(storyId),
      this.getStoryAssigneeHistory(storyId)
    ]);

    // Combinar y ordenar cronológicamente
    const history = [
      ...status.map(s => ({ ...s, type: 'status' })),
      ...assignee.map(a => ({ ...a, type: 'assignee' }))
    ];

    return history.sort((a, b) => {
      const dateA = (a as any).changedAt || (a as any).assignedAt;
      const dateB = (b as any).changedAt || (b as any).assignedAt;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
  }
}
