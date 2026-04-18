import { UseCase } from '../../../../core/application/UseCase.js';
import { Project } from '../../domain/entities/Project.js';
import { ProjectRepository } from '../../domain/repositories/ProjectRepository.js';
import { CreateProjectInput, ProjectOutput } from '../dtos/ProjectDTOs.js';

export class CreateProjectUseCase implements UseCase<CreateProjectInput, ProjectOutput> {
  constructor(private projectRepository: ProjectRepository) {}

  async execute(input: CreateProjectInput): Promise<ProjectOutput> {
    const existing = await this.projectRepository.findByName(input.name);
    if (existing) throw new Error('Project name must be unique');

    const project = new Project(input.name, input.description);
    project.validate();

    const created = await this.projectRepository.createWithDefaultWorkflow(project);
    
    return {
      id: created.id!,
      name: created.name,
      description: created.description,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
      deletedAt: created.deletedAt
    };
  }
}
