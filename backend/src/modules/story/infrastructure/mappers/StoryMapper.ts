import { Story as PrismaStory } from '@prisma/client';
import { Story } from '../../domain/entities/Story.js';

export class StoryMapper {
  static toDomain(prismaStory: PrismaStory): Story {
    return new Story(
      prismaStory.title,
      prismaStory.description,
      prismaStory.epicId,
      prismaStory.status,
      prismaStory.storyPoints || undefined,
      prismaStory.priority,
      prismaStory.type,
      prismaStory.assigneeId || undefined,
      prismaStory.dueDate || undefined,
      prismaStory.jiraIssueKey || undefined,
      prismaStory.acceptanceCriteria || undefined,
      prismaStory.observations || undefined,
      prismaStory.id,
      prismaStory.createdAt,
      prismaStory.updatedAt,
      prismaStory.deletedAt
    );
  }

  static toPersistence(story: Story): Partial<PrismaStory> {
    return {
      title: story.title,
      description: story.description,
      epicId: story.epicId,
      status: story.status,
      storyPoints: story.storyPoints,
      priority: story.priority,
      type: story.type,
      assigneeId: story.assigneeId,
      dueDate: story.dueDate,
      jiraIssueKey: story.jiraIssueKey,
      acceptanceCriteria: story.acceptanceCriteria,
      observations: story.observations,
      deletedAt: story.deletedAt
    };
  }
}
