# 📦 assignee-history.spec

context:
  name: Assignee Tracking
  description: Tracks assignment changes for stories

entity:
  name: AssigneeHistory
  fields:

    id:
      type: uuid

    storyId:
      type: uuid

    assignedTo:
      type: string

    assignedBy:
      type: string

    assignedAt:
      type: datetime

relations:

  - type: belongsTo
    entity: Story
    foreignKey: storyId

rules:

  - name: Assignee must be valid user
    validation: exists(User, assignedTo)

use_cases:

  - name: Assign User
  - name: Get Assignment History