import { prisma } from '../../../../core/infrastructure/PrismaClient.js';
import { Comment } from '../../domain/entities/Comment.js';
import { CommentRepository } from '../../domain/repositories/CommentRepository.js';
import { CommentMapper } from '../mappers/CommentMapper.js';

export class PrismaCommentRepository implements CommentRepository {
  async findById(id: string): Promise<Comment | null> {
    const prismaComment = await prisma.comment.findUnique({ where: { id } });
    return prismaComment ? CommentMapper.toDomain(prismaComment) : null;
  }

  async findByStoryId(storyId: string): Promise<Comment[]> {
    const prismaComments = await prisma.comment.findMany({
      where: { storyId },
      orderBy: { createdAt: 'desc' }
    });
    return prismaComments.map(CommentMapper.toDomain);
  }

  async findAll(): Promise<Comment[]> {
    const prismaComments = await prisma.comment.findMany();
    return prismaComments.map(CommentMapper.toDomain);
  }

  async save(comment: Comment): Promise<Comment> {
    const data = CommentMapper.toPersistence(comment);
    let prismaComment;

    if (comment.id) {
      prismaComment = await prisma.comment.update({
        where: { id: comment.id },
        data: {
          content: data.content,
          author: data.author,
          storyId: data.storyId,
          deletedAt: data.deletedAt
        }
      });
    } else {
      prismaComment = await prisma.comment.create({
        data: {
          content: data.content!,
          author: data.author!,
          storyId: data.storyId!
        }
      });
    }

    return CommentMapper.toDomain(prismaComment);
  }

  async delete(id: string): Promise<void> {
    await prisma.comment.delete({ where: { id } });
  }
}
