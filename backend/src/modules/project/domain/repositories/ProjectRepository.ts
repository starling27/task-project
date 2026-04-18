import { Repository } from '../../../../core/domain/Repository.js';
import { Project } from '../entities/Project.js';

export interface ProjectRepository extends Repository<Project> {
  findByName(name: string): Promise<Project | null>;
  createWithDefaultWorkflow(project: Project): Promise<Project>;
  softDelete(id: string): Promise<void>;
}
