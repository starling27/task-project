# 📦 project.spec

context:
  name: Project Management
  description: Handles creation and management of projects

entity:
  name: Project
  fields:
    id:
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
    createdAt:
      type: datetime
    updatedAt:
      type: datetime

use_cases:

  - name: Create Project
    input:
      name: string
      description: string
    output:
      project: Project

  - name: Get Projects
    output:
      projects: Project[]

  - name: Get Project By ID
    input:
      id: uuid
    output:
      project: Project

  - name: Update Project
    input:
      id: uuid
      name: string
      description: string
    output:
      project: Project

  - name: Delete Project
    input:
      id: uuid
    output:
      success: boolean

rules:

  - name: Project name must be unique
    type: business
    validation: unique(name)

  - name: Project must have valid name length
    type: validation
    validation: minLength(name, 3)

  - name: Cannot delete project with epics
    type: business
    validation: hasNoEpics(projectId)

api:

  basePath: /projects

  endpoints:

    - method: POST
      path: /
      use_case: Create Project

    - method: GET
      path: /
      use_case: Get Projects

    - method: GET
      path: /:id
      use_case: Get Project By ID

    - method: PUT
      path: /:id
      use_case: Update Project

    - method: DELETE
      path: /:id
      use_case: Delete Project

tests:

  unit:

    - name: Should create a valid project
      given:
        name: "Test Project"
      expect:
        success: true

    - name: Should fail if name is too short
      given:
        name: "ab"
      expect:
        error: "Validation error"

    - name: Should fail if name is duplicated
      given:
        name: "Existing Project"
      expect:
        error: "Project name must be unique"

  integration:

    - name: Create project and fetch it
      steps:
        - createProject
        - getProjectById
      expect:
        projectExists: true

    - name: Delete project without epics
      steps:
        - createProject
        - deleteProject
      expect:
        success: true

    - name: Prevent delete if project has epics
      steps:
        - createProject
        - createEpic
        - deleteProject
      expect:
        error: "Cannot delete project with epics"