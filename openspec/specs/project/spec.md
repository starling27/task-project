# 📦 project.spec

context:
  name: Gestión de Project
  description: Maneja la creación y administración de Project, los proyectos se deben poder
  eliminar y al eliminarse deben eliminar todas las epic e story asociadas al proyecto

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
    deletedAt:
      type: datetime

use_cases:

  - name: Crear Project
    input:
      name: string
      description: string
    output:
      project: Project

  - name: Obtener Projects
    output:
      projects: Project[]

  - name: Obtener Project Por ID
    input:
      id: uuid
    output:
      project: Project

  - name: Actualizar Project
    input:
      id: uuid
      name: string
      description: string
    output:
      project: Project

  - name: Eliminar Project
    input:
      id: uuid
    output:
      success: boolean

rules:

  - name: El nombre de Project debe ser único
    type: business
    validation: unique(name)

  - name: Project debe tener una longitud de nombre válida
    type: validation
    validation: minLength(name, 3)



api:

  basePath: /projects

  endpoints:

    - method: POST
      path: /
      use_case: Crear Project

    - method: GET
      path: /
      use_case: Obtener Projects

    - method: GET
      path: /:id
      use_case: Obtener Project Por ID

    - method: PUT
      path: /:id
      use_case: Actualizar Project

    - method: DELETE
      path: /:id
      use_case: Eliminar Project

tests:

  unit:

    - name: Debe crear un project válido
      given:
        name: "Test Project"
      expect:
        success: true

    - name: Debe fallar si el nombre es demasiado corto
      given:
        name: "ab"
      expect:
        error: "Validation error"

    - name: Debe fallar si el nombre está duplicado
      given:
        name: "Existing Project"
      expect:
        error: "Project name must be unique"

  integration:

    - name: Crear project y consultarlo
      steps:
        - createProject
        - getProjectById
      expect:
        projectExists: true

    - name: Eliminar project sin epics
      steps:
        - createProject
        - deleteProject
      expect:
        success: true

    - name: Eliminar project con epics (cascada)
      steps:
        - createProject
        - createEpic
        - deleteProject
      expect:
        success: true
## ADDED Requirements

### Requirement: Hexagonal Structure for Project Module
The Project module SHALL be structured into `domain`, `application`, and `infrastructure` layers.

#### Scenario: Layered architecture validation
- **WHEN** the Project module is inspected
- **THEN** it MUST contain a `domain/repositories` interface and an `infrastructure/repositories` implementation using Prisma.

### Requirement: Project Use Cases
All Project operations (Create, Read, Update, Delete) SHALL be implemented as discrete Use Case classes in the `application` layer.

#### Scenario: Use case isolation
- **WHEN** a Project is created
- **THEN** the `CreateProjectUseCase` SHALL be executed, depending only on the `ProjectRepository` interface.
