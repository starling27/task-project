## ADDED Requirements

### Requirement: Update Epic
The system SHALL allow updating an existing Epic with validations.

#### Scenario: Update active epic
- **WHEN** an update request is made for an active epic
- **THEN** the epic is updated with the new values

#### Scenario: Update archived epic is blocked
- **WHEN** an update request is made for an archived epic
- **THEN** the system throws error "Archived epics cannot be updated"

#### Scenario: Unique name validation allows deleted epic's name
- **WHEN** updating an epic name to a name that was used by a soft-deleted epic
- **THEN** the update succeeds (names of deleted epics can be reused)

#### Scenario: Unique name validation blocks active duplicate
- **WHEN** updating an epic name to one that another active epic already uses
- **THEN** the system throws error "Epic name must be unique within project"