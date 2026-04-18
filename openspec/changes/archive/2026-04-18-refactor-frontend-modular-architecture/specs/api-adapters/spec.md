## ADDED Requirements

### Requirement: Capa de Adaptación de Datos
Todos los servicios de comunicación con el backend DEBEN actuar como adaptadores que transformen las respuestas de la API en modelos de dominio de frontend.

#### Scenario: Consumo de Historias desde la API
- **WHEN** el servicio de Story solicita datos al backend
- **THEN** DEBE mapear la respuesta JSON cruda a una interfaz `Story` definida localmente en el módulo.

### Requirement: Independencia del Cliente HTTP
La lógica de red DEBE estar centralizada en un cliente base en `@core/api`, permitiendo que los módulos solo invoquen métodos abstractos (get, post, patch, delete).

#### Scenario: Cambio de URL base de la API
- **WHEN** el backend cambia de ubicación o se divide en microservicios
- **THEN** solo se DEBE modificar la configuración en `@core/api` y no en los servicios individuales de los módulos.
