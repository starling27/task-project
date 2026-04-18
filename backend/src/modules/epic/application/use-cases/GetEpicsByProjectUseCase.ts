import { UseCase } from '../../../../core/application/UseCase.js';
import { EpicRepository } from '../../domain/repositories/EpicRepository.js';
import { EpicOutput } from '../dtos/EpicDTOs.js';

export class GetEpicsByProjectUseCase implements UseCase<string, EpicOutput[]> {
  constructor(private epicRepository: EpicRepository) {}

  async execute(projectId: string): Promise<EpicOutput[]> {
    const epics = await this.epicRepository.findByProjectId(projectId);
    return epics.map(e => ({
      id: e.id!,
      projectId: e.projectId,
      name: e.name,
      description: e.description,
      status: e.status,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
      deletedAt: e.deletedAt
    }));
  }
}
