## 1. Core Architectural Setup

- [x] 1.1 Create `src/core/domain/BaseEntity.ts` with common fields (id, timestamps)
- [x] 1.2 Create `src/core/domain/Repository.ts` generic interface
- [x] 1.3 Create `src/core/application/UseCase.ts` base interface
- [x] 1.4 Create `src/core/infrastructure/PrismaClient.ts` to share the prisma instance

## 2. Project Module Refactor

- [x] 2.1 Define `Project` domain entity and `ProjectRepository` interface
- [x] 2.2 Implement `PrismaProjectRepository` in infrastructure layer
- [x] 2.3 Implement Project Use Cases (Create, Get, Update, Delete)
- [x] 2.4 Update `src/index.ts` to use new Project Use Cases

## 3. Epic Module Refactor

- [x] 3.1 Define `Epic` domain entity and `EpicRepository` interface
- [x] 3.2 Implement `PrismaEpicRepository` in infrastructure layer
- [x] 3.3 Implement Epic Use Cases (Create, GetByProject)
- [x] 3.4 Update `src/index.ts` to use new Epic Use Cases

## 4. Story Module Refactor

- [x] 4.1 Define `Story` domain entity and `StoryRepository` interface
- [x] 4.2 Implement `PrismaStoryRepository` in infrastructure layer
- [x] 4.3 Implement Story Use Cases (Create, Update, ChangeStatus, Assign)
- [x] 4.4 Update `src/index.ts` to use new Story Use Cases

## 5. Supporting Modules Refactor (User, Comment, Workflow)

- [x] 5.1 Refactor User module to Hexagonal structure
- [x] 5.2 Refactor Comment module to Hexagonal structure
- [x] 5.3 Refactor Workflow module to Hexagonal structure

## 6. History & Integration Modules Refactor

- [x] 6.1 Refactor StatusHistory and AssigneeHistory modules
- [x] 6.2 Refactor JiraSyncQueue module to Hexagonal structure
- [x] 6.3 Ensure `jiraSyncWorker.ts` still works with the new structure

## 7. Verification & Cleanup

- [x] 7.1 Update `tests/integration_test.ts` to import from the new structure
- [x] 7.2 Run `npm run test:integration` and fix any regressions
- [x] 7.3 Remove legacy service files (e.g., `src/modules/project/project.service.ts`)
- [x] 7.4 Final audit of imports and dependency injection in `src/index.ts`
