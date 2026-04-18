## ADDED Requirements

### Requirement: Organización Modular de Comentarios
Toda la lógica de hilos de comentarios DEBE residir en `src/modules/comment/`.

#### Scenario: Agregar un comentario
- **WHEN** un usuario escribe un comentario en una historia
- **THEN** se DEBE utilizar el componente `CommentSection` ubicado en `@modules/comment/components`.
