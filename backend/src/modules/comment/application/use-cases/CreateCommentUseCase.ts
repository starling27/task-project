import { UseCase } from '../../../../core/application/UseCase.js';
import { Comment } from '../../domain/entities/Comment.js';
import { CommentRepository } from '../../domain/repositories/CommentRepository.js';
import { eventBus, SystemEvents } from '../../../../shared/services/eventBus.js';
import { CreateCommentInput, CommentOutput } from '../dtos/CommentDTOs.js';

export class CreateCommentUseCase implements UseCase<CreateCommentInput, CommentOutput> {
  constructor(private commentRepository: CommentRepository) {}

  async execute(input: CreateCommentInput): Promise<CommentOutput> {
    const comment = new Comment(input.content, input.author, input.storyId);
    comment.validate();

    const created = await this.commentRepository.save(comment);

    eventBus.emitEvent(SystemEvents.COMMENT_ADDED, {
      storyId: created.storyId,
      commentId: created.id!,
      author: created.author
    });

    return {
      id: created.id!,
      storyId: created.storyId,
      author: created.author,
      content: created.content,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt
    };
  }
}
