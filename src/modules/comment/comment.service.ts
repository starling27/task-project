import { PrismaClient } from '@prisma/client';
import { eventBus, SystemEvents } from '../../services/eventBus.js';

const prisma = new PrismaClient();

export class CommentService {
  async create(data: { storyId: string; userId: string; content: string }) {
    if (!data.content || data.content.trim().length === 0) {
      throw new Error('Comment content cannot be empty');
    }

    const comment = await prisma.comment.create({
      data: {
        storyId: data.storyId,
        userId: data.userId,
        content: data.content
      },
      include: {
        user: true
      }
    });

    eventBus.emitEvent(SystemEvents.COMMENT_ADDED, {
      storyId: data.storyId,
      commentId: comment.id,
      userId: data.userId
    });

    return comment;
  }

  async getByStory(storyId: string) {
    return prisma.comment.findMany({
      where: { storyId },
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });
  }
}
