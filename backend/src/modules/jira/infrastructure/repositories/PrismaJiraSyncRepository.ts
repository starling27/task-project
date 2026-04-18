import { prisma } from '../../../../core/infrastructure/PrismaClient.js';
import { JiraSyncTask } from '../../domain/entities/JiraSyncTask.js';
import { JiraSyncRepository } from '../../domain/repositories/JiraSyncRepository.js';
import { JiraMapper } from '../mappers/JiraMapper.js';

export class PrismaJiraSyncRepository implements JiraSyncRepository {
  async findById(id: string): Promise<JiraSyncTask | null> {
    const prismaTask = await prisma.jiraSyncQueue.findUnique({ where: { id } });
    return prismaTask ? JiraMapper.toDomain(prismaTask) : null;
  }

  async findByStoryId(storyId: string): Promise<JiraSyncTask | null> {
    const prismaTask = await prisma.jiraSyncQueue.findUnique({ where: { storyId } });
    return prismaTask ? JiraMapper.toDomain(prismaTask) : null;
  }

  async findPending(limit: number): Promise<JiraSyncTask[]> {
    const prismaTasks = await prisma.jiraSyncQueue.findMany({
      where: { status: 'pending' },
      take: limit,
      orderBy: { createdAt: 'asc' }
    });
    return prismaTasks.map(JiraMapper.toDomain);
  }

  async save(task: JiraSyncTask): Promise<JiraSyncTask> {
    const data = JiraMapper.toPersistence(task);
    let prismaTask;

    if (task.id) {
      prismaTask = await prisma.jiraSyncQueue.update({
        where: { id: task.id },
        data: {
          status: data.status,
          retries: data.retries,
          error: data.error
        }
      });
    } else {
      prismaTask = await prisma.jiraSyncQueue.create({
        data: {
          storyId: data.storyId!,
          action: data.action!,
          status: data.status || 'pending',
          retries: data.retries || 0,
          error: data.error
        }
      });
    }

    return JiraMapper.toDomain(prismaTask);
  }

  async upsert(task: Partial<JiraSyncTask>): Promise<JiraSyncTask> {
    const prismaTask = await prisma.jiraSyncQueue.upsert({
      where: { storyId: task.storyId! },
      update: {
        action: task.action,
        status: task.status || 'pending',
        retries: task.retries ?? 0,
        error: task.error
      },
      create: {
        storyId: task.storyId!,
        action: task.action!,
        status: task.status || 'pending',
        retries: task.retries ?? 0,
        error: task.error
      }
    });
    return JiraMapper.toDomain(prismaTask);
  }

  async delete(id: string): Promise<void> {
    await prisma.jiraSyncQueue.delete({ where: { id } });
  }
}
