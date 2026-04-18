## Context

El sistema actual utiliza una estructura de archivos plana dentro de `src/`. Esto agrupa componentes de diferentes dominios (Project, Epic, Story) en una única carpeta `components/`, y mezcla hooks, servicios y stores de manera global. El estado global en `useBacklogStore` maneja casi toda la lógica del backlog, creando un archivo de store monolítico que es difícil de escalar. Esta falta de límites claros dificulta la identificación de responsabilidades y aumenta el riesgo de efectos colaterales durante las actualizaciones.

## Goals / Non-Goals

**Goals:**
- Implementar una arquitectura basada en módulos de dominio: `src/modules/<nombre-dominio>/`.
- Separar componentes de UI reutilizables (átomos/moléculas genéricas) de los componentes de dominio: `src/shared/ui/`.
- Modularizar los hooks, tipos y servicios específicos por dominio dentro de sus respectivas carpetas de módulo.
- Asegurar que el "funcionamiento actual no se rompa" mediante la ejecución constante de tests.
- Facilitar la navegación del código y la integración de nuevos desarrolladores.

**Non-Goals:**
- Cambiar el stack tecnológico base (React 19, Zustand, Tailwind).
- Refactorizar la lógica de negocio interna o las reglas de validación (solo se moverán de lugar).
- Rediseñar visualmente la aplicación (el look & feel debe mantenerse igual).

## Decisions

1. **Estructura de Carpetas Propuesta**:
   Se adoptará el siguiente esquema jerárquico:
   ```
   src/
   ├── modules/
   │   ├── auth/         # Lógica de Google Login, perfiles
   │   ├── project/      # Gestión de proyectos, creación
   │   ├── epic/         # Gestión de epics
   │   ├── story/        # Gestión de historias, edición en línea, puntos
   │   ├── user/         # Lógica de asignados, búsqueda de usuarios
   │   ├── comment/      # Sección de comentarios
   │   └── report/       # Exportación CSV y reportes
   ├── shared/
   │   ├── ui/           # Componentes genéricos: Button, StatusDropdown, AccordionBase
   │   ├── hooks/        # Hooks transversales: useDebounce, useClickOutside
   │   ├── services/     # apiService base, eventBus
   │   └── types/        # Tipos compartidos
   ├── pages/            # Componentes de página que orquestan los módulos
   └── store/            # Punto de entrada para el estado global (Zustand)
   ```

2. **Componentes de Dominio vs UI**:
   - Los componentes que contienen lógica de negocio o se comunican directamente con el store se ubicarán en `src/modules/<dominio>/components/`.
   - Los componentes puramente visuales y agnósticos al dominio se moverán a `src/shared/ui/`.

3. **Migración de Hooks y Servicios**:
   - `src/hooks/useStories.ts` -> `src/modules/story/hooks/useStories.ts`.
   - `src/services/apiService.ts` -> Se mantiene en `src/shared/services/` como cliente base.
   - Servicios específicos (ej: `jiraSync.service.ts`) se moverán a su módulo correspondiente.

4. **Preservación del Store Monolítico (Temporal)**:
   - Para no romper la UI optimista que depende fuertemente de `useBacklogStore`, se mantendrá el store en `src/store/`, pero se evaluará la división en "slices" lógicos en una fase posterior si es viable.

## Risks / Trade-offs

- **[Risk] Rotura masiva de importaciones** → Casi todos los archivos fallarán al compilar inicialmente debido al cambio de rutas.
- **[Mitigation]** Realizar la migración módulo por módulo y utilizar alias de path en `tsconfig.json` (ej: `@modules/*`) para estabilizar las rutas.
- **[Risk] Complejidad en componentes transversales** → Algunos componentes actuales (como el Accordion) están muy acoplados a la lógica de Project > Epic > Story.
- **[Mitigation]** Refactorizar primero el componente base visual y luego inyectar la lógica específica en capas superiores dentro de cada módulo.
- **[Risk] Regresión en tests** → Los tests de integración podrían fallar por dependencias no encontradas.
- **[Mitigation]** Ejecutar `npm run test:integration` antes y después de cada movimiento de archivo.
