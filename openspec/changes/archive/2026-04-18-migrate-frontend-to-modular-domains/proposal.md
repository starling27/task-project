## Why

La estructura actual del frontend en `src/` mezcla componentes, hooks, servicios y stores de manera global. A medida que el proyecto escala, esta falta de límites claros entre dominios (Project, Epic, Story, User, etc.) dificulta el mantenimiento, la testabilidad y la escalabilidad. Migrar a una arquitectura modular basada en dominios permitirá encapsular la lógica de negocio, facilitar la reutilización de componentes y mejorar la navegación del código, alineándose con las convenciones de diseño modular (DDD) ya presentes en el backend.

## What Changes

- **BREAKING**: Reestructuración completa de la carpeta `src/` para agrupar archivos por dominios funcionales.
- **BREAKING**: Reubicación de componentes genéricos (UI) a un módulo compartido (`shared/ui`).
- Creación de módulos de dominio: `auth`, `project`, `epic`, `story`, `user`, `comment`. Cada módulo contendrá sus propios componentes, hooks, tipos y servicios.
- Centralización del estado global: Refactorización de `useBacklogStore` para delegar responsabilidades a stores modulares o sub-estados si es necesario.
- Actualización de importaciones: Ajuste de todas las referencias de archivos en el frontend para apuntar a las nuevas ubicaciones.
- Actualización de tests: Adaptación de los tests existentes para validar que la funcionalidad se mantiene tras la reestructuración.

## Capabilities

### New Capabilities
- `frontend-modularity`: Establece el estándar para la organización de archivos y la comunicación entre módulos en el frontend.

### Modified Capabilities
- `project`: Organización modular de la lógica y UI de proyectos.
- `epic`: Organización modular de la lógica y UI de epics.
- `story`: Organización modular de la lógica y UI de historias.
- `user`: Organización modular de la lógica de usuarios.
- `auth-google`: Integración modular de la autenticación Google.
- `comment`: Organización modular de la sección de comentarios.

## Impact

- Carpeta `src/`: Afecta a `components/`, `hooks/`, `services/`, `store/` y `pages/`.
- Sistema de rutas: Los componentes de página se moverán a sus respectivos módulos de dominio.
- Experiencia de desarrollo: Mejora la claridad sobre dónde encontrar y añadir funcionalidades.
- Tests: Requiere ejecutar y posiblemente ajustar los tests de integración para asegurar que el "funcionamiento actual no se rompa".
