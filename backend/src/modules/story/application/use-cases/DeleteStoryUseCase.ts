import { UseCase } from '../../../../core/application/UseCase.js';
import { StoryRepository } from '../../domain/repositories/StoryRepository.js';

export class DeleteStoryUseCase implements UseCase<string, void> {
  constructor(private storyRepository: StoryRepository) {}

  async execute(id: string): Promise<void> {
    const story = await this.storyRepository.findById(id);
    if (!story) throw new Error('Story not found');

    await this.storyRepository.softDelete(id);
  }
}
