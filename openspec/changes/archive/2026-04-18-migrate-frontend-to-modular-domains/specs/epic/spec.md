## ADDED Requirements

### Requirement: Estructura Modular de Epics
Toda la lógica de UI y estado relacionada con Epics DEBE estar encapsulada en el módulo `src/modules/epic/`.

#### Scenario: Consumo de componentes de epics
- **WHEN** se visualiza un epic en el acordeón
- **THEN** se DEBEN utilizar componentes importados desde `@modules/epic/components/`
