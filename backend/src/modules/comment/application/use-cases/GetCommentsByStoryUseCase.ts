import { UseCase } from '../../../../core/application/UseCase.js';
import { CommentRepository } from '../../domain/repositories/CommentRepository.js';
import { CommentOutput } from '../dtos/CommentDTOs.js';

export class GetCommentsByStoryUseCase implements UseCase<string, CommentOutput[]> {
  constructor(private commentRepository: CommentRepository) {}

  async execute(storyId: string): Promise<CommentOutput[]> {
    const comments = await this.commentRepository.findByStoryId(storyId);
    return comments.map(c => ({
      id: c.id!,
      storyId: c.storyId,
      author: c.author,
      content: c.content,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt
    }));
  }
}
