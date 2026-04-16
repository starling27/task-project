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
