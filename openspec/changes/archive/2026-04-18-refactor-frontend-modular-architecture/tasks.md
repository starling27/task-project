## 1. Configuración y Base Core

- [x] 1.1 Configurar Path Aliases en `tsconfig.json` y `vite.config.ts` (@modules, @shared, @core)
- [x] 1.2 Crear estructura de directorios base en `src/`: `modules/`, `shared/`, `core/`
- [x] 1.3 Crear instancia base de API en `src/core/api/apiClient.ts`
- [x] 1.4 Reubicar `useBacklogStore.ts` a `src/core/store/useBacklogStore.ts` y actualizar referencias iniciales

## 2. Migración a Capa Shared

- [x] 2.1 Mover componentes de UI genéricos (Button, StatusDropdown, etc.) a `src/shared/ui/`
- [x] 2.2 Reubicar hooks de utilidad transversal (si existen) a `src/shared/hooks/`
- [x] 2.3 Mover `eventBus.ts` a `src/shared/services/eventBus.ts`

## 3. Implementación de Módulos de Dominio

- [x] 3.1 Crear módulo `auth`: mover lógica de login y componentes relacionados
- [x] 3.2 Crear módulo `project`: reubicar componentes, hooks y servicios de proyectos
- [x] 3.3 Crear módulo `epic`: reubicar componentes y lógica de epics
- [x] 3.4 Crear módulo `story`: mover `StoryEditor.tsx`, `useStories.ts` y adaptadores de API
- [x] 3.5 Crear módulo `user` y `comment`: organizar la lógica de asignación y comentarios

## 4. Recomposición y Verificación

- [x] 4.1 Actualizar componentes de página en `src/pages/` para importar desde los nuevos módulos
- [x] 4.2 Ajustar `src/main.tsx` y `src/index.css` (si se mueven)
- [x] 4.3 Ejecutar tests de integración `npm run test:integration` y corregir regresiones de rutas
- [x] 4.4 Eliminar directorios antiguos (`src/components/`, `src/hooks/`, `src/services/`, `src/store/` originales)
