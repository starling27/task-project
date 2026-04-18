# 📦 epic.spec

context:
  name: Gestión de Epic
  description: Maneja los Epic dentro de un Project

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
    deletedAt:
      type: datetime

relations:

  - type: belongsTo
    entity: Project
    foreignKey: projectId

use_cases:

  - name: Crear Epic
    input:
      projectId: uuid
      name: string
      description: string
    output:
      epic: Epic

  - name: Obtener Epic por Project
    input:
      projectId: uuid
    output:
      epics: Epic[]

  - name: Obtener Epic Por ID
    input:
      id: uuid
    output:
      epic: Epic

  - name: Actualizar Epic
    input:
      id: uuid
      name: string
      description: string
      status: string
    output:
      epic: Epic

  - name: Eliminar Epic
    input:
      id: uuid
    output:
      success: boolean

rules:

  - name: Epic debe pertenecer a un Project existente
    type: business
    validation: exists(Project, projectId)

  - name: El nombre de Epic debe ser único dentro de un Project
    type: business
    validation: uniqueWithin(projectId, name)

  - name: Los Epic archivados no se pueden actualizar
    type: business
    validation: notArchived(epicId)


api:

  basePath: /epics

  endpoints:

    - method: POST
      path: /
      use_case: Crear Epic

    - method: GET
      path: /project/:projectId
      use_case: Obtener Epic por Project

    - method: GET
      path: /:id
      use_case: Obtener Epic Por ID

    - method: PUT
      path: /:id
      use_case: Actualizar Epic

    - method: DELETE
      path: /:id
      use_case: Eliminar Epic

tests:

  unit:

    - name: Debe crear un epic con project válido
      given:
        projectId: valid-project-id
        name: "User Management"
      expect:
        success: true

    - name: Debe fallar si el project no existe
      given:
        projectId: invalid-id
      expect:
        error: "Project does not exist"

    - name: Debe fallar si el nombre está duplicado en el mismo project
      given:
        name: "Existing Epic"
      expect:
        error: "Epic name must be unique within project"

    - name: Debe impedir actualizar si el epic está archivado
      given:
        status: archived
      expect:
        error: "Archived epics cannot be updated"

  integration:

    - name: Crear epic dentro de project y consultarlo
      steps:
        - createProject
        - createEpic
        - getEpicById
      expect:
        epicExists: true

    - name: Obtener epics por project
      steps:
        - createProject
        - createEpic
        - getEpicsByProject
      expect:
        epicsCount: 1

    - name: Eliminar epic con historias (cascada)
      steps:
        - createProject
        - createEpic
        - createStory
        - deleteEpic
      expect:
        success: true
## ADDED Requirements

### Requirement: Hexagonal Structure for Epic Module
The Epic module SHALL be structured into `domain`, `application`, and `infrastructure` layers.

#### Scenario: Layered architecture validation
- **WHEN** the Epic module is inspected
- **THEN** it MUST contain a `domain/repositories` interface and an `infrastructure/repositories` implementation using Prisma.

### Requirement: Epic Use Cases
All Epic operations (Create, Read, Update, Delete) SHALL be implemented as discrete Use Case classes in the `application` layer.

#### Scenario: Use case isolation
- **WHEN** an Epic is created
- **THEN** the `CreateEpicUseCase` SHALL be executed, depending only on the `EpicRepository` interface.
