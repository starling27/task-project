## Requerimientos AGREGADOS (ADDED Requirements)

### Requirement: Persistencia en Supabase PostgreSQL
El sistema DEBE persistir todos los datos de la aplicación en una instancia de base de datos PostgreSQL alojada en Supabase.

#### Scenario: Persistencia de datos exitosa
- **CUANDO** el sistema realiza una operación de guardado o actualización de una entidad (Proyecto, Épica, Historia, etc.)
- **ENTONCES** los datos DEBEN almacenarse correctamente en la base de datos de Supabase y estar disponibles para consultas posteriores.

### Requirement: Configuración de Conexión Segura
El sistema DEBE utilizar una cadena de conexión segura (DATABASE_URL) proporcionada a través de variables de entorno para conectarse a Supabase.

#### Scenario: Conexión establecida al inicio
- **CUANDO** el servidor de backend se inicia
- **ENTONCES** DEBE establecer una conexión exitosa con la base de datos remota antes de aceptar peticiones.

### Requirement: Compatibilidad de Esquema
El esquema de la base de datos en Supabase DEBE ser idéntico al definido en el archivo `schema.prisma`, asegurando la integridad referencial y las restricciones de datos.

#### Scenario: Migración de esquema exitosa
- **CUANDO** se ejecutan las migraciones de Prisma contra la base de datos de Supabase
- **ENTONCES** la estructura de la base de datos DEBE actualizarse sin pérdida de datos ni errores de sintaxis específicos de PostgreSQL.
