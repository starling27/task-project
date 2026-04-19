## Por qué

<!-- Explica la motivación de este cambio. ¿Qué problema resuelve? ¿Por qué ahora? -->
Actualmente el sistema utiliza una base de datos local SQLite, lo que limita su accesibilidad y escalabilidad. La migración a una base de datos PostgreSQL gestionada por Supabase permitirá que la base de datos esté disponible en línea, facilitando el despliegue y el acceso remoto, aprovechando además la arquitectura hexagonal del proyecto para realizar el cambio de infraestructura de forma limpia.

## Qué cambia

<!-- Describe qué cambiará. Sé específico sobre nuevas capacidades, modificaciones o eliminaciones. -->
- Migración del adaptador de base de datos de SQLite a PostgreSQL (Supabase).
- Actualización del esquema de Prisma para compatibilidad con PostgreSQL.
- Configuración de variables de entorno para la conexión con Supabase.
- Modificación de los scripts de inicialización y migración de la base de datos.
- Ajuste de los tests de integración para asegurar la compatibilidad con el nuevo motor de base de datos.

## Capacidades

### Nuevas Capacidades
<!-- Capacidades que se están introduciendo. Reemplaza <name> con un identificador kebab-case (ej. user-auth, data-export, api-rate-limiting). Cada una crea specs/<name>/spec.md -->
- `supabase-persistence`: Implementación de la persistencia de datos utilizando PostgreSQL en Supabase como backend principal.

### Capacidades Modificadas
<!-- Capacidades existentes cuyos REQUISITOS están cambiando (no solo la implementación).
     Solo enumera aquí si cambia el comportamiento a nivel de spec. Cada una necesita un archivo de spec delta.
     Usa nombres de spec existentes de openspec/specs/. Déjalo vacío si no hay cambios en los requisitos. -->

## Impacto

<!-- Código afectado, APIs, dependencias, sistemas -->
- **Infraestructura (Backend)**: Se verán afectados los archivos de configuración de Prisma (`schema.prisma`), el cliente de base de datos y los adaptadores de persistencia.
- **Configuración**: Se requiere configurar nuevas variables de entorno (`DATABASE_URL`, etc.).
- **Tests**: Los tests de integración que dependen de la base de datos deben ser validados para PostgreSQL.
- **Despliegue**: Se elimina la dependencia del archivo de base de datos local `dev.db`.
