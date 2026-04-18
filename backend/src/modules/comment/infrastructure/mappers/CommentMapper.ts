import { Comment as PrismaComment } from '@prisma/client';
import { Comment } from '../../domain/entities/Comment.js';

export class CommentMapper {
  static toDomain(prismaComment: PrismaComment): Comment {
    return new Comment(
      prismaComment.content,
      prismaComment.author,
      prismaComment.storyId,
      prismaComment.id,
      prismaComment.createdAt,
      prismaComment.updatedAt,
      prismaComment.deletedAt
    );
  }

  static toPersistence(comment: Comment): Partial<PrismaComment> {
    return {
      content: comment.content,
      author: comment.author,
      storyId: comment.storyId,
      deletedAt: comment.deletedAt
    };
  }
}
