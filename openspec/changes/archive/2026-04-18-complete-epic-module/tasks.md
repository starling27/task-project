## 1. Correction Repository

- [x] 1.1 Corregir `findByNameInProject` en `PrismaEpicRepository` para agregar `deletedAt: null`
- [x] 1.2 Verificar que no hay otro query que busque sin el filtro

## 2. Nuevos Use Cases

- [x] 2.1 Crear `GetEpicByIdUseCase` en `application/use-cases/`
- [x] 2.2 Crear `UpdateEpicUseCase` con validaciones en `application/use-cases/`

## 3. DTOs

- [x] 3.1 Agregar `UpdateEpicInput` en `EpicDTOs.ts`

## 4. Validaciones Domain

- [x] 4.1 Mejorar `Epic.validate()` con regla de nombre único
- [x] 4.2 Agregar Helper method si es necesario

## 5. Verificacion

- [x] 5.1 Correr tests de integracion
- [x] 5.2 Verificar que el modulo funciona correctamente