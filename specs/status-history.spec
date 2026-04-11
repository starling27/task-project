# 📦 status-history.spec

context:
  name: Status Tracking
  description: Tracks all status changes for stories

entity:
  name: StatusHistory
  fields:

    id:
      type: uuid

    storyId:
      type: uuid

    fromStatus:
      type: string

    toStatus:
      type: string

    changedBy:
      type: string

    changedAt:
      type: datetime

relations:

  - type: belongsTo
    entity: Story
    foreignKey: storyId

rules:

  - name: Status change must be valid
    validation: exists(WorkflowState, toStatus)

use_cases:

  - name: Track Status Change
  - name: Get Story History