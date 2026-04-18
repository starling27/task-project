# 📦 story.spec (refactored)

context:
  name: Gestión de Story
  description: Entidad core que representa una unidad de trabajo, 
  desacoplada de workflow, comentarios e integración

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

    deletedAt:
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

  - name: El status debe existir en WorkflowState
    validation: exists(WorkflowState, status)

  - name: Story debe pertenecer a un Epic
    validation: exists(Epic, epicId)

  - name: Story debe tener storyPoints válidos
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
## ADDED Requirements

### Requirement: Hexagonal Structure for Story Module
The Story module SHALL be structured into `domain`, `application`, and `infrastructure` layers.

#### Scenario: Layered architecture validation
- **WHEN** the Story module is inspected
- **THEN** it MUST contain a `domain/repositories` interface and an `infrastructure/repositories` implementation using Prisma.

### Requirement: Story Use Cases
All Story operations (Create, Read, Update, Delete, Change Status, Assign User) SHALL be implemented as discrete Use Case classes in the `application` layer.

#### Scenario: Use case isolation
- **WHEN** a Story status is changed
- **THEN** the `ChangeStoryStatusUseCase` SHALL be executed, depending only on the `StoryRepository` interface.
