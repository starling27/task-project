import { BaseEntity } from '../../../../core/domain/BaseEntity.js';

export class WorkflowState extends BaseEntity {
  constructor(
    public readonly name: string,
    public readonly projectId: string,
    public readonly order: number = 0,
    public readonly color: string = '#94a3b8',
    public readonly isInitial: boolean = false,
    public readonly isFinal: boolean = false,
    public readonly isDefault: boolean = false,
    public readonly description?: string,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date | null
  ) {
    super(id, createdAt, updatedAt, deletedAt);
  }

  public validate(): void {
    if (this.name.length < 2 || this.name.length > 30) {
      throw new Error('Invalid state name length');
    }
    if (!/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(this.color)) {
      throw new Error('Invalid color hex');
    }
  }
}
