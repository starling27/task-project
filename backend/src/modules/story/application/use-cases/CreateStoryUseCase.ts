import { UseCase } from '../../../../core/application/UseCase.js';
import { Story } from '../../domain/entities/Story.js';
import { StoryRepository } from '../../domain/repositories/StoryRepository.js';
import { EpicRepository } from '../../../epic/domain/repositories/EpicRepository.js';
import { WorkflowService } from '../../../workflow/workflow.service.js';
import { eventBus, SystemEvents } from '../../../../shared/services/eventBus.js';
import { CreateStoryInput, StoryOutput } from '../dtos/StoryDTOs.js';

export class CreateStoryUseCase implements UseCase<CreateStoryInput, StoryOutput> {
  constructor(
    private storyRepository: StoryRepository,
    private epicRepository: EpicRepository,
    private workflowService: WorkflowService
  ) {}

  async execute(input: CreateStoryInput): Promise<StoryOutput> {
    const epic = await this.epicRepository.findById(input.epicId);
    if (!epic) throw new Error('Epic does not exist');

    const initialStatus = await this.workflowService.getInitialState(epic.projectId);

    const dueDate = input.dueDate ? new Date(input.dueDate) : undefined;

    const story = new Story(
      input.title,
      input.description,
      input.epicId,
      initialStatus,
      input.storyPoints,
      input.priority,
      input.type,
      input.assigneeId,
      dueDate
    );
    story.validate();

    const created = await this.storyRepository.save(story);

    eventBus.emitEvent(SystemEvents.STORY_CREATED, { storyId: created.id!, payload: created });

    return {
      id: created.id!,
      epicId: created.epicId,
      title: created.title,
      description: created.description,
      status: created.status,
      storyPoints: created.storyPoints,
      priority: created.priority,
      type: created.type,
      assigneeId: created.assigneeId,
      dueDate: created.dueDate,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
      deletedAt: created.deletedAt
    };
  }
}
