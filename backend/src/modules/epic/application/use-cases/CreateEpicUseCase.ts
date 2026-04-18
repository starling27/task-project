import { UseCase } from '../../../../core/application/UseCase.js';
import { Epic } from '../../domain/entities/Epic.js';
import { EpicRepository } from '../../domain/repositories/EpicRepository.js';
import { ProjectRepository } from '../../../project/domain/repositories/ProjectRepository.js';
import { CreateEpicInput, EpicOutput } from '../dtos/EpicDTOs.js';

export class CreateEpicUseCase implements UseCase<CreateEpicInput, EpicOutput> {
  constructor(
    private epicRepository: EpicRepository,
    private projectRepository: ProjectRepository
  ) {}

  async execute(input: CreateEpicInput): Promise<EpicOutput> {
    const project = await this.projectRepository.findById(input.projectId);
    if (!project) throw new Error('Project does not exist');

    const existing = await this.epicRepository.findByNameInProject(input.projectId, input.name);
    if (existing) throw new Error('Epic name must be unique within project');

    const epic = new Epic(input.name, input.projectId, input.description);
    epic.validate();

    const created = await this.epicRepository.save(epic);

    return {
      id: created.id!,
      projectId: created.projectId,
      name: created.name,
      description: created.description,
      status: created.status,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
      deletedAt: created.deletedAt
    };
  }
}
