## Context

Actualmente el proyecto contiene tanto el frontend (React/TypeScript) como el backend (Node.js/Express/Prisma) en una única estructura. El código backend reside en la raíz con `prisma/`, mientras que el frontend está en `src/`. Esta configuración combinado dificulta:

- Desarrollo independiente de cada equipo
- Despliegue separado
- Gestión de dependencias específicas por capa
- Escalamiento

El objetivo es transformar la estructura actual en un monorepo con dos paquetes independientes.

## Goals / Non-Goals

**Goals:**
- Separar frontend y backend en carpetas independientes (`frontend/` y `backend/`)
- Configurar npm workspaces para gestionar ambos proyectos
- Mantener el funcionamiento actual sin rupturas
- Implementar automatización de tests en pre-commit
- Preservar la base hexagonal del backend y la modularidad del frontend

**Non-Goals:**
- Reescribir lógica de negocio existente
- Cambiar tecnologías o frameworks (seguiremos usando React, Node.js, Prisma)
- Migrar a otro sistema de gestión de paquetes
- Implementar CI/CD automatizado (fuera del alcance)

## Decisiones

### 1. Estructura de Monorepo

Se usará npm workspaces por compatibilidad con la configuración actual.

```
root/
├── package.json (workspace root)
├── frontend/    (React + Vite)
│   ├── package.json
│   └── src/
├── backend/     (Node + Express + Prisma)
│   ├── package.json
│   └── src/
└── package-lock.json
```

**Alternativa evaluada:** Turborepo - Descartado por añadir complejidad innecesaria para dos paquetes.

### 2. Separación de Código

- `backend/` contendrá: `src/server.ts`, `src/routes/`, `src/services/`, `prisma/`, configuración de TypeScript
- `frontend/` contendrá: todo lo que actualmente está en `src/` (componentes, páginas, stores, etc.)
- Raíz: configuración de workspaces, scripts de test, documentación

**Alternativa evaluada:** Mantener código en raíz - Descartado porque no logra el objetivo de separación clara.

### 3. Automatización de Tests

Se implementará con Husky + lint-staged:
- Pre-commit: ejecuta lint + tests antes de permitir commit
- Validación: Typescript compile + unit tests

**Alternativa evaluada:** Solo CI - Descartado porque el requisito es ejecutar tests antes de confirmar.

### 4. Dependencias Compartidas

Las dependencias de desarrollo comunes (TypeScript, ESLint, Jest) stays en root workspace. Las dependencias específicas de cada proyecto van en su respective `package.json`.

## Riesgos / Trade-offs

- [Riesgo] Rutas de import rotas → **Mitigación**: Actualizar todos los paths de importación y crear scripts de verificación post-migración
- [Riesgo] Configuración de TypeScript duplicada → **Mitigación**: Mantener `tsconfig.json` base en raíz y extender en cada proyecto
- [Riesgo] Conflictos de merge en estructura → **Mitigación**: Realizar migración en un solo commit con revisión exhaustiva
- [Trade-off] Mayor tiempo inicial de configuración → **Beneficio**: Mantenimiento más fácil a largo plazo

## Migration Plan

1. **Fase 1 - Preparación** (Día 1)
   - Crear carpetas `frontend/` y `backend/`
   - Configurar `package.json` root con workspaces

2. **Fase 2 - Migración de Backend** (Día 2)
   - Mover código de servidor a `backend/`
   - Mover `prisma/` a `backend/`
   - Actualizar imports y configuraciones

3. **Fase 3 - Migración de Frontend** (Día 3)
   - Mover `src/` a `frontend/src/`
   - Actualizar vite.config.ts paths

4. **Fase 4 - Configuración de Tests** (Día 4)
   - Instalar Husky
   - Configurar pre-commit hook
   - Probar con commit de prueba

5. **Fase 5 - Validación** (Día 5)
   - Ejecutar todos los tests
   - Verificar funcionamiento end-to-end
   - Actualizar documentación

**Rollback**: Si algo falla, se puede revertir el movimiento de carpetas y restaurar la estructura anterior usando git.

## Open Questions

- ¿Necesitamos mantener la carpeta `specs/` en raíz o moverla a `backend/`?
- ¿Qué estrategia de versionamiento usaremos (semver para cada paquete)?
- ¿Mantendremos un único repositorio git o separaremos?