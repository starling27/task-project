import { UseCase } from '../../../../core/application/UseCase.js';
import { prisma } from '../../../../core/infrastructure/PrismaClient.js';
import { Story } from '../../domain/entities/Story.js';
import { StoryRepository } from '../../domain/repositories/StoryRepository.js';
import { EpicRepository } from '../../../epic/domain/repositories/EpicRepository.js';
import { WorkflowService } from '../../../workflow/workflow.service.js';
import { eventBus, SystemEvents } from '../../../../shared/services/eventBus.js';
import { UpdateStoryInput, StoryOutput } from '../dtos/StoryDTOs.js';

export class UpdateStoryUseCase implements UseCase<UpdateStoryInput, StoryOutput> {
  constructor(
    private storyRepository: StoryRepository,
    private epicRepository: EpicRepository,
    private workflowService: WorkflowService
  ) {}

  async execute(input: UpdateStoryInput): Promise<StoryOutput> {
    const story_to_update = await this.storyRepository.findById(input.id);
    if (!story_to_update) throw new Error('Story not found');

    const epic = await this.epicRepository.findById(story_to_update.epicId);
    if (!epic) throw new Error('Epic not found');

    const dueDate = input.dueDate ? new Date(input.dueDate) : story_to_update.dueDate;

    // Workflow validation
    if (input.status && input.status !== story_to_update.status) {
      await this.workflowService.validateTransition(
        story_to_update.status,
        input.status,
        epic.projectId
      );

      // Register history
      await prisma.statusHistory.create({
        data: {
          storyId: input.id,
          oldStatus: story_to_update.status,
          newStatus: input.status
        }
      });

      eventBus.emitEvent(SystemEvents.STORY_STATUS_CHANGED, {
        storyId: input.id,
        oldStatus: story_to_update.status,
        newStatus: input.status
      });
    }

    // Assignee history
    if (input.assigneeId && input.assigneeId !== story_to_update.assigneeId) {
      await prisma.assigneeHistory.create({
        data: {
          storyId: input.id,
          oldAssigneeId: story_to_update.assigneeId,
          newAssigneeId: input.assigneeId
        }
      });

      eventBus.emitEvent(SystemEvents.STORY_ASSIGNED, {
        storyId: input.id,
        oldAssigneeId: story_to_update.assigneeId || undefined,
        newAssigneeId: input.assigneeId
      });
    }

    const updatedStory = new Story(
      input.title ?? story_to_update.title,
      input.description ?? story_to_update.description,
      story_to_update.epicId,
      input.status ?? story_to_update.status,
      input.storyPoints ?? story_to_update.storyPoints,
      input.priority ?? story_to_update.priority,
      input.type ?? story_to_update.type,
      input.assigneeId ?? story_to_update.assigneeId,
      dueDate,
      story_to_update.jiraIssueKey,
      story_to_update.acceptanceCriteria,
      story_to_update.observations,
      story_to_update.id,
      story_to_update.createdAt,
      new Date(),
      story_to_update.deletedAt
    );
    updatedStory.validate();

    const saved = await this.storyRepository.save(updatedStory);

    eventBus.emitEvent(SystemEvents.STORY_UPDATED, { storyId: saved.id!, changes: input });

    return {
      id: saved.id!,
      epicId: saved.epicId,
      title: saved.title,
      description: saved.description,
      status: saved.status,
      storyPoints: saved.storyPoints,
      priority: saved.priority,
      type: saved.type,
      assigneeId: saved.assigneeId,
      dueDate: saved.dueDate,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
      deletedAt: saved.deletedAt
    };
  }
}
