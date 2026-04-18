## ADDED Requirements

### Requirement: Estructura Modular de Comentarios
La sección de comentarios y su persistencia DEBEN estar encapsuladas en el módulo `src/modules/comment/`.

#### Scenario: Visualización de hilos de comentarios
- **WHEN** se carga una historia con comentarios
- **THEN** se DEBE renderizar el componente `CommentSection` ubicado en `@modules/comment/components/`
