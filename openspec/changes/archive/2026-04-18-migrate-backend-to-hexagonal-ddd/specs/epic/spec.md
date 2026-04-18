## ADDED Requirements

### Requirement: Hexagonal Structure for Epic Module
The Epic module SHALL be structured into `domain`, `application`, and `infrastructure` layers.

#### Scenario: Layered architecture validation
- **WHEN** the Epic module is inspected
- **THEN** it MUST contain a `domain/repositories` interface and an `infrastructure/repositories` implementation using Prisma.

### Requirement: Epic Use Cases
All Epic operations (Create, Read, Update, Delete) SHALL be implemented as discrete Use Case classes in the `application` layer.

#### Scenario: Use case isolation
- **WHEN** an Epic is created
- **THEN** the `CreateEpicUseCase` SHALL be executed, depending only on the `EpicRepository` interface.
