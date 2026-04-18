## ADDED Requirements

### Requirement: Organización Modular de Historias
Toda la lógica de gestión de historias (Stories) DEBE residir en `src/modules/story/`.

#### Scenario: Acceso a lógica de historias
- **WHEN** se requiere editar o cambiar el estado de una historia
- **THEN** se DEBEN utilizar los componentes y hooks ubicados en `@modules/story`.
