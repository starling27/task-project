import { StatusHistory as PrismaStatusHistory, AssigneeHistory as PrismaAssigneeHistory } from '@prisma/client';
import { StatusHistory, AssigneeHistory } from '../../domain/entities/HistoryEntities.js';

export class HistoryMapper {
  static toStatusDomain(prisma: PrismaStatusHistory): StatusHistory {
    return new StatusHistory(
      prisma.storyId,
      prisma.oldStatus,
      prisma.newStatus,
      prisma.changedAt,
      prisma.id
    );
  }

  static toAssigneeDomain(prisma: PrismaAssigneeHistory): AssigneeHistory {
    return new AssigneeHistory(
      prisma.storyId,
      prisma.oldAssigneeId,
      prisma.newAssigneeId,
      prisma.assignedAt,
      prisma.id
    );
  }
}
