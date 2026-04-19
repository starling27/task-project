## 1. Preparación y Configuración

- [ ] 1.1 Modificar `backend/prisma/schema.prisma` para cambiar el `provider` de `sqlite` a `postgresql`.
- [ ] 1.2 Actualizar el archivo `.env` del backend con la nueva `DATABASE_URL` de Supabase.
- [ ] 1.3 Verificar que el `schema.prisma` no contenga tipos de datos incompatibles con PostgreSQL.

## 2. Inicialización de Base de Datos

- [ ] 2.1 Eliminar (o renombrar) la carpeta `backend/prisma/migrations` para generar una migración inicial limpia para PostgreSQL.
- [ ] 2.2 Ejecutar `npx prisma migrate dev --name init_postgres` desde el directorio `backend` para inicializar Supabase.
- [ ] 2.3 Ejecutar el script de sembrado para poblar la base de datos: `npx prisma db seed` (desde `backend`).

## 3. Validación y Pruebas

- [ ] 3.1 Ejecutar los tests de integración existentes: `npm run test` en el directorio `backend`.
- [ ] 3.2 Modificar los tests si hay alguna aserción específica que falle debido a diferencias sutiles entre SQLite y Postgres (ej. ordenamiento por defecto).
- [ ] 3.3 Validar el inicio del servidor backend: `npm run dev` (desde `backend`).
- [ ] 3.4 Confirmar la persistencia mediante una petición manual de creación de entidad.
