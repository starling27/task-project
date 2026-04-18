## ADDED Requirements

### Requirement: Exportar backlog a CSV
El sistema DEBE permitir la generación de un archivo CSV con la información de las historias del backlog del proyecto seleccionado.

#### Scenario: Generación exitosa de CSV
- **WHEN** el usuario solicita el reporte de un proyecto válido
- **THEN** el sistema genera un CSV con las columnas: Título, Estado, Responsable, Puntos, Prioridad, Fecha de Vencimiento y Épica.

### Requirement: Endpoint API de Reportes
El backend DEBE exponer un endpoint `/api/v1/reports/project/:projectId` que devuelva el contenido CSV.

#### Scenario: Descarga de reporte vía API
- **WHEN** se realiza una petición GET a `/api/v1/reports/project/:projectId`
- **THEN** el sistema responde con `Content-Type: text/csv` y el contenido formateado correctamente.

### Requirement: Botón de Exportación en UI
La interfaz de usuario DEBE incluir un botón visible para iniciar la descarga del reporte del proyecto actual.

#### Scenario: Click en botón de exportación
- **WHEN** el usuario hace click en el botón "Exportar CSV"
- **THEN** el navegador inicia la descarga del archivo generado por el servidor.
