## 1. Estructura de Base y Compartidos

- [ ] 1.1 Crear carpeta `src/shared/ui/`, `src/shared/hooks/` y `src/shared/services/`
- [ ] 1.2 Configurar alias de paths en `tsconfig.json` para facilitar las importaciones modulares
- [ ] 1.3 Mover componentes genéricos (ej: botones, dropdowns base) a `src/shared/ui/`
- [ ] 1.4 Crear la jerarquía de carpetas para cada módulo en `src/modules/`

## 2. Migración del Módulo de Autenticación

- [ ] 2.1 Mover componentes de `src/components/Auth/` a `src/modules/auth/components/`
- [ ] 2.2 Reubicar `src/modules/auth/auth.service.ts` y actualizar su namespace
- [ ] 2.3 Ajustar importaciones en `LoginPage.tsx` y verificar flujo de login

## 3. Migración de Módulos de Estructura (Project y Epic)

- [ ] 3.1 Mover componentes y hooks de proyectos a `src/modules/project/`
- [ ] 3.2 Mover componentes y lógica de epics a `src/modules/epic/`
- [ ] 3.3 Refactorizar el componente `Accordion` para separar la lógica visual de la de dominio

## 4. Migración del Módulo de Historias (Stories)

- [ ] 4.1 Mover `StoryEditor.tsx` y componentes relacionados a `src/modules/story/components/`
- [ ] 4.2 Reubicar el hook `useStories.ts` en `src/modules/story/hooks/`
- [ ] 4.3 Asegurar que las actualizaciones optimistas sigan funcionando tras el movimiento

## 5. Migración de Módulos de Soporte (User, Comment, Report)

- [ ] 5.1 Migrar la gestión de comentarios a `src/modules/comment/`
- [ ] 5.2 Migrar el selector de responsables y lógica de usuarios a `src/modules/user/`
- [ ] 5.3 Mover el servicio de reportes a `src/modules/report/`

## 6. Limpieza y Validación Final

- [ ] 6.1 Realizar limpieza de archivos residuales en las carpetas `src/components/` y `src/hooks/` originales
- [ ] 6.2 Actualizar las importaciones finales en los puntos de entrada: `src/main.tsx` y `src/pages/BacklogPage.tsx`
- [ ] 6.3 Ejecutar `npm run test:integration` y corregir cualquier regresión detectada
