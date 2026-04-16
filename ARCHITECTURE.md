# 🏗️ ARCHITECTURE.md

---

## 🎯 Resumen De Arquitectura

Este sistema sigue una arquitectura full-stack modular, escalable y orientada a eventos, diseñada para gestión de backlog e integración con Jira.

### Principios clave:

- Diseño modular (domain-driven)
- Procesamiento orientado a eventos
- Integraciones desacopladas
- Arquitectura "async-first"
- Experiencia de UI optimista
- principios solid
- arquitectura hexagonal

---

## 🧱 Arquitectura De Alto Nivel

Frontend (React)
   ↓
Backend API (Node.js)
   ↓
Database (sqlLite)

Capa de eventos:
   → Internal Events Bus
   → Queue System (JiraSyncQueue)

Integración externa:
   ↔ Jira MCP

---

## 🖥️ Arquitectura Frontend

### Stack tecnológico

- React (Vite)
- Zustand (gestión de estado)
- TanStack Query (sincronización con servidor)
- Tailwind CSS

---

### Estrategia de UI

- Vista de backlog en una sola página
- Interacción basada en acordeón
- Edición en línea (sin modales)
- Actualizaciones optimistas

---

### Estructura de componentes


/src
├── components/
│ ├── Accordion/
│ ├── StoryItem/
│ ├── CommentSection/
│ ├── StatusDropdown/
│ ├── AssigneeSelector/
│ └── Filters/
├── hooks/
├── services/
├── store/
└── pages/


---

### Fuentes de datos de UI

| Feature | Endpoint |
|--------|--------|
| Stories | /stories |
| Comments | /comments |
| Workflow | /workflow |
| History | /history |
| Assignees | /users |

---

## ⚙️ Arquitectura Backend

### Stack tecnológico

- Node.js
- Framework: Fastify (recomendado)
- ORM: Prisma
- Queue: BullMQ / RabbitMQ (optional)

---

### Estructura de módulos


/backend
├── modules/
│ ├── project/
│ ├── epic/
│ ├── story/
│ ├── comment/
│ ├── workflow/
│ ├── history/
│ ├── assignee/
│ └── jira/
├── events/
├── queue/
├── workers/
├── services/
├── controllers/
├── routes/
└── database/


---

## 🗄️ Modelo De Datos (Refactorizado)

### Entidades core

- Project (Soft Delete)
- Epic (Soft Delete)
- Story (Soft Delete)
- User (Soft Delete)

---

### Entidades de soporte

- Comment → capa de colaboración (Inmutable)
- WorkflowState → definición dinámica del workflow
- StatusHistory → auditoría
- AssigneeHistory → tracking de asignaciones

---

### Entidad de integración

- JiraSyncQueue → capa de procesamiento asíncrono

---

### Relaciones


Project
└── Epic
└── Story
├── Comment[]
├── StatusHistory[]
├── AssigneeHistory[]
└── JiraSyncQueue[]


---

## 🔄 Arquitectura Orientada A Eventos

### Events

- StoryCreated
- StoryUpdated
- StatusChanged
- CommentAdded
- StoryAssigned

---

### Flujo


Acción del usuario
↓
Actualización API
↓
Evento emitido
↓
Queue (JiraSyncQueue)
↓
Worker
↓
Jira MCP


---

## 🔌 Integración Con Jira (Avanzada)

### Características

- Sincronización asíncrona
- Reintentos con backoff
- Operaciones idempotentes
- Sincronización disparada por eventos

---

### Flow

1. Story se actualiza
2. Se emite un evento
3. Se agrega a la cola
4. El worker procesa la cola
5. Envía datos a Jira MCP
6. Actualiza el estado local

---

### Modelo de cola

| Field | Propósito |
|------|--------|
| storyId | Referencia |
| action | create/update |
| status | pending/failed/success |
| retries | contador de reintentos |

---

## ⚡ API Design

### Base Path


/api/v1


---

### Core Endpoints

| Module | Endpoint |
|--------|---------|
| Project | /projects |
| Epic | /epics |
| Story | /stories |
| Comment | /comments |
| Workflow | /workflow |
| History | /history |
| Jira | /jira |

---

## 🧠 State Management Strategy

### Frontend

### 🗄️ Database Setup
- Siempre que se cambie el `schema.prisma`, se debe ejecutar `npx prisma migrate dev`.
- El archivo `dev.db` está ignorado en git, por lo que en instalaciones nuevas es el primer paso obligatorio.
