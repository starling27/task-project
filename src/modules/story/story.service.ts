import { PrismaClient } from '@prisma/client';
import { eventBus, SystemEvents } from '../../services/eventBus.js';
import { WorkflowService } from '../workflow/workflow.service.js';

const prisma = new PrismaClient();
const workflowService = new WorkflowService();

export class StoryService {
  private validPoints = [1, 2, 3, 5, 8, 13];

  async create(data: {
    epicId: string;
    title: string;
    description: string;
    storyPoints?: number;
    priority?: string;
    type?: string;
    assigneeId?: string;
  }) {
    // 1. Validar Epic
    const epic = await prisma.epic.findUnique({ where: { id: data.epicId } });
    if (!epic) throw new Error('Epic does not exist');

    // 2. Validar Story Points
    if (data.storyPoints && !this.validPoints.includes(data.storyPoints)) {
      throw new Error(`Invalid story points: ${data.storyPoints}. Must be Fibonacci: 1, 2, 3, 5, 8, 13`);
    }

    // 3. Obtener estado inicial
    const initialStatus = await workflowService.getInitialState(epic.projectId);

    const story = await prisma.story.create({
      data: {
        ...data,
        status: initialStatus
      }
    });

    // 4. Emitir Evento
    eventBus.emitEvent(SystemEvents.STORY_CREATED, { storyId: story.id, payload: story });

    return story;
  }

  async update(id: string, data: any) {
    const story_to_update = await prisma.story.findUnique({
      where: { id },
      include: { epic: true }
    });
    if (!story_to_update) throw new Error('Story not found');

    // Validar Story Points si cambian
    if (data.storyPoints && !this.validPoints.includes(data.storyPoints)) {
      throw new Error('Invalid Fibonacci points');
    }

    // Validar Workflow si cambia el status
    if (data.status && data.status !== story_to_update.status) {
      await workflowService.validateTransition(
        story_to_update.status,
        data.status,
        story_to_update.epic.projectId
      );

      // Registrar historial de estado (esto también se puede hacer vía suscriptor de eventos)
      await prisma.statusHistory.create({
        data: {
          storyId: id,
          oldStatus: story_to_update.status,
          newStatus: data.status
        }
      });

      eventBus.emitEvent(SystemEvents.STORY_STATUS_CHANGED, {
        storyId: id,
        oldStatus: story_to_update.status,
        newStatus: data.status
      });
    }

    // Validar Asignado
    if (data.assigneeId && data.assigneeId !== story_to_update.assigneeId) {
      await prisma.assigneeHistory.create({
        data: {
          storyId: id,
          oldAssigneeId: story_to_update.assigneeId,
          newAssigneeId: data.assigneeId
        }
      });

      eventBus.emitEvent(SystemEvents.STORY_ASSIGNED, {
        storyId: id,
        oldAssigneeId: story_to_update.assigneeId || undefined,
        newAssigneeId: data.assigneeId
      });
    }

    const updatedStory = await prisma.story.update({
      where: { id },
      data
    });

    eventBus.emitEvent(SystemEvents.STORY_UPDATED, { storyId: id, changes: data });

    return updatedStory;
  }

  async getAll() {
    return prisma.story.findMany({
      include: {
        assignee: true,
        epic: true,
        comments: { take: 5, orderBy: { createdAt: 'desc' } }
      }
    });
  }

  async getByProject(projectId: string) {
    return prisma.story.findMany({
      where: {
        epic: {
          projectId: projectId,
        },
      },
      include: {
        assignee: true,
        epic: true,
        comments: { take: 1, orderBy: { createdAt: 'desc' } },
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  async getById(id: string) {
    return prisma.story.findUnique({
      where: { id },
      include: {
        assignee: true,
        epic: true,
        comments: true,
        statusHistory: { orderBy: { changedAt: 'desc' } },
        assigneeHistory: { orderBy: { assignedAt: 'desc' }, include: { newAssignee: true } }
      }
    });
  }
}
