import { prisma } from '../../../../core/infrastructure/PrismaClient.js';
import { StatusHistory, AssigneeHistory } from '../../domain/entities/HistoryEntities.js';
import { HistoryRepository } from '../../domain/repositories/HistoryRepository.js';
import { HistoryMapper } from '../mappers/HistoryMapper.js';

export class PrismaHistoryRepository implements HistoryRepository {
  async findStatusHistoryByStoryId(storyId: string): Promise<StatusHistory[]> {
    const history = await prisma.statusHistory.findMany({
      where: { storyId },
      orderBy: { changedAt: 'desc' }
    });
    return history.map(HistoryMapper.toStatusDomain);
  }

  async findAssigneeHistoryByStoryId(storyId: string): Promise<AssigneeHistory[]> {
    const history = await prisma.assigneeHistory.findMany({
      where: { storyId },
      orderBy: { assignedAt: 'desc' }
    });
    return history.map(HistoryMapper.toAssigneeDomain);
  }

  async saveStatusHistory(history: StatusHistory): Promise<StatusHistory> {
    const created = await prisma.statusHistory.create({
      data: {
        storyId: history.storyId,
        oldStatus: history.oldStatus,
        newStatus: history.newStatus,
        changedAt: history.changedAt
      }
    });
    return HistoryMapper.toStatusDomain(created);
  }

  async saveAssigneeHistory(history: AssigneeHistory): Promise<AssigneeHistory> {
    const created = await prisma.assigneeHistory.create({
      data: {
        storyId: history.storyId,
        oldAssigneeId: history.oldAssigneeId,
        newAssigneeId: history.newAssigneeId,
        assignedAt: history.assignedAt
      }
    });
    return HistoryMapper.toAssigneeDomain(created);
  }
}
