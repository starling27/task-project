import { BaseEntity } from '../../../../core/domain/BaseEntity.js';

export class Story extends BaseEntity {
  private static readonly VALID_POINTS = [1, 2, 3, 5, 8, 13];

  constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly epicId: string,
    public readonly status: string,
    public readonly storyPoints?: number,
    public readonly priority: string = 'medium',
    public readonly type: string = 'story',
    public readonly assigneeId?: string,
    public readonly dueDate?: Date,
    public readonly jiraIssueKey?: string,
    public readonly acceptanceCriteria?: string,
    public readonly observations?: string,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date | null
  ) {
    super(id, createdAt, updatedAt, deletedAt);
  }

  public validate(): void {
    if (this.title.length < 5) {
      throw new Error('Story title too short');
    }
    if (this.storyPoints !== undefined && !Story.VALID_POINTS.includes(this.storyPoints)) {
      throw new Error(`Invalid story points: ${this.storyPoints}. Must be Fibonacci: 1, 2, 3, 5, 8, 13`);
    }
  }
}
