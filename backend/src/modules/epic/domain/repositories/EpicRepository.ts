import { Repository } from '../../../../core/domain/Repository.js';
import { Epic } from '../entities/Epic.js';

export interface EpicRepository extends Repository<Epic> {
  findByProjectId(projectId: string): Promise<Epic[]>;
  findByNameInProject(projectId: string, name: string): Promise<Epic | null>;
  softDelete(id: string): Promise<void>;
}
