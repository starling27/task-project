## ADDED Requirements

### Requirement: Estructura Modular de Dominios
El frontend DEBE organizar su código en módulos de dominio dentro de `src/modules/`. Cada módulo DEBE contener sus propios componentes, hooks, servicios y tipos.

#### Scenario: Validación de estructura de un módulo
- **WHEN** se crea un nuevo dominio functional
- **THEN** el sistema DEBE tener un directorio dedicado en `src/modules/` con subdirectorios para `components`, `hooks`, `services` y `types`.

### Requirement: Centralización de UI Genérica
Los componentes visuales que no tienen lógica de dominio DEBEN residir en `src/shared/ui/` para garantizar su reutilización.

#### Scenario: Uso de componente compartido
- **WHEN** un módulo de dominio necesita un botón o un dropdown genérico
- **THEN** DEBE importarlo desde la capa `@shared/ui`.

### Requirement: Aislamiento de Módulos
Un módulo de dominio NO DEBE depender directamente de la implementación interna de otro módulo de dominio. La comunicación entre módulos DEBE realizarse a través del store global o mediante props pasadas por componentes de página.

#### Scenario: Intercambio de datos entre Project y Story
- **WHEN** el módulo de Story necesita información del proyecto seleccionado
- **THEN** DEBE obtenerla del store global (`@core/store`) y no importando servicios directos del módulo de Project.
