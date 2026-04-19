## ADDED Requirements

### Requirement: Get Epic By ID
The system SHALL allow retrieving a single Epic by its unique identifier.

#### Scenario: Get existing epic
- **WHEN** a request is made to get an epic by ID
- **THEN** the system returns the epic if it exists and is not soft-deleted

#### Scenario: Get non-existent epic
- **WHEN** a request is made with a non-existent ID
- **THEN** the system returns null or throws error

#### Scenario: Get soft-deleted epic
- **WHEN** a request is made with an ID of a soft-deleted epic
- **THEN** the system returns null (soft-deleted epics are not returned)