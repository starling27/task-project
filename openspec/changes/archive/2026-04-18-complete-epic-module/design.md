## Context

El módulo Epic ya tiene una estructura hexagonal básica pero con gaps:
- **Use Cases implementados**: CreateEpic, GetEpicsByProject, DeleteEpic
- **Use Cases faltantes**: GetEpicById, UpdateEpic
- **Bug conocido**: `findByNameInProject` busca TODOS incluyendo eliminados, cuando debería excluir los eliminados lógicamente

## Goals / Non-Goals

**Goals:**
- Completar los use cases faltantes según la spec
- Corregir validación de nombre único para permitir reuse de nombres de epics eliminados
- Implementar validación de "epic archivado no actualizable"

**Non-Goals:**
- No modificar la estructura de archivos del módulo
- No agregar nuevos endpoints API (solo use cases)
- No cambiar el schema de Prisma

## Decisions

### 1. Validación de nombre único
El comportamiento requerido:
- Un epic activo NO puede tener el mismo nombre que otro epic activo en el mismo proyecto
- Un epic puede usar el nombre de un epic ELIMINADO (soft-delete) en el mismo proyecto

**Alternativas evaluadas:**
- A) Buscar con `deletedAt: null` en el repository (simples)
- B) Query con raw SQL excluyendo eliminados (overkill)

**Decisión:** Opción A - modificar `findByNameInProject` para agregar filtro `deletedAt: null`

### 2. Validación de update bloqueado
El epic con `status: archived` no debe permitir updates.

**Alternativas evaluadas:**
- A) Validar en UseCase (recomendado - donde están las demás validaciones)
- B) Validar en Entity (mas fuerte, pero no tenemos domain services)

**Decisión:** Validar en UseCase siguiendo el patrón existente

### 3. Estructura de Use Cases
Seguir el patrón de:
- `GetEpicByProjectUseCase` retorna array → `GetEpicByIdUseCase` retorna single
- `CreateEpicUseCase` validaciones → `UpdateEpicUseCase` mismo patrón

## Implementation

```
Epic entity (domain):
  - canUpdate(): boolean
  - validate(): asegurar validación de longitud nombres

EpicRepository (domain):
  - add: findById que retorna con deletedAt null

PrismaEpicRepository (infrastructure):
  - findByNameInProject: agregar deletedAt: null filtro

Use Cases (application):
  - GetEpicByIdUseCase: nuevo
  - UpdateEpicUseCase: nuevo con validaciones

EpicDTOs (application):
  - UpdateEpicInput: nuevo DTO
```

## Risks / Trade-offs

- [Riesgo] Validación en UseCase vs Domain - **Mitigación**: La validación de negocio queda en UseCase como está en el código actual, el entity solo tiene validación de formato
- [Trade-off] Nombre único requiere siempre 2 queries - Aceptable por ahora

## Open Questions

- ¿El frontend necesita el nuevo endpoint `GetEpicById`?
- ¿Validar también en el Delete?