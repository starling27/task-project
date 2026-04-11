# 📦 specs/workflow.spec

context:
  name: Workflow Configuration
  description: Gestión dinámica de estados y transiciones por proyecto

entity:
  name: WorkflowState
  fields:
    id:
      type: uuid
    projectId:
      type: uuid
      required: true # Vincula el estado a un proyecto específico
    name:
      type: string
      required: true
      minLength: 2
      maxLength: 30
    color:
      type: string
      description: Código hex para la UI
    order:
      type: number
      description: Posición en el acordeón de la UI
    isDefault:
      type: boolean
      default: false

relations:
  - type: belongsTo
    entity: Project
    foreignKey: projectId

rules:
  - name: Unique state name per project
    validation: unique(name, projectId)
  - name: Minimum one state per project
    validation: min_count(1, projectId)

api:
  basePath: /projects/:projectId/workflow
  endpoints:
    - method: GET
      path: /
      use_case: Listar estados del proyecto
    - method: POST
      path: /
      use_case: Agregar estado al proyecto
    - method: PUT
      path: /:id
      use_case: Actualizar configuración de estado
    - method: DELETE
      path: /:id
      use_case: Eliminar estado (solo si no tiene historias vinculadas)