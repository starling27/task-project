import { Repository } from '../../../../core/domain/Repository.js';
import { Story } from '../entities/Story.js';

export interface StoryRepository extends Repository<Story> {
  findByProjectId(projectId: string): Promise<Story[]>;
  softDelete(id: string): Promise<void>;
}
