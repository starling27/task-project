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
