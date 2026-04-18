import { UseCase } from '../../../../core/application/UseCase.js';
import { Project } from '../../domain/entities/Project.js';
import { ProjectRepository } from '../../domain/repositories/ProjectRepository.js';
import { UpdateProjectInput, ProjectOutput } from '../dtos/ProjectDTOs.js';

export class UpdateProjectUseCase implements UseCase<UpdateProjectInput, ProjectOutput> {
  constructor(private projectRepository: ProjectRepository) {}

  async execute(input: UpdateProjectInput): Promise<ProjectOutput> {
    const project = await this.projectRepository.findById(input.id);
    if (!project) throw new Error('Project not found');

    if (input.name && input.name !== project.name) {
      const existing = await this.projectRepository.findByName(input.name);
      if (existing) throw new Error('Project name must be unique');
    }

    const updatedProject = new Project(
      input.name ?? project.name,
      input.description ?? project.description,
      project.id,
      project.createdAt,
      new Date(),
      project.deletedAt
    );
    updatedProject.validate();

    const saved = await this.projectRepository.save(updatedProject);

    return {
      id: saved.id!,
      name: saved.name,
      description: saved.description,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
      deletedAt: saved.deletedAt
    };
  }
}
