# 📦 ui-accordion.spec

context:
  name: UI de Backlog En Acordeón
  description: Muestra todos los items del backlog en una sola vista 
  con comportamiento de acordeón expandible para edición en línea.


ui:

  layout:

    type: single-view
    description: Todas las Story se muestran en una pantalla, 
    agrupadas opcionalmente por Epic, se pueden eliminar las epic y las story

  components:

    - name: BacklogContainer
      type: container
      responsibility: contiene todas las Story en una vista con scroll

    - name: StoryAccordionItem
      type: interactive
      responsibility: muestra el resumen y el detalle expandible de una Story

    - name: StoryHeader
      type: compact-row
      fields:
        - title
        - status
        - assignee
        - priority
        - storyPoints

    - name: StoryDetailPanel
      type: expandable
      fields:
        - description
        - acceptanceCriteria
        - observations
        - assignee
        - dueDate
        - status
        - comments

---

interaction:

  accordion_behavior:

    - only_one_open: true
    - toggle_on_click: true
    - collapse_previous: true

  editing:

    mode: inline
    autosave: true
    debounce: 500ms

  state_management:

    - optimistic_updates: true
    - rollback_on_error: true

---

features:

  - name: Update Story Status
    interaction: dropdown
    source: story.status

  - name: Assign User
    interaction: selector
    source: team.members

  - name: Add Observations
    interaction: textarea
    autosave: true

  - name: Edit Acceptance Criteria
    interaction: code-editor
    format: gherkin

  - name: Inline Title Editing
    interaction: text-edit

---

grouping:

  options:

    - by_epic
    - flat_list

  default: by_epic

---

filters:

  - status
  - assignee
  - priority

---

performance:

  - virtual_scroll: true
  - lazy_render: true

---

rules:

  - name: Only one accordion open at a time
    type: UX
    validation: singleExpanded

  - name: Changes must be auto-saved
    type: UX
    validation: autosaveEnabled

  - name: Status changes must reflect immediately
    type: system
    validation: optimisticUI

   - name: Se debe poder cambiar entre epic para poder seleccionar donde se creara la new story
   type: system

   - name: Se debe porder eliminar stories, tener un botón que consuma el endpoint de eliminación
   type: system

   - name: Se debe porder eliminar epic, tener un botón que consuma el endpoint de eliminación
   type: system

   - name: Se debe porder eliminar Proyect, tener un botón que consuma el endpoint de eliminación
   type: system

   - name: Se debe porder crear User
   type: system

   - name: Se debe porder eliminar user, tener un botón que consuma el endpoint de eliminación
   type: system


---

api_bindings:

  - component: StoryAccordionItem
    endpoints:
      - GET /stories
      - PUT /stories/:id

  - component: AssigneeSelector
    endpoints:
      - GET /users

---

tests:

  unit:

    - name: Debe abrir el acordeón al hacer click
      action: clickItem
      expect:
        expanded: true

    - name: Debe cerrar el acordeón anterior
      action: openAnotherItem
      expect:
        previousClosed: true

    - name: Debe actualizar el status en línea
      action: changeStatus
      expect:
        updated: true

  integration:

    - name: Editar story en línea y persistir
      steps:
        - openAccordion
        - editTitle
        - save
      expect:
        persisted: true

    - name: Asignar usuario y reflejar inmediatamente
      steps:
        - openAccordion
        - assignUser
      expect:
        uiUpdated: true

    - name: Auto-guardado de observaciones
      steps:
        - openAccordion
        - typeObservation
        - wait
      expect:
        saved: true
