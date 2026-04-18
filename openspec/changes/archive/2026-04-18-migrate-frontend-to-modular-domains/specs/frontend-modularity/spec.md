## ADDED Requirements

### Requirement: Estructura Estándar de Módulos
Todos los módulos de dominio ubicados en `src/modules/` DEBEN seguir una estructura interna predefinida para garantizar la consistencia en el proyecto.

#### Scenario: Validación de estructura de módulo
- **WHEN** se inspecciona la carpeta de un módulo (ej: `src/modules/project/`)
- **THEN** el sistema DEBE contener subcarpetas para `components/`, `hooks/`, `services/` y `types/`

### Requirement: Aislamiento de Lógica de Dominio
La lógica de negocio específica de un dominio DEBE residir exclusivamente dentro de su módulo correspondiente.

#### Scenario: Referencia a servicios de dominio
- **WHEN** el módulo `story` requiere comunicación con la API de historias
- **THEN** DEBE utilizar el servicio definido en `src/modules/story/services/story.service.ts`

### Requirement: Reutilización de Componentes Compartidos
Los componentes de UI que no poseen lógica de dominio DEBEN centralizarse en `src/shared/ui/` para evitar duplicidad.

#### Scenario: Implementación de un elemento visual común
- **WHEN** se necesita un componente de "Badge" en múltiples módulos
- **THEN** este DEBE implementarse en `src/shared/ui/Badge.tsx` y ser importado por los módulos
