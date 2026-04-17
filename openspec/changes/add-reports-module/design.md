## Context

El sistema actual gestiona datos de backlog en una base de datos SQLite. Los usuarios necesitan exportar estos datos para reportes externos. No existe una capa de reportes dedicada.

## Goals / Non-Goals

**Goals:**
- Proveer un endpoint que retorne un CSV con los datos del proyecto seleccionado.
- Implementar un servicio desacoplado para la lógica de reporteo.
- Agregar un botón interactivo en el frontend para disparar la descarga.

**Non-Goals:**
- Generación de reportes PDF o Excel (solo CSV).
- Envío de reportes por email.
- Filtros avanzados en el servidor (se exportará el backlog del proyecto seleccionado).

## Decisions

- **Arquitectura**: Crear un nuevo módulo `src/modules/report/` con `report.service.ts` para mantener la separación de responsabilidades.
- **Generación de CSV**: Se optará por una implementación manual de formateo de strings CSV para minimizar dependencias externas, asegurando el correcto escapado de caracteres especiales.
- **API**: Se registrará la ruta `GET /api/v1/reports/project/:projectId` en `src/index.ts`.
- **Frontend**: Se agregará el botón de exportación en el componente `Filters.tsx` para que esté contextualizado con la vista de backlog, utilizando el `selectedProjectId` del store.

## Risks / Trade-offs

- **[Riesgo] Performance**: Grandes cantidades de historias podrían bloquear el event loop.
- **[Mitigación]**: Dado que es SQLite y un sistema interno, el volumen inicial es manejable. Si crece, se migrará a un stream de lectura de base de datos.
- **[Trade-off]**: El reporte es estático (todo el backlog) y no respeta los filtros aplicados en el frontend (Zustand side). Se asume aceptable para la primera versión.
