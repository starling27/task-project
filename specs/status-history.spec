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
