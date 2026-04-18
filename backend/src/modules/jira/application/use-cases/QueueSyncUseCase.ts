import { UseCase } from '../../../../core/application/UseCase.js';
import { JiraSyncRepository } from '../../domain/repositories/JiraSyncRepository.js';

export interface QueueSyncInput {
  storyId: string;
  action: string;
}

export class QueueSyncUseCase implements UseCase<QueueSyncInput, void> {
  constructor(private jiraRepository: JiraSyncRepository) {}

  async execute(input: QueueSyncInput): Promise<void> {
    await this.jiraRepository.upsert({
      storyId: input.storyId,
      action: input.action,
      status: 'pending',
      retries: 0
    });
  }
}
