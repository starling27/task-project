# 📦 sprint.spec

context:
  name: Sprint Management
  description: Logical grouping of stories without capacity or strict time constraints

entity:
  name: Sprint
  fields:
    id:
      type: uuid
      required: true

    projectId:
      type: uuid
      required: true

    name:
      type: string
      required: true
      minLength: 3
      maxLength: 100

    goal:
      type: string
      required: false
      maxLength: 500

    status:
      type: string
      enum: [planned, active, closed]
      default: planned

    createdAt:
      type: datetime

    updatedAt:
      type: datetime

relations:

  - type: belongsTo
    entity: Project
    foreignKey: projectId

  - type: hasMany
    entity: Story
    foreignKey: sprintId

use_cases:

  - name: Create Sprint
    input:
      projectId: uuid
      name: string
      goal: string
    output:
      sprint: Sprint

  - name: Get Sprints by Project
    input:
      projectId: uuid
    output:
      sprints: Sprint[]

  - name: Update Sprint
    input:
      id: uuid
      name: string
      goal: string
      status: string
    output:
      sprint: Sprint

  - name: Delete Sprint
    input:
      id: uuid
    output:
      success: boolean

rules:

  - name: Sprint must belong to an existing project
    type: business
    validation: exists(Project, projectId)

  - name: Sprint name must be unique within a project
    type: business
    validation: uniqueWithin(projectId, name)

  - name: Cannot delete active sprint
    type: business
    validation: status != 'active'

  - name: Cannot close sprint with active stories
    type: business
    validation: allStoriesCompleted(sprintId)

api:

  basePath: /sprints

  endpoints:

    - method: POST
      path: /
      use_case: Create Sprint

    - method: GET
      path: /project/:projectId
      use_case: Get Sprints by Project

    - method: PUT
      path: /:id
      use_case: Update Sprint

    - method: DELETE
      path: /:id
      use_case: Delete Sprint

tests:

  unit:

    - name: Should create sprint
      given:
        name: "Sprint 1"
      expect:
        success: true

    - name: Should fail if duplicate name in project
      given:
        name: "Existing Sprint"
      expect:
        error: "Sprint name must be unique"

    - name: Should prevent deleting active sprint
      given:
        status: active
      expect:
        error: "Cannot delete active sprint"

  integration:

    - name: Create sprint and assign stories
      steps:
        - createProject
        - createSprint
        - createEpic
        - createStory
        - assignStoryToSprint
      expect:
        assigned: true

    - name: Prevent closing sprint with active stories
      steps:
        - createSprint
        - createStory
        - closeSprint
      expect:
        error: "Stories still active"