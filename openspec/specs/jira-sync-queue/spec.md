# 📦 jira-sync-queue.spec

context:
  name: JiraSyncQueue
  description: Maneja la sincronización asíncrona con Jira

entity:
  name: JiraSyncQueue
  fields:

    id:
      type: uuid

    storyId:
      type: uuid

    action:
      type: string
      enum: [create, update]

    status:
      type: string
      enum: [pending, processing, success, failed]

    retries:
      type: number
      default: 0

    lastAttempt:
      type: datetime

relations:

  - type: belongsTo
    entity: Story
    foreignKey: storyId

rules:

  - name: Límite de reintentos máximo 5
    validation: retries <= 5

use_cases:

  - name: Agregar a la cola
  - name: Procesar la cola
  - name: Reintentar trabajos fallidos
## ADDED Requirements

### Requirement: Hexagonal Structure for Jira Sync Queue Module
The Jira Sync Queue module SHALL be structured into `domain`, `application`, and `infrastructure` layers.

#### Scenario: Layered architecture validation
- **WHEN** the Jira Sync Queue module is inspected
- **THEN** it MUST contain a `domain/repositories` interface and an `infrastructure/repositories` implementation using Prisma.
