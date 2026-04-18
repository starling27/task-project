## Context

El frontend actual utiliza una estructura agrupada por tipo de archivo (`components/`, `hooks/`, `services/`, etc.) en lugar de por funcionalidad. Esto causa que, por ejemplo, los archivos relacionados con "Stories" estén dispersos en 4 o 5 directorios diferentes. Además, los componentes de la interfaz de usuario están mezclados con la lógica de negocio, lo que dificulta la reutilización y el mantenimiento independiente.

## Goals / Non-Goals

**Goals:**
- Reorganizar el código basándose en dominios de negocio (DDD en frontend).
- Facilitar una separación clara entre el código de frontend y el backend para futuros splits de repositorio.
- Centralizar componentes de UI genéricos (átomos y moléculas agnósticas) para mayor consistencia visual.
- Implementar Path Aliases para mejorar la legibilidad de las importaciones.
- Mantener la paridad funcional y asegurar que todos los tests de integración pasen.

**Non-Goals:**
- Cambiar la tecnología base (React/Vite/Zustand).
- Refactorizar la lógica interna de los componentes (el objetivo es estructural, no funcional en esta fase).
- Rediseñar la interfaz de usuario.

## Decisions

### 1. Nueva Estructura de Directorios
Se implementará la siguiente jerarquía en `src/`:
- `modules/`: Contiene subdirectorios para cada dominio (`project`, `epic`, `story`, `user`, `auth`). Cada uno con su propia lógica interna.
- `shared/`: Componentes de UI comunes (Buttons, Dropdowns genéricos), hooks de utilidad y constantes globales.
- `core/`: Configuración global, instancia base del cliente de API, y orquestación del store global (Zustand).
- `pages/`: Componentes de alto nivel que representan las rutas de la aplicación y componen los módulos.

### 2. Capa de Adaptadores de API
Cada módulo tendrá su propio directorio `services/` que consumirá un cliente base de `core/api/`. Estos servicios actuarán como adaptadores, transformando los datos del backend a los tipos específicos del dominio de frontend, protegiendo al frontend de cambios en la API.

### 3. Refactorización del Store
`useBacklogStore` se mantendrá como punto central de estado para evitar roturas masivas en la UI optimista, pero su definición interna se moverá a `src/core/store/` y se evaluará la segmentación en "slices" por dominio.

### 4. Configuración de Path Aliases
Se actualizará `tsconfig.json` y `vite.config.ts` para soportar:
- `@modules/*` -> `src/modules/*`
- `@shared/*` -> `src/shared/*`
- `@core/*` -> `src/core/*`

## Risks / Trade-offs

- **[Risk] Rotura de importaciones** → Casi todos los archivos se moverán.
- **[Mitigation]** Uso de herramientas automatizadas para refactorización de rutas y validación exhaustiva con tests de integración.
- **[Risk] Complejidad inicial** → La estructura modular requiere más directorios.
- **[Mitigation]** Proporcionar una guía clara en `ARCHITECTURE.md` sobre dónde debe ir cada nuevo archivo.
- **[Risk] Problemas de Dependencia Circular** → Los módulos podrían intentar importarse entre sí.
- **[Mitigation]** Regla estricta: Los módulos solo pueden depender de `shared`, `core` o importar tipos de otros módulos. La comunicación de datos se hace vía store.
