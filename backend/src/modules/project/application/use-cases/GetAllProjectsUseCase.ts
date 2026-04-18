import { UseCase } from '../../../../core/application/UseCase.js';
import { ProjectRepository } from '../../domain/repositories/ProjectRepository.js';
import { ProjectOutput } from '../dtos/ProjectDTOs.js';

export class GetAllProjectsUseCase implements UseCase<void, ProjectOutput[]> {
  constructor(private projectRepository: ProjectRepository) {}

  async execute(): Promise<ProjectOutput[]> {
    const projects = await this.projectRepository.findAll();
    return projects.map(p => ({
      id: p.id!,
      name: p.name,
      description: p.description,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      deletedAt: p.deletedAt
    }));
  }
}
