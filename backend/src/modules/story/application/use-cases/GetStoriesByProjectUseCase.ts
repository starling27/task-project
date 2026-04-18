import { UseCase } from '../../../../core/application/UseCase.js';
import { StoryRepository } from '../../domain/repositories/StoryRepository.js';
import { StoryOutput } from '../dtos/StoryDTOs.js';

export class GetStoriesByProjectUseCase implements UseCase<string, StoryOutput[]> {
  constructor(private storyRepository: StoryRepository) {}

  async execute(projectId: string): Promise<StoryOutput[]> {
    const stories = await this.storyRepository.findByProjectId(projectId);
    return stories.map(s => ({
      id: s.id!,
      epicId: s.epicId,
      title: s.title,
      description: s.description,
      status: s.status,
      storyPoints: s.storyPoints,
      priority: s.priority,
      type: s.type,
      assigneeId: s.assigneeId,
      dueDate: s.dueDate,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
      deletedAt: s.deletedAt
    }));
  }
}
