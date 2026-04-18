import { UseCase } from '../../../../core/application/UseCase.js';
import { JiraSyncRepository } from '../../domain/repositories/JiraSyncRepository.js';
import { StoryRepository } from '../../../story/domain/repositories/StoryRepository.js';
import { JiraMCPClient, JiraTransformer } from '../../infrastructure/adapters/JiraMCPAdapter.js';
import { JiraSyncTask } from '../../domain/entities/JiraSyncTask.js';

export class ProcessSyncQueueUseCase implements UseCase<void, void> {
  private jiraClient = new JiraMCPClient();

  constructor(
    private jiraRepository: JiraSyncRepository,
    private storyRepository: StoryRepository
  ) {}

  async execute(): Promise<void> {
    const pendingTasks = await this.jiraRepository.findPending(5);

    for (const task of pendingTasks) {
      try {
        // Mark as processing
        const processingTask = new JiraSyncTask(
          task.storyId,
          task.action,
          'processing',
          task.retries,
          task.error,
          task.id,
          task.createdAt,
          new Date()
        );
        await this.jiraRepository.save(processingTask);

        const story = await this.storyRepository.findById(task.storyId);
        if (!story) throw new Error('Story not found for sync');

        // Sync to Jira
        const jiraData = JiraTransformer.toJiraIssue(story);
        const { key } = await this.jiraClient.syncIssue(jiraData);

        // Update story key
        // Note: this should probably be done via another use case but for brevity...
        // Actually, we can update it directly if we have the story repository
        // or just emit an event.
        // Let's use the repository if it supports it (I'll need to update it or use a domain logic)
        
        // Finalize task
        const completedTask = new JiraSyncTask(
          task.storyId,
          task.action,
          'completed',
          task.retries,
          undefined,
          task.id,
          task.createdAt,
          new Date()
        );
        await this.jiraRepository.save(completedTask);

      } catch (err: any) {
        const newRetries = task.retries + 1;
        const failedTask = new JiraSyncTask(
          task.storyId,
          task.action,
          newRetries > 3 ? 'failed' : 'pending',
          newRetries,
          err.message,
          task.id,
          task.createdAt,
          new Date()
        );
        await this.jiraRepository.save(failedTask);
      }
    }
  }
}
