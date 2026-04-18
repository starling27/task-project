import { UseCase } from '../../../../core/application/UseCase.js';
import { ProjectRepository } from '../../domain/repositories/ProjectRepository.js';
import { ProjectOutput } from '../dtos/ProjectDTOs.js';

export class GetProjectByIdUseCase implements UseCase<string, ProjectOutput> {
  constructor(private projectRepository: ProjectRepository) {}

  async execute(id: string): Promise<ProjectOutput> {
    const project = await this.projectRepository.findById(id);
    if (!project) throw new Error('Project not found');

    return {
      id: project.id!,
      name: project.name,
      description: project.description,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      deletedAt: project.deletedAt
    };
  }
}
