import { UseCase } from '../../../../core/application/UseCase.js';
import { EpicRepository } from '../../domain/repositories/EpicRepository.js';
import { EpicOutput } from '../dtos/EpicDTOs.js';

export class GetEpicByIdUseCase implements UseCase<string, EpicOutput> {
  constructor(private epicRepository: EpicRepository) {}

  async execute(id: string): Promise<EpicOutput> {
    const epic = await this.epicRepository.findById(id);
    if (!epic) throw new Error('Epic not found');

    return {
      id: epic.id!,
      projectId: epic.projectId,
      name: epic.name,
      description: epic.description,
      status: epic.status,
      createdAt: epic.createdAt,
      updatedAt: epic.updatedAt,
      deletedAt: epic.deletedAt
    };
  }
}