## Why

El módulo de Epic tiene use cases incompletos (falta GetEpicById y UpdateEpic) y las validaciones de negocio no están completamente implementadas. Específicamente, la regla de "nombre único dentro de proyecto pero permitiendo reutilizar nombres de epics eliminados lógicamente" necesita corregirse.

## What Changes

- Agregar `GetEpicByIdUseCase` para obtener un epic por su ID
- Agregar `UpdateEpicUseCase` para actualizar un epic existente con validaciones
- Corregir `findByNameInProject` en Repository para excluir epics eliminados (soft-deleted)
- Agregar validación en domain: no permitir update si el epic está archivado
- Agregar validación de nombre único que ignore epics eliminados
- Mejorar validación en el entity Epic

## Capabilities

### New Capabilities

- `epic-by-id`: Obtener un epic por su ID único
- `epic-update`: Actualizar un epic con validaciones de negocio

### Modified Capabilities

- `epic`: Actualizar spec para aclarar validación de nombre único con soft-delete
- `epic`: Agregar REQUIREMENTS sobre validación de nombre y status archivado

## Impact

- `backend/src/modules/epic/application/use-cases/`
- `backend/src/modules/epic/domain/entities/Epic.ts`
- `backend/src/modules/epic/infrastructure/repositories/PrismaEpicRepository.ts`
- `openspec/specs/epic/spec.md` (delta spec)