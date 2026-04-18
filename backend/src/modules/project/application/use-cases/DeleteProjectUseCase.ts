import { UseCase } from '../../../../core/application/UseCase.js';
import { ProjectRepository } from '../../domain/repositories/ProjectRepository.js';

export class DeleteProjectUseCase implements UseCase<string, void> {
  constructor(private projectRepository: ProjectRepository) {}

  async execute(id: string): Promise<void> {
    const project = await this.projectRepository.findById(id);
    if (!project) throw new Error('Project not found');

    await this.projectRepository.softDelete(id);
  }
}
