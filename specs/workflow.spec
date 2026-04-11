# 📦 workflow.spec

context:
  name: Workflow Management
  description: Defines allowed states and transitions for stories

entity:
  name: WorkflowState
  fields:
    id:
      type: uuid
    projectId: # <--- Relación clave para dinamismo por proyecto
      type: uuid
      required: true
    name:
      type: string
      required: true
    order:
      type: number
  name: WorkflowState
  fields:

    id:
      type: uuid

    name:
      type: string
      required: true

    order:
      type: number

    color:
      type: string

    isFinal:
      type: boolean
      default: false

relations: []

rules:

  - name: Workflow state name must be unique
    validation: unique(name)

use_cases:

  - name: Create Workflow State
  - name: Update Workflow State
  - name: Get Workflow