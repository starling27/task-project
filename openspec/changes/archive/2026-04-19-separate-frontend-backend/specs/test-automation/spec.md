## ADDED Requirements

### Requirement: Pre-Commit Hook
El sistema DEBE (MUST) ejecutar los tests automáticamente antes de permitir un commit.

#### Scenario: Commit attempted
- **WHEN** un desarrollador ejecuta `git commit`
- **THEN** el hook de pre-commit ejecuta los tests automáticamente

### Requirement: Validación de Tests
Los tests DEBEN (MUST) ejecutarse completamente antes de confirmar la depuración.

#### Scenario: Tests fallan
- **WHEN** los tests unitarios fallan
- **THEN** el commit es bloqueado y se muestra el error

#### Scenario: Tests pasan
- **WHEN** todos los tests pasan
- **THEN** el commit se completa exitosamente

### Requirement: Scope de Tests
Los tests que se ejecutan en pre-commit DEBEN (MUST) incluir validación de TypeScript y tests unitarios.

#### Scenario: Validación de tipos
- **WHEN** se ejecuta el hook de pre-commit
- **THEN** se verifica que el código compile correctamente con TypeScript

#### Scenario: Tests unitarios
- **WHEN** se ejecuta el hook de pre-commit
- **THEN** se ejecutan los tests unitarios del proyecto

### Requirement: Configuración de Hooks
La configuración de pre-commit DEBE (MUST) almacenarse en la raíz del proyecto.

#### Scenario: Configuración de Husky
- **WHEN** se revisa la configuración del proyecto
- **THEN** existe `.husky/` con la configuración de hooks

### Requirement: Saltar Tests (Emergencia)
Los desarrolladores DEBEN (MUST) poder saltarse los tests en caso de emergencia usando `--no-verify`.

#### Scenario: Skip de emergencia
- **WHEN** un desarrollador ejecuta `git commit --no-verify`
- **THEN** los tests son omitidos y el commit se realiza (uso discouraged)
