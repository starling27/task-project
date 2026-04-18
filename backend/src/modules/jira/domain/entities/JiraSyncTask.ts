import { BaseEntity } from '../../../../core/domain/BaseEntity.js';

export class JiraSyncTask extends BaseEntity {
  constructor(
    public readonly storyId: string,
    public readonly action: string,
    public readonly status: string = 'pending',
    public readonly retries: number = 0,
    public readonly error?: string,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id, createdAt, updatedAt);
  }
}
