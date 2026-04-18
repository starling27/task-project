import { BaseEntity } from '../../../../core/domain/BaseEntity.js';

export class StatusHistory extends BaseEntity {
  constructor(
    public readonly storyId: string,
    public readonly oldStatus: string,
    public readonly newStatus: string,
    public readonly changedAt: Date = new Date(),
    id?: string
  ) {
    super(id, changedAt);
  }
}

export class AssigneeHistory extends BaseEntity {
  constructor(
    public readonly storyId: string,
    public readonly oldAssigneeId: string | null,
    public readonly newAssigneeId: string,
    public readonly assignedAt: Date = new Date(),
    id?: string
  ) {
    super(id, assignedAt);
  }
}
