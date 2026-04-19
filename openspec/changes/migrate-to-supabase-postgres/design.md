## Contexto

El sistema utiliza actualmente SQLite como motor de base de datos local. Para permitir que la aplicación sea accesible en línea y facilitar el despliegue en entornos de producción, se ha decidido migrar a una base de datos PostgreSQL gestionada por Supabase. Gracias a la arquitectura hexagonal del proyecto, los cambios se limitarán principalmente a la capa de infraestructura y configuración.

## Objetivos / No Objetivos

**Objetivos:**
- Cambiar el proveedor de base de datos en Prisma de `sqlite` a `postgresql`.
- Configurar la conexión con una instancia remota de Supabase.
- Asegurar que todos los tests de integración pasen con el nuevo motor de base de datos.
- Mantener la integridad del esquema y las relaciones actuales.

**No Objetivos:**
- Migrar datos existentes desde SQLite a PostgreSQL (se iniciará con una base de datos limpia o se re-sembrará).
- Cambiar la lógica de negocio o las interfaces de los repositorios.

## Decisiones

### 1. Proveedor de Prisma: PostgreSQL
Se cambiará el `datasource db` en `schema.prisma` para usar `provider = "postgresql"`. PostgreSQL es el estándar de la industria para aplicaciones web robustas y es el motor nativo de Supabase.

### 2. Gestión de Conexiones
Se utilizarán variables de entorno (`DATABASE_URL`) para la cadena de conexión. Para entornos de desarrollo local, se puede seguir usando un contenedor de Docker con Postgres o la instancia de Supabase directamente.

### 3. Estrategia de Migración de Esquema
Se utilizará `prisma migrate dev` para generar las migraciones iniciales compatibles con PostgreSQL. Dado que SQLite y PostgreSQL tienen tipos de datos ligeramente diferentes (especialmente en el manejo de UUIDs y fechas), Prisma se encargará de la abstracción, pero se validará que los tipos generados sean los correctos.

## Riesgos / Trade-offs

- **[Riesgo]** Incompatibilidad de tipos de datos específicos entre SQLite y PostgreSQL.
  - **Mitigación**: Ejecutar la suite completa de tests de integración para detectar fallos en consultas o inserciones.
- **[Riesgo]** Latencia de red al usar una base de datos remota en tests.
  - **Mitigación**: Se recomienda usar una base de datos local de PostgreSQL (Docker) para tests rápidos si la latencia es un problema, o configurar un entorno de staging en Supabase.
- **[Trade-off]** Mayor complejidad en la configuración inicial comparado con el archivo único de SQLite.
  - **Mitigación**: Documentar claramente los pasos de configuración en el `README` o `GEMINI.md`.

## Plan de Migración

1. Modificar `backend/prisma/schema.prisma`.
2. Actualizar `.env` con la `DATABASE_URL` de Supabase.
3. Ejecutar `npx prisma migrate dev --name init_postgres` para crear la estructura inicial en Supabase.
4. Ejecutar el script de sembrado (`npm run db:seed`) para verificar la inserción de datos.
5. Ejecutar los tests de integración (`npm run test:integration`).
