## ADDED Requirements

### Requirement: Estructura Modular de Proyectos
Toda la lógica de UI y estado relacionada con Proyectos DEBE estar encapsulada en el módulo `src/modules/project/`.

#### Scenario: Consumo de componentes de proyecto
- **WHEN** se renderiza la lista de proyectos en la página principal
- **THEN** se DEBEN utilizar componentes importados desde `@modules/project/components/`
