## Context

The current backend has modules with services that directly use Prisma. This couples the business logic to the database and makes unit testing difficult without mocking the entire Prisma client. The system already has an event-driven architecture, which fits well with hexagonal principles.

## Goals / Non-Goals

**Goals:**
- Define a standard hexagonal/DDD structure for all backend modules.
- Separate Domain (Entities/Interfaces), Application (Use Cases), and Infrastructure (Persistence/Controllers).
- Implement Dependency Injection (DI) to allow replacing infrastructure implementations (e.g., for testing).
- Maintain existing functionality and pass all integration tests.

**Non-Goals:**
- Migrating the frontend architecture.
- Replacing Prisma with another ORM.
- Changing the database schema (unless strictly necessary for DDD alignment).

## Decisions

### 1. Layered Structure
Each module in `src/modules/<name>/` will follow this structure:
- `domain/`: Pure business logic and interfaces.
    - `entities/`: Domain entities and value objects.
    - `repositories/`: Interface definitions for persistence.
- `application/`: Application logic that orchestrates domain and infrastructure.
    - `use-cases/`: Specific operations (e.g., `CreateProjectUseCase`).
    - `dtos/`: Data Transfer Objects for inputs/outputs.
- `infrastructure/`: External implementations and adapters.
    - `repositories/`: Prisma implementations of domain interfaces.
    - `controllers/`: Request handlers.
    - `mappers/`: Converting between database models and domain entities.

**Rationale:** This is the standard hexagonal/DDD layout, providing clear boundaries and high testability.

### 2. Dependency Injection (DI)
We will use manual DI in the main entry point (`src/index.ts`) or a dedicated `container.ts` to instantiate repositories and pass them to use cases/services.

**Rationale:** Manual DI is explicit and easy to understand without adding heavy external dependencies.

### 3. Domain Entities vs Prisma Models
Domain entities will be separate from Prisma generated models. Mappers in the infrastructure layer will handle conversions.

**Rationale:** Prevents infrastructure details (Prisma) from leaking into the domain logic.

## Risks / Trade-offs

- **[Risk] Complexity Overhead** → The number of files per module will increase significantly.
- **[Mitigation]** Use a consistent pattern across all modules to make navigation predictable.
- **[Risk] Integration Test Breakage** → Existing tests rely on direct service imports.
- **[Mitigation]** Update tests to use the new use cases or a "facade" service that maintains the old API if necessary, though direct use-case testing is preferred.
- **[Risk] Circular Dependencies** → Layered architectures can sometimes lead to circular imports if not careful.
- **[Mitigation]** Strictly enforce the dependency rule: Domain depends on nothing, Application depends on Domain, Infrastructure depends on both.
