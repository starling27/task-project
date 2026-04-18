# 📦 comment.spec

context:
  name: Gestión de Comment
  description: Almacena observaciones y mensajes de colaboración sobre Story

entity:
  name: Comment
  fields:

    id:
      type: uuid

    storyId:
      type: uuid
      required: true

    content:
      type: string
      required: true
      maxLength: 1000

    author:
      type: string
      required: true

    createdAt:
      type: datetime

relations:

  - type: belongsTo
    entity: Story
    foreignKey: storyId

rules:

  - name: Comment no puede estar vacío
    validation: minLength(content, 1)

  - name: Los Comment son inmutables
    validation: noUpdate(content)

use_cases:

  - name: Agregar Comment
  - name: Obtener Comment por Story
## ADDED Requirements

### Requirement: Hexagonal Structure for Comment Module
The Comment module SHALL be structured into `domain`, `application`, and `infrastructure` layers.

#### Scenario: Layered architecture validation
- **WHEN** the Comment module is inspected
- **THEN** it MUST contain a `domain/repositories` interface and an `infrastructure/repositories` implementation using Prisma.
