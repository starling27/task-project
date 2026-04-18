## ADDED Requirements

### Requirement: Estructura Modular de Autenticación
La integración con Google Auth y el estado de la sesión DEBEN estar encapsulados en el módulo `src/modules/auth/`.

#### Scenario: Login de usuario
- **WHEN** el usuario inicia sesión con Google
- **THEN** la lógica de callback y tokens DEBE procesarse mediante los servicios en `@modules/auth/services/`
