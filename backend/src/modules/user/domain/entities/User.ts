import { BaseEntity } from '../../../../core/domain/BaseEntity.js';

export class User extends BaseEntity {
  constructor(
    public readonly email: string,
    public readonly name: string,
    public readonly role: string = 'member',
    public readonly provider?: string,
    public readonly providerId?: string,
    public readonly avatarUrl?: string,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date | null
  ) {
    super(id, createdAt, updatedAt, deletedAt);
  }

  public validate(): void {
    if (!this.email.includes('@')) {
      throw new Error('Invalid email');
    }
  }
}
