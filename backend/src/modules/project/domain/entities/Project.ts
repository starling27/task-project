import { BaseEntity } from '../../../../core/domain/BaseEntity.js';

export class Project extends BaseEntity {
  constructor(
    public readonly name: string,
    public readonly description?: string,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date | null
  ) {
    super(id, createdAt, updatedAt, deletedAt);
  }

  public validate(): void {
    if (this.name.length < 3) {
      throw new Error('Project name too short');
    }
  }
}

export const DEFAULT_WORKFLOW_STATES = [
  { name: 'unassigned', isInitial: true, isFinal: false, isDefault: true, order: 0, color: '#94a3b8' },
  { name: 'assigned', isInitial: false, isFinal: false, isDefault: false, order: 1, color: '#6366f1' },
  { name: 'in_progress', isInitial: false, isFinal: false, isDefault: false, order: 2, color: '#f59e0b' },
  { name: 'done', isInitial: false, isFinal: true, isDefault: false, order: 3, color: '#10b981' }
];
