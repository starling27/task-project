import { Repository } from '../../../../core/domain/Repository.js';
import { Comment } from '../entities/Comment.js';

export interface CommentRepository extends Repository<Comment> {
  findByStoryId(storyId: string): Promise<Comment[]>;
}
