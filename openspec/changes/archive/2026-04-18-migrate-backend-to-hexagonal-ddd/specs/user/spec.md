## ADDED Requirements

### Requirement: Hexagonal Structure for User Module
The User module SHALL be structured into `domain`, `application`, and `infrastructure` layers.

#### Scenario: Layered architecture validation
- **WHEN** the User module is inspected
- **THEN** it MUST contain a `domain/repositories` interface and an `infrastructure/repositories` implementation using Prisma.

### Requirement: User Use Cases
All User operations SHALL be implemented as discrete Use Case classes in the `application` layer.

#### Scenario: Use case isolation
- **WHEN** a User is retrieved
- **THEN** the `GetUserUseCase` SHALL be executed, depending only on the `UserRepository` interface.
