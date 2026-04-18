## ADDED Requirements

### Requirement: Organización Modular de Epics
Toda la lógica de gestión de epics DEBE residir en `src/modules/epic/`.

#### Scenario: Acceso a lógica de epics
- **WHEN** se requiere visualizar epics en el backlog
- **THEN** se DEBEN utilizar los componentes y hooks ubicados en `@modules/epic`.
