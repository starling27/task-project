## Why

El frontend y el backend están actualmente combinados en un único proyecto. Esto dificulta el mantenimiento independiente, el escalamiento y la colaboración entre equipos. Separar los proyectos permitirá gestionar el ciclo de vida de cada parte de manera independiente, mantener versiones distintas y facilitar la adopción de tecnologías específicas para cada capa.

## What Changes

- Crear estructura de monorepo con carpetas independientes para frontend y backend
- Mover código de backend a carpeta `backend/`
- Mover código de frontend a carpeta `frontend/` (actual `src/`)
- Configurar herramientas de monorepo (workspace) para gestionar ambos proyectos
- Actualizar configuración de construcción y dependencias compartidas
- **BREAKING**: Cambiar estructura de rutas de import, reconfigurar scripts de npm
- Modificar flujo de tests para ejecutarse antes de confirmar cambios (pre-commit)
- Actualizar documentación de proyecto y arquitectura

## Capabilities

### New Capabilities

- `monorepo-structure`: Configuración de workspace para gestionar frontend y backend de forma independiente
- `test-automation`: Automatización de tests que se ejecutan antes de confirmar depuración (pre-commit hooks)
- `project-separation`: Definición de estructura y responsabilidades de cada proyecto separado

### Modified Capabilities

- `frontend-modularity`: La estructura existente de modularidad del frontend se moverá a la carpeta `frontend/`
- `hexagonal-base`: La base hexagonal del backend se reorganizará en `backend/`

## Impact

- Estructura de directorios del proyecto
- Scripts de npm (build, test, dev)
- Configuración de TypeScript
- Dependencias y workspace
- Flujo de desarrollo y deployment
- Documentación técnica existente