import { prisma } from '../../../../core/infrastructure/PrismaClient.js';
import { Story } from '../../domain/entities/Story.js';
import { StoryRepository } from '../../domain/repositories/StoryRepository.js';
import { StoryMapper } from '../mappers/StoryMapper.js';

export class PrismaStoryRepository implements StoryRepository {
  async findById(id: string): Promise<Story | null> {
    const prismaStory = await prisma.story.findFirst({
      where: { id, deletedAt: null }
    });
    return prismaStory ? StoryMapper.toDomain(prismaStory) : null;
  }

  async findByProjectId(projectId: string): Promise<Story[]> {
    const prismaStories = await prisma.story.findMany({
      where: {
        deletedAt: null,
        epic: {
          projectId: projectId,
        },
      },
      orderBy: {
        id: 'desc',
      },
    });
    return prismaStories.map(StoryMapper.toDomain);
  }

  async findAll(): Promise<Story[]> {
    const prismaStories = await prisma.story.findMany({
      where: { deletedAt: null }
    });
    return prismaStories.map(StoryMapper.toDomain);
  }

  async save(story: Story): Promise<Story> {
    const data = StoryMapper.toPersistence(story);
    let prismaStory;

    if (story.id) {
      prismaStory = await prisma.story.update({
        where: { id: story.id },
        data: {
          title: data.title,
          description: data.description,
          epicId: data.epicId,
          status: data.status,
          storyPoints: data.storyPoints,
          priority: data.priority,
          type: data.type,
          assigneeId: data.assigneeId,
          dueDate: data.dueDate,
          jiraIssueKey: data.jiraIssueKey,
          acceptanceCriteria: data.acceptanceCriteria,
          observations: data.observations,
          deletedAt: data.deletedAt
        }
      });
    } else {
      prismaStory = await prisma.story.create({
        data: {
          title: data.title!,
          description: data.description!,
          epicId: data.epicId!,
          status: data.status!,
          storyPoints: data.storyPoints,
          priority: data.priority,
          type: data.type,
          assigneeId: data.assigneeId,
          dueDate: data.dueDate,
          jiraIssueKey: data.jiraIssueKey,
          acceptanceCriteria: data.acceptanceCriteria,
          observations: data.observations,
          deletedAt: data.deletedAt
        }
      });
    }

    return StoryMapper.toDomain(prismaStory);
  }

  async delete(id: string): Promise<void> {
    await prisma.story.delete({ where: { id } });
  }

  async softDelete(id: string): Promise<void> {
    await prisma.story.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }
}
