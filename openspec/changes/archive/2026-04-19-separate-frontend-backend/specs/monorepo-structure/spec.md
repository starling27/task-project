## ADDED Requirements

### Requirement: Estructura de Workspaces
El proyecto DEBE (MUST) configurarse como un npm workspace con dos paquetes independientes: `frontend/` y `backend/`.

#### Scenario: Configuración de workspace
- **WHEN** se ejecuta `npm install` en la raíz del proyecto
- **THEN** se instalan las dependencias de ambos paquetes y se genera un único `package-lock.json`

### Requirement: Separación de Paquetes
El proyecto DEBE (MUST) mantener frontend y backend en carpetas independientes con sus propios `package.json`.

#### Scenario: Estructura de archivos
- **WHEN** se inspecciona la estructura del proyecto
- **THEN** existen las carpetas `frontend/` y `backend/` con sus respectivos `package.json` y código fuente

### Requirement: Gestión de Dependencias
Las dependencias específicas de cada proyecto DEBEN (MUST) residir en su respective `package.json`.

#### Scenario: Dependencias del frontend
- **WHEN** se revisa `frontend/package.json`
- **THEN** contiene solo dependencias de React, Vite y frontend-related

#### Scenario: Dependencias del backend
- **WHEN** se revisa `backend/package.json`
- **THEN** contiene solo dependencias de Node, Express, Prisma y backend-related

### Requirement: Compilación Independiente
Cada proyecto DEBE (MUST) poder compilarse de forma independiente.

#### Scenario: Build del frontend
- **WHEN** se ejecuta `npm run build` en `frontend/`
- **THEN** se genera la carpeta `dist/` con los archivos compilados

#### Scenario: Build del backend
- **WHEN** se ejecuta `npm run build` en `backend/`
- **THEN** se compila el código TypeScript a JavaScript en la carpeta de salida

### Requirement: Configuración TypeScript Compartida
La configuración base de TypeScript DEBE (MUST) residir en la raíz y extenderse en cada proyecto.

#### Scenario: Herencia de TypeScript
- **WHEN** se compila un proyecto
- **THEN** se utiliza la configuración `tsconfig.json` base de la raíz extendida por la del proyecto específico
