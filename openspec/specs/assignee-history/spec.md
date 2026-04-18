# 📦 assignee-history.spec

context:
  name: Tracking de Assignee
  description: Registra cambios de asignación para Story

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

  - name: Assignee debe ser un User válido
    validation: exists(User, assignedTo)

use_cases:

  - name: Asignar User
  - name: Obtener historial de asignaciones
## ADDED Requirements

### Requirement: Hexagonal Structure for Assignee History Module
The Assignee History module SHALL be structured into `domain`, `application`, and `infrastructure` layers.

#### Scenario: Layered architecture validation
- **WHEN** the Assignee History module is inspected
- **THEN** it MUST contain a `domain/repositories` interface and an `infrastructure/repositories` implementation using Prisma.
