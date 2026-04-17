# 📦 ui-tailwind-enhancement.spec

context:
  name: Mejora de UI con Tailwind
  description: Mejora la UI del backlog usando TailwindCSS con patrones 
  modernos de UX (acordeón, edición en línea, jerarquía visual)

---

objectives:

  - Mejorar la jerarquía visual
  - Mejorar la legibilidad
  - Dar mejor feedback de interacción
  - Modernizar la UI con TailwindCSS
  - Mantener el comportamiento de acordeón en vista única

---

ui_layout:

  structure:

    - Sidebar (Projects)
    - Header (Project + Filters)
    - Backlog View (Epics + Stories)

  layout_type: flex

  responsive: true

---

components:

  Sidebar:

    styles:
      - w-64
      - bg-gray-900
      - text-white
      - p-4
      - border-r

    features:
      - lista de proyectos
      - resaltado del proyecto activo
      - efectos hover

---

  Header:

    styles:
      - flex
      - justify-between
      - items-center
      - px-6
      - py-4
      - border-b
      - bg-white

    elements:
      - título del proyecto
      - filtros (por epic)
      - botón de crear story

---

  EpicContainer:

    styles:
      - bg-gray-100
      - rounded-lg
      - p-4
      - mb-4
      - shadow-sm

    title_styles:
      - text-lg
      - font-semibold
      - text-gray-800

---

  StoryItem:

    collapsed_view:

      styles:
        - flex
        - justify-between
        - items-center
        - bg-white
        - border
        - rounded-lg
        - px-4
        - py-3
        - mb-2
        - cursor-pointer
        - hover:bg-gray-50
        - transition

    expanded_view:

      styles:
        - bg-white
        - border
        - rounded-lg
        - p-4
        - shadow-md

---

  StatusBadge:

    styles:
      - text-xs
      - font-medium
      - px-2
      - py-1
      - rounded-full

    variants:

      unassigned:
        - bg-gray-200
        - text-gray-700

      in_progress:
        - bg-blue-100
        - text-blue-700

      blocked:
        - bg-red-100
        - text-red-700

      in_pr_review:
        - bg-yellow-100
        - text-yellow-700

      integrated:
        - bg-green-100
        - text-green-700

---

  AssigneeAvatar:

    styles:
      - w-8
      - h-8
      - rounded-full
      - bg-indigo-500
      - text-white
      - flex
      - items-center
      - justify-center
      - text-sm
      - font-bold

---

  StoryDetails:

    layout:
      - grid
      - grid-cols-2
      - gap-4

    sections:

      - description
      - acceptanceCriteria
      - comments
      - history

---

interaction:

  accordion:

    behavior:
      - only_one_open: true
      - smooth_transition: true
      - duration: 200ms

  hover_effects:

    - resaltar_fila
    - mostrar_acciones

  inline_editing:

    enabled: true
    trigger: click
    save: debounce_500ms

---

visual_improvements:

  spacing:
    - padding consistente (p-4, p-6)
    - margen entre items (mb-2, mb-4)

  typography:
    - títulos: text-lg font-semibold
    - contenido: text-sm text-gray-600

  colors:
    - primary: indigo
    - neutral: gray scale
    - status-based colors

---

ux_enhancements:

  - resaltar story activa
  - skeletons de carga
  - estados vacíos
  - notificaciones tipo toast al guardar
  - feedback de error en línea

---

performance:

  - virtual_scroll: recomendado
  - memoization: requerido
  - lazy_render_details: true

---

api_bindings:

  - GET /stories
  - PUT /stories/:id
  - GET /comments
  - POST /comments
  - GET /workflow

---

tests:

  unit:

    - name: Debe renderizar StoryItem colapsado
      expect:
        visible: true

    - name: El acordeón debe expandir al hacer click
      expect:
        expanded: true

    - name: El color del StatusBadge debe coincidir con el status
      expect:
        colorApplied: true

  integration:

    - name: Editar story en línea
      steps:
        - clickStory
        - editTitle
        - save
      expect:
        updated: true

    - name: Cambiar status actualiza la UI
      steps:
        - changeStatus
      expect:
        badgeUpdated: true
