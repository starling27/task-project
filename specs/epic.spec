# 📦 epic.spec

context:
  name: Epic Management
  description: Handles epics within a project

entity:
  name: Epic
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
    description:
      type: string
      required: false
      maxLength: 500
    status:
      type: string
      enum: [draft, active, archived]
      default: draft
    createdAt:
      type: datetime
    updatedAt:
      type: datetime

relations:

  - type: belongsTo
    entity: Project
    foreignKey: projectId

use_cases:

  - name: Create Epic
    input:
      projectId: uuid
      name: string
      description: string
    output:
      epic: Epic

  - name: Get Epics by Project
    input:
      projectId: uuid
    output:
      epics: Epic[]

  - name: Get Epic By ID
    input:
      id: uuid
    output:
      epic: Epic

  - name: Update Epic
    input:
      id: uuid
      name: string
      description: string
      status: string
    output:
      epic: Epic

  - name: Delete Epic
    input:
      id: uuid
    output:
      success: boolean

rules:

  - name: Epic must belong to an existing project
    type: business
    validation: exists(Project, projectId)

  - name: Epic name must be unique within a project
    type: business
    validation: uniqueWithin(projectId, name)

  - name: Cannot delete epic with stories
    type: business
    validation: hasNoStories(epicId)

  - name: Archived epics cannot be updated
    type: business
    validation: notArchived(epicId)

api:

  basePath: /epics

  endpoints:

    - method: POST
      path: /
      use_case: Create Epic

    - method: GET
      path: /project/:projectId
      use_case: Get Epics by Project

    - method: GET
      path: /:id
      use_case: Get Epic By ID

    - method: PUT
      path: /:id
      use_case: Update Epic

    - method: DELETE
      path: /:id
      use_case: Delete Epic

tests:

  unit:

    - name: Should create epic with valid project
      given:
        projectId: valid-project-id
        name: "User Management"
      expect:
        success: true

    - name: Should fail if project does not exist
      given:
        projectId: invalid-id
      expect:
        error: "Project does not exist"

    - name: Should fail if name is duplicated in same project
      given:
        name: "Existing Epic"
      expect:
        error: "Epic name must be unique within project"

    - name: Should prevent update if epic is archived
      given:
        status: archived
      expect:
        error: "Archived epics cannot be updated"

  integration:

    - name: Create epic inside project and fetch it
      steps:
        - createProject
        - createEpic
        - getEpicById
      expect:
        epicExists: true

    - name: Prevent deleting epic with stories
      steps:
        - createProject
        - createEpic
        - createStory
        - deleteEpic
      expect:
        error: "Cannot delete epic with stories"

    - name: Get epics by project
      steps:
        - createProject
        - createEpic
        - getEpicsByProject
      expect:
        epicsCount: 1