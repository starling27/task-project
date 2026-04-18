import { UseCase } from '../../../../core/application/UseCase.js';
import { EpicRepository } from '../../domain/repositories/EpicRepository.js';

export class DeleteEpicUseCase implements UseCase<string, void> {
  constructor(private epicRepository: EpicRepository) {}

  async execute(id: string): Promise<void> {
    const epic = await this.epicRepository.findById(id);
    if (!epic) throw new Error('Epic not found');

    await this.epicRepository.softDelete(id);
  }
}
