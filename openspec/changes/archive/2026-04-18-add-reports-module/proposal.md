## Why

Actualmente el sistema permite la gestión de tareas, epics y proyectos, pero carece de una funcionalidad de reportes que permita a los usuarios exportar la información del backlog para análisis externo o presentación de estados. La capacidad de generar archivos CSV facilitará la portabilidad de los datos y la toma de decisiones basada en el estado actual del proyecto.

## What Changes

- Implementación de un nuevo servicio de reportes en el backend.
- Creación de un endpoint API para solicitar la generación y descarga de reportes CSV.
- Integración de una opción de exportación en la interfaz de usuario del Backlog.
- Soporte para exportar: Título de la tarea, responsable (assignee), fechas (creación, vencimiento) y estado actual.

## Capabilities

### New Capabilities
- `reports-module`: Capacidad de filtrar, generar y descargar reportes del backlog en formato CSV.

### Modified Capabilities
- (none)

## Impact

- **Backend**: Nuevo módulo de servicio y rutas API `/api/v1/reports`.
- **Frontend**: Nuevo componente de botón de exportación y lógica de descarga en el `useBacklogStore`.
- **Dependencies**: Librería para generación de CSV (e.g., `json2csv` o formateo manual de strings).
