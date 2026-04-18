## Why

The current backend structure, while modular, lacks a clear separation of concerns, making it difficult to maintain and scale. Migrating to Hexagonal Architecture and Domain-Driven Design (DDD) will decouple the core business logic from infrastructure (like the database and framework), improve testability, and align the codebase with professional software engineering standards.

## What Changes

- **BREAKING**: Refactor the backend module structure from a flat `src/modules/<name>/<name>.service.ts` to a layered structure: `domain`, `application`, and `infrastructure`.
- **BREAKING**: Introduce repository interfaces in the `domain` layer and move Prisma-specific implementations to the `infrastructure` layer.
- **BREAKING**: Encapsulate business logic into `use-cases` within the `application` layer.
- Move existing route handlers to `infrastructure/controllers` or similar infrastructure adapters.
- Update all internal imports and service instantiations to match the new structure.
- Update and fix integration tests to use the new architecture.

## Capabilities

### New Capabilities
- `hexagonal-base`: Defines the base interfaces, abstract classes, and shared types for the hexagonal architecture (e.g., `BaseEntity`, `Repository`, `UseCase`).

### Modified Capabilities
- `project`: Update structure to reflect the new layered architecture and dependency injection.
- `epic`: Update structure to reflect the new layered architecture.
- `story`: Update structure to reflect the new layered architecture.
- `user`: Update structure to reflect the new layered architecture.
- `comment`: Update structure to reflect the new layered architecture.
- `workflow`: Update structure to reflect the new layered architecture.
- `status-history`: Update structure to reflect the new layered architecture.
- `assignee-history`: Update structure to reflect the new layered architecture.
- `jira-sync-queue`: Update structure to reflect the new layered architecture.

## Impact

- All backend modules in `src/modules/`.
- Backend entry point `src/index.ts`.
- Integration tests in `tests/`.
- Dependency injection pattern will be introduced, affecting how objects are instantiated.
