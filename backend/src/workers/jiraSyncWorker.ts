import { eventBus, SystemEvents } from '../shared/services/eventBus.js';
import { PrismaJiraSyncRepository } from '../modules/jira/infrastructure/repositories/PrismaJiraSyncRepository.js';
import { PrismaStoryRepository } from '../modules/story/infrastructure/repositories/PrismaStoryRepository.js';
import { QueueSyncUseCase } from '../modules/jira/application/use-cases/QueueSyncUseCase.js';
import { ProcessSyncQueueUseCase } from '../modules/jira/application/use-cases/ProcessSyncQueueUseCase.js';
import { fileURLToPath } from 'url';

// Repositories
const jiraRepository = new PrismaJiraSyncRepository();
const storyRepository = new PrismaStoryRepository();

// Use Cases
const queueSyncUseCase = new QueueSyncUseCase(jiraRepository);
const processSyncQueueUseCase = new ProcessSyncQueueUseCase(jiraRepository, storyRepository);

export class JiraSyncWorker {
  private static listenersRegistered = false;

  constructor() {
    this.setupListeners();
  }

  private setupListeners() {
    if (JiraSyncWorker.listenersRegistered) return;
    JiraSyncWorker.listenersRegistered = true;

    eventBus.subscribe(SystemEvents.STORY_CREATED, async ({ storyId }) => {
      await queueSyncUseCase.execute({ storyId, action: 'create' });
      this.processQueue();
    });

    eventBus.subscribe(SystemEvents.STORY_UPDATED, async ({ storyId }) => {
      await queueSyncUseCase.execute({ storyId, action: 'update' });
      this.processQueue();
    });

    eventBus.subscribe(SystemEvents.STORY_STATUS_CHANGED, async ({ storyId }) => {
      await queueSyncUseCase.execute({ storyId, action: 'update' });
      this.processQueue();
    });
  }

  public async processQueue() {
    await processSyncQueueUseCase.execute();
  }
}

// Auto-start worker if run directly
const currentFile = fileURLToPath(import.meta.url);
if (process.argv[1] && currentFile === process.argv[1]) {
  console.log('👷 JiraSyncWorker Starting (Hexagonal)...');
  new JiraSyncWorker();
}
