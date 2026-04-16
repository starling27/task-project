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
