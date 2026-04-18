import { BaseEntity } from '../../../../core/domain/BaseEntity.js';

export class Epic extends BaseEntity {
  constructor(
    public readonly name: string,
    public readonly projectId: string,
    public readonly description?: string,
    public readonly status: string = 'active',
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date | null
  ) {
    super(id, createdAt, updatedAt, deletedAt);
  }

  public validate(): void {
    if (this.name.length < 3) {
      throw new Error('Epic name too short');
    }
    if (this.status === 'archived' && this.updatedAt) {
        // Business rule from service: Archived epics cannot be updated
        // This might be better handled in the use case or domain service
    }
  }
}
