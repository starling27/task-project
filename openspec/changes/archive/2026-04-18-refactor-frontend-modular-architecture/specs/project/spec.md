## ADDED Requirements

### Requirement: Organización Modular de Proyectos
Toda la lógica de gestión de proyectos DEBE residir en `src/modules/project/`.

#### Scenario: Acceso a lógica de proyectos
- **WHEN** se requiere crear o listar proyectos
- **THEN** se DEBEN utilizar los componentes y hooks ubicados en `@modules/project`.
