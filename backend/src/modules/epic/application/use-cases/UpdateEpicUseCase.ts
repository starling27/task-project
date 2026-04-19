import { UseCase } from '../../../../core/application/UseCase.js';
import { Epic } from '../../domain/entities/Epic.js';
import { EpicRepository } from '../../domain/repositories/EpicRepository.js';
import { UpdateEpicInput, EpicOutput } from '../dtos/EpicDTOs.js';

export class UpdateEpicUseCase implements UseCase<UpdateEpicInput, EpicOutput> {
  constructor(private epicRepository: EpicRepository) {}

  async execute(input: UpdateEpicInput): Promise<EpicOutput> {
    const existingEpic = await this.epicRepository.findById(input.id);
    if (!existingEpic) throw new Error('Epic not found');

    if (existingEpic.status === 'archived') {
      throw new Error('Archived epics cannot be updated');
    }

    if (input.name && input.name !== existingEpic.name) {
      const existing = await this.epicRepository.findByNameInProject(existingEpic.projectId, input.name);
      if (existing) throw new Error('Epic name must be unique within project');
    }

    const updatedEpic = new Epic(
      input.name ?? existingEpic.name,
      existingEpic.projectId,
      input.description !== undefined ? input.description : existingEpic.description,
      input.status ?? existingEpic.status,
      existingEpic.id,
      existingEpic.createdAt,
      new Date(),
      existingEpic.deletedAt
    );
    updatedEpic.validate();

    const saved = await this.epicRepository.save(updatedEpic);

    return {
      id: saved.id!,
      projectId: saved.projectId,
      name: saved.name,
      description: saved.description,
      status: saved.status,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
      deletedAt: saved.deletedAt
    };
  }
}