import { BaseEntity } from '../../../../core/domain/BaseEntity.js';

export class Comment extends BaseEntity {
  constructor(
    public readonly content: string,
    public readonly author: string,
    public readonly storyId: string,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date | null
  ) {
    super(id, createdAt, updatedAt, deletedAt);
  }

  public validate(): void {
    if (!this.content || this.content.trim().length === 0) {
      throw new Error('Comment content cannot be empty');
    }
  }
}
