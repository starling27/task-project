## Why

La estructura actual del frontend en el directorio `src/` mezcla componentes, hooks, servicios y stores de manera global. Esto genera un acoplamiento implícito entre dominios funcionales (Project, Epic, Story, User) y dificulta el mantenimiento a medida que el proyecto crece. Además, la falta de una separación clara entre la lógica de dominio y la infraestructura (comunicación con la API) complica una posible división del monorepo en el futuro. Migrar a una arquitectura modular basada en dominios permitirá encapsular responsabilidades, mejorar la testabilidad y facilitar la escalabilidad del sistema de frontend.

## What Changes

- **BREAKING**: Reestructuración de la carpeta `src/` hacia un modelo de módulos de dominio (`src/modules/`).
- **BREAKING**: Reubicación de componentes genéricos a un directorio `src/shared/`.
- Creación de módulos específicos para `project`, `epic`, `story`, `auth`, `user` y `comment`. Cada módulo contendrá sus propios componentes de dominio, hooks de datos, tipos y adaptadores de API.
- Refactorización de `useBacklogStore` para segmentar el estado global o delegar responsabilidades a stores específicos por dominio si es viable.
- Estandarización de la capa de servicios para que los adaptadores de API de frontend estén desacoplados de la implementación del backend, facilitando el split del repo.
- Actualización de los tests de integración para reflejar las nuevas rutas de importación y validar que la funcionalidad sigue intacta.

## Capabilities

### New Capabilities
- `frontend-modularity`: Establece el estándar de organización modular para todos los dominios del frontend.
- `api-adapters`: Capa de abstracción para la comunicación con el backend, permitiendo independencia de la estructura de red/repo.

### Modified Capabilities
- `project`: Organización modular de la gestión de proyectos.
- `epic`: Organización modular de la gestión de epics.
- `story`: Organización modular de la gestión de historias.
- `user`: Organización modular de la gestión de usuarios y asignaciones.
- `comment`: Organización modular de la sección de comentarios.

## Impact

- **Directorio `src/`**: Cambios masivos en la ubicación de archivos.
- **Importaciones**: Todas las importaciones internas deberán ser actualizadas (se recomienda el uso de Path Aliases).
- **Rutas**: Los componentes de página se moverán a sus respectivos módulos o a un directorio de páginas que orqueste los módulos.
- **Tests**: Los tests existentes en `tests/` que importen componentes de `src/` deberán actualizar sus rutas.
