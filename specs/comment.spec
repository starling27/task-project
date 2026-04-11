# 📦 comment.spec

context:
  name: Comment Management
  description: Stores observations and collaboration messages on stories

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

  - name: Comment cannot be empty
    validation: minLength(content, 1)

  - name: Comments are immutable
    validation: noUpdate(content)

use_cases:

  - name: Add Comment
  - name: Get Comments by Story