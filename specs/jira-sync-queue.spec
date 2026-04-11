# 📦 jira-sync-queue.spec

context:
  name: Jira Sync Queue
  description: Handles async synchronization with Jira

entity:
  name: JiraSyncQueue
  fields:

    id:
      type: uuid

    storyId:
      type: uuid

    action:
      type: string
      enum: [create, update]

    status:
      type: string
      enum: [pending, processing, success, failed]

    retries:
      type: number
      default: 0

    lastAttempt:
      type: datetime

relations:

  - type: belongsTo
    entity: Story
    foreignKey: storyId

rules:

  - name: Retry limit max 5
    validation: retries <= 5

use_cases:

  - name: Add to Queue
  - name: Process Queue
  - name: Retry Failed Jobs