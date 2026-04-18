import { JiraSyncQueue as PrismaJiraTask } from '@prisma/client';
import { JiraSyncTask } from '../../domain/entities/JiraSyncTask.js';

export class JiraMapper {
  static toDomain(prisma: PrismaJiraTask): JiraSyncTask {
    return new JiraSyncTask(
      prisma.storyId,
      prisma.action,
      prisma.status,
      prisma.retries,
      prisma.error || undefined,
      prisma.id,
      prisma.createdAt,
      prisma.updatedAt
    );
  }

  static toPersistence(task: JiraSyncTask): Partial<PrismaJiraTask> {
    return {
      storyId: task.storyId,
      action: task.action,
      status: task.status,
      retries: task.retries,
      error: task.error
    };
  }
}
