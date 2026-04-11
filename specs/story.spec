# 📦 story.spec (refactored)

context:
  name: Story Management
  description: Core entity representing a unit of work, decoupled from workflow, comments, and integration

entity:
  name: Story
  fields:

    id:
      type: uuid

    epicId:
      type: uuid
      required: true

    title:
      type: string
      required: true
      minLength: 5
      maxLength: 150

    description:
      type: string
      required: true

    storyPoints:
      type: number
      enum: [1,2,3,5,8,13]

    priority:
      type: string
      enum: [low, medium, high, critical]

    type:
      type: string
      enum: [story, bug, task]

    status:
      type: string
      required: true

    sprintId:
      type: uuid
      required: false

    assigneeId:
      type: uuid
      required: false

    acceptanceCriteria:
      type: string
      required: false

    observations:
      type: string
      required: false

    dueDate:
      type: datetime
      required: false

    jiraIssueKey:
      type: string
      required: false

    createdAt:
      type: datetime

    updatedAt:
      type: datetime

relations:

  - type: belongsTo
    entity: Epic
    foreignKey: epicId

  - type: belongsTo
    entity: User
    foreignKey: assigneeId

  - type: hasMany
    entity: Comment

  - type: hasMany
    entity: StatusHistory

  - type: hasMany
    entity: AssigneeHistory

rules:

  - name: Status must exist in workflow
    validation: exists(WorkflowState, status)

  - name: Story must belong to an epic
    validation: exists(Epic, epicId)

  - name: Story must have valid story points
    validation: required(storyPoints)

api:

  basePath: /stories

  endpoints:

    - method: POST
      path: /
      use_case: Create Story

    - method: GET
      path: /
      use_case: Get Stories

    - method: GET
      path: /:id
      use_case: Get Story By ID

    - method: PUT
      path: /:id
      use_case: Update Story

    - method: PATCH
      path: /:id/status
      use_case: Change Status

    - method: PATCH
      path: /:id/assign
      use_case: Assign User

    - method: DELETE
      path: /:id
      use_case: Delete Story

---

use_cases:

  - name: Create Story
  - name: Update Story
  - name: Change Status
  - name: Assign User
  - name: Add Comment
  - name: Assign to Sprint