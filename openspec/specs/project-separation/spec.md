# project-separation Specification

## Purpose
TBD - created by archiving change separate-frontend-backend. Update Purpose after archive.
## Requirements
### Requirement: Carpeta de Backend
El código del servidor DEBE (MUST) residir en la carpeta `backend/`.

#### Scenario: Estructura del backend
- **WHEN** se inspecciona la carpeta `backend/`
- **THEN** contiene `src/`, `package.json` y configuración de TypeScript

### Requirement: Carpeta de Frontend
El código del cliente DEBE (MUST) residir en la carpeta `frontend/`.

#### Scenario: Estructura del frontend
- **WHEN** se inspecciona la carpeta `frontend/`
- **THEN** contiene `src/`, `package.json`, `vite.config.ts` y configuración de TypeScript

### Requirement: Mantenimiento de Funcionalidad
Los cambios DEBE (MUST) mantener el funcionamiento actual del sistema sin rupturas.

#### Scenario: Verificación de funcionalidad
- **WHEN** se completa la migración
- **THEN** la aplicación funciona igual que antes de la separación

### Requirement: Rutas de Import
Las rutas de importación DEBEN (MUST) actualizarse para reflejar la nueva estructura.

#### Scenario: Import del frontend
- **WHEN** un componente importa otro componente
- **THEN** la ruta de importación refleja la nueva ubicación en `frontend/src/`

#### Scenario: Import del backend
- **WHEN** un servicio importa otro servicio
- **THEN** la ruta de importación refleja la nueva ubicación en `backend/src/`

### Requirement: Scripts de NPM
Los scripts de npm DEBEN (MUST) actualizarse para funcionar con la nueva estructura.

#### Scenario: Script de desarrollo
- **WHEN** se ejecuta `npm run dev` en la raíz
- **THEN** se inicia el servidor de desarrollo de frontend (y opcionalmente backend)

#### Scenario: Script de build
- **WHEN** se ejecuta `npm run build`
- **THEN** se compilan ambos proyectos (frontend y backend)

### Requirement: Preservación de Configuración de Base Hexagonal
La estructura de base hexagonal del backend DEBE (MUST) mantenerse en `backend/`.

#### Scenario: Estructura hexagonal
- **WHEN** se inspecciona el código del backend
- **THEN** mantiene la estructura de capas: domain, application, infrastructure

### Requirement: Preservación de Modularidad del Frontend
La estructura modular del frontend DEBE (MUST) mantenerse en `frontend/src/modules/`.

#### Scenario: Módulos del frontend
- **WHEN** se inspecciona el código del frontend
- **THEN** mantiene la estructura de módulos por dominio en `frontend/src/modules/`

