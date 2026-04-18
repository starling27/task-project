## ADDED Requirements

### Requirement: Hexagonal Structure for Project Module
The Project module SHALL be structured into `domain`, `application`, and `infrastructure` layers.

#### Scenario: Layered architecture validation
- **WHEN** the Project module is inspected
- **THEN** it MUST contain a `domain/repositories` interface and an `infrastructure/repositories` implementation using Prisma.

### Requirement: Project Use Cases
All Project operations (Create, Read, Update, Delete) SHALL be implemented as discrete Use Case classes in the `application` layer.

#### Scenario: Use case isolation
- **WHEN** a Project is created
- **THEN** the `CreateProjectUseCase` SHALL be executed, depending only on the `ProjectRepository` interface.
