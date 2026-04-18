## 1. Backend Module Setup

- [x] 1.1 Crear el archivo `src/modules/report/report.service.ts`
- [x] 1.2 Implementar lógica de recuperación de historias por `projectId`
- [x] 1.3 Implementar lógica de formateo CSV (escapado de comas y comillas)
- [x] 1.4 Exportar la clase `ReportService`

## 2. API Routes

- [x] 2.1 Instanciar `ReportService` en `src/index.ts`
- [x] 2.2 Registrar la ruta `GET /api/v1/reports/project/:projectId`
- [x] 2.3 Configurar headers de respuesta para descarga de archivo (`Content-Type: text/csv`)

## 3. Frontend Integration

- [x] 3.1 Agregar método de descarga en `src/services/apiService.ts` si es necesario o manejar vía `window.open`
- [x] 3.2 Modificar `src/components/Filters.tsx` para incluir el botón de "Exportar CSV"
- [x] 3.3 Conectar el botón con el endpoint del backend usando el `selectedProjectId`

## 4. Validation & Testing

- [x] 4.1 Verificar la generación del CSV con datos reales del backlog
- [x] 4.2 Validar que el archivo descargado se abre correctamente en herramientas como Excel o Google Sheets
