## ADDED Requirements

### Requirement: Base Entity structure
All domain entities SHALL extend a base entity that includes common fields like `id`, `createdAt`, `updatedAt`, and `deletedAt`.

#### Scenario: Entity creation
- **WHEN** a new domain entity is instantiated
- **THEN** it SHALL have an optional `id` and audit timestamps

### Requirement: Repository Interface
The system SHALL define a generic repository interface for basic CRUD operations to be implemented by infrastructure adapters.

#### Scenario: Repository implementation
- **WHEN** a repository is implemented for a specific entity
- **THEN** it MUST implement methods for findById, findAll, save, and delete

### Requirement: Use Case Interface
All application logic SHALL be encapsulated in Use Case classes that implement a standard execution interface.

#### Scenario: Use case execution
- **WHEN** a use case is called with its input DTO
- **THEN** it SHALL return an output DTO or throw a domain exception
