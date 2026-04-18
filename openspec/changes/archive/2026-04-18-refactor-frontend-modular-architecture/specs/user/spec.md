## ADDED Requirements

### Requirement: Organización Modular de Usuarios
Toda la lógica de gestión de usuarios y selección de responsables DEBE residir en `src/modules/user/`.

#### Scenario: Selección de responsable
- **WHEN** se asigna una historia a un usuario
- **THEN** se DEBE utilizar el componente `AssigneeSelector` ubicado en `@modules/user/components`.
