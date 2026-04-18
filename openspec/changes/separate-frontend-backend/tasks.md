## 1. Configuración Inicial del Monorepo

- [x] 1.1 Crear carpetas `frontend/` y `backend/` en la raíz del proyecto
- [x] 1.2 Actualizar `package.json` raíz para configurar npm workspaces
- [x] 1.3 Crear `frontend/package.json` con nombre `@task-project/frontend` y dependencias base
- [x] 1.4 Crear `backend/package.json` con nombre `@task-project/backend` y dependencias base
- [x] 1.5 Ejecutar `npm install` para verificar que workspaces funciona
- [x] 1.6 Crear `tsconfig.json` base en raíz que extienda en cada proyecto

## 2. Migración del Backend

- [x] 2.1 Mover código del servidor a `backend/src/` (routes, services, controllers)
- [x] 2.2 Mover `prisma/` a `backend/`
- [x] 2.3 Mover `src/server.ts` a `backend/src/`
- [x] 2.4 Crear `backend/tsconfig.json` que extienda la base
- [x] 2.5 Crear `backend/package.json` con scripts: `dev`, `build`, `start`, `test`
- [x] 2.6 Actualizar imports en archivos del backend
- [x] 2.7 Crear archivo `.env` en `backend/` si es necesario
- [x] 2.8 Verificar que el backend compila correctamente

## 3. Migración del Frontend

- [x] 3.1 Mover contenido de `src/` a `frontend/src/`
- [x] 3.2 Actualizar `frontend/package.json` con scripts: `dev`, `build`, `preview`
- [x] 3.3 Actualizar `vite.config.ts` paths para nueva estructura
- [x] 3.4 Crear `frontend/tsconfig.json` que extienda la base
- [x] 3.5 Actualizar rutas de imports en componentes (de `src/` a `frontend/src/`)
- [x] 3.6 Actualizar configuración de TailwindCSS si es necesario
- [x] 3.7 Verificar que el frontend compila correctamente

## 4. Automatización de Tests (Pre-Commit)

- [x] 4.1 Instalar Husky y lint-staged como dependencias de desarrollo
- [x] 4.2 Inicializar Husky: `npx husky init`
- [x] 4.3 Crear script de pre-commit que ejecute: TypeScript compile + tests
- [x] 4.4 Configurar `.husky/pre-commit` con el script de validación
- [x] 4.5 Configurar `lint-staged` en `package.json` raíz
- [x] 4.6 Probar el hook con un commit de prueba
- [x] 4.7 Verificar que el commit se bloquea si los tests fallan

## 5. Validación y Documentación

- [x] 5.1 Ejecutar todos los tests del proyecto
- [x] 5.2 Verificar que la aplicación funciona end-to-end (dev server)
- [x] 5.3 Ejecutar build completo de ambos proyectos
- [x] 5.4 Actualizar `AGENTS.md` con la nueva estructura
- [x] 5.5 Actualizar `ARCHITECTURE.md` con la nueva estructura de monorepo
- [x] 5.6 Verificar que `README.md` refleja la nueva estructura de comandos
- [x] 5.7 Realizar commit final de la migración