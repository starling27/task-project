import { UseCase } from '../../../../core/application/UseCase.js';
import { HistoryRepository } from '../../domain/repositories/HistoryRepository.js';

export class GetFullStoryHistoryUseCase implements UseCase<string, any[]> {
  constructor(private historyRepository: HistoryRepository) {}

  async execute(storyId: string): Promise<any[]> {
    const [status, assignee] = await Promise.all([
      this.historyRepository.findStatusHistoryByStoryId(storyId),
      this.historyRepository.findAssigneeHistoryByStoryId(storyId)
    ]);

    const history = [
      ...status.map(s => ({ ...s, type: 'status' })),
      ...assignee.map(a => ({ ...a, type: 'assignee' }))
    ];

    return history.sort((a, b) => {
      const dateA = (a as any).changedAt || (a as any).assignedAt;
      const dateB = (b as any).changedAt || (b as any).assignedAt;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
  }
}
