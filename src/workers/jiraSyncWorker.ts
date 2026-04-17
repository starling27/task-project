import { PrismaClient } from '@prisma/client';
import { eventBus, SystemEvents } from '../services/eventBus.js';
import { JiraMCPClient, JiraTransformer } from '../services/jiraSync.service.js';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();
const jiraClient = new JiraMCPClient();

export class JiraSyncWorker {
  private static listenersRegistered = false;

  constructor() {
    this.setupListeners();
  }

  private setupListeners() {
    if (JiraSyncWorker.listenersRegistered) return;
    JiraSyncWorker.listenersRegistered = true;

    // Escuchar eventos para encolar tareas
    eventBus.subscribe(SystemEvents.STORY_CREATED, async ({ storyId }) => {
      await this.queueSync(storyId, 'create');
    });

    eventBus.subscribe(SystemEvents.STORY_UPDATED, async ({ storyId }) => {
      await this.queueSync(storyId, 'update');
    });

    eventBus.subscribe(SystemEvents.STORY_STATUS_CHANGED, async ({ storyId }) => {
      await this.queueSync(storyId, 'update');
    });
  }

  private async queueSync(storyId: string, action: string) {
    console.log(`[SyncWorker] Queuing ${action} for story ${storyId}`);
    
    await prisma.jiraSyncQueue.upsert({
      where: { storyId },
      update: {
        action,
        status: 'pending',
        retries: 0 // Reset retries on update if it was failed/pending
      },
      create: {
        storyId,
        action,
        status: 'pending'
      }
    });

    // En un entorno real, aquí se notificaría a BullMQ/RabbitMQ
    // Por ahora, disparamos el proceso de forma inmediata e independiente
    this.processQueue();
  }

  public async processQueue() {
    const pendingTasks = await prisma.jiraSyncQueue.findMany({
      where: { status: 'pending' },
      take: 5
    });

    for (const task of pendingTasks) {
      try {
        await prisma.jiraSyncQueue.update({
          where: { id: task.id },
          data: { status: 'processing' }
        });

        const story = await prisma.story.findUnique({ 
          where: { id: task.storyId },
          include: { epic: true }
        });
        if (!story) throw new Error('Story not found for sync');

        // Transformar e Inviar a Jira via MCP
        const jiraData = JiraTransformer.toJiraIssue(story);
        const { key } = await jiraClient.syncIssue(jiraData);

        // Actualizar historia local con la clave de Jira (idempotencia)
        await prisma.story.update({
          where: { id: story.id },
          data: { jiraIssueKey: key }
        });

        await prisma.jiraSyncQueue.update({
          where: { id: task.id },
          data: { status: 'completed' }
        });

        console.log(`[SyncWorker] Successfully synced ${story.id} to Jira as ${key}`);
      } catch (err: any) {
        console.error(`[SyncWorker] Sync failed for task ${task.id}:`, err.message);
        
        const newRetries = task.retries + 1;
        await prisma.jiraSyncQueue.update({
          where: { id: task.id },
          data: {
            status: newRetries > 3 ? 'failed' : 'pending',
            retries: newRetries,
            error: err.message
          }
        });
      }
    }
  }
}

// Auto-start worker if run directly
const currentFile = fileURLToPath(import.meta.url);
if (process.argv[1] && currentFile === process.argv[1]) {
  console.log('👷 JiraSyncWorker Starting...');
  new JiraSyncWorker();
}
