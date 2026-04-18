# 📦 status-history.spec

context:
  name: Tracking de Status
  description: Registra todos los cambios de status para Story

entity:
  name: StatusHistory
  fields:

    id:
      type: uuid

    storyId:
      type: uuid

    fromStatus:
      type: string

    toStatus:
      type: string

    changedBy:
      type: string

    changedAt:
      type: datetime

relations:

  - type: belongsTo
    entity: Story
    foreignKey: storyId

rules:

  - name: El cambio de status debe ser válido
    validation: exists(WorkflowState, toStatus)

use_cases:

  - name: Registrar cambio de status
  - name: Obtener historial de Story
## ADDED Requirements

### Requirement: Hexagonal Structure for Status History Module
The Status History module SHALL be structured into `domain`, `application`, and `infrastructure` layers.

#### Scenario: Layered architecture validation
- **WHEN** the Status History module is inspected
- **THEN** it MUST contain a `domain/repositories` interface and an `infrastructure/repositories` implementation using Prisma.
