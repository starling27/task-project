## ADDED Requirements

### Requirement: Estructura Modular de Usuarios
Toda la lógica de gestión de usuarios y selección de asignados DEBE estar encapsulada en el módulo `src/modules/user/`.

#### Scenario: Selección de responsable
- **WHEN** se abre el selector de responsables en una historia
- **THEN** se DEBE utilizar el componente `AssigneeSelector` ubicado en `@modules/user/components/`
