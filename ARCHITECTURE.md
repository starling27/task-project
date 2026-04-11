# 🏗️ ARCHITECTURE.md

---

## 🎯 Architecture Overview

This system follows a modular, scalable, and event-driven full-stack architecture designed for backlog management and Jira integration.

### Key principles:

- Modular design (domain-driven)
- Event-driven processing
- Decoupled integrations
- Async-first architecture
- Optimistic UI experience

---

## 🧱 High-Level Architecture

Frontend (React)
   ↓
Backend API (Node.js)
   ↓
Database (PostgreSQL)

Event Layer:
   → Internal Events Bus
   → Queue System (JiraSyncQueue)

External Integration:
   ↔ Jira MCP

---

## 🖥️ Frontend Architecture

### Tech Stack

- React (Vite)
- Zustand (state management)
- TanStack Query (server sync)
- Tailwind CSS

---

### UI Strategy

- Single-page backlog view
- Accordion-based interaction
- Inline editing (no modals)
- Optimistic updates

---

### Component Structure


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

### UI Data Sources

| Feature | Endpoint |
|--------|--------|
| Stories | /stories |
| Comments | /comments |
| Workflow | /workflow |
| History | /history |
| Assignees | /users |

---

## ⚙️ Backend Architecture

### Tech Stack

- Node.js
- Framework: Fastify (recommended)
- ORM: Prisma
- Queue: BullMQ / RabbitMQ (optional)

---

### Module Structure


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

## 🗄️ Data Model (Refactored)

### Core Entities

- Project
- Epic
- Story

---

### Supporting Entities

- Comment → collaboration layer
- WorkflowState → dynamic workflow definition
- StatusHistory → audit trail
- AssigneeHistory → assignment tracking

---

### Integration Entity

- JiraSyncQueue → async processing layer

---

### Relationships


Project
└── Epic
└── Story
├── Comment[]
├── StatusHistory[]
├── AssigneeHistory[]
└── JiraSyncQueue[]


---

## 🔄 Event-Driven Architecture

### Events

- StoryCreated
- StoryUpdated
- StatusChanged
- CommentAdded
- StoryAssigned

---

### Flow


User Action
↓
API Update
↓
Event Emitted
↓
Queue (JiraSyncQueue)
↓
Worker
↓
Jira MCP


---

## 🔌 Jira Integration (Advanced)

### Characteristics

- Async synchronization
- Retry mechanism with backoff
- Idempotent operations
- Event-triggered sync

---

### Flow

1. Story updated
2. Event emitted
3. Added to queue
4. Worker processes queue
5. Sends data to Jira MCP
6. Updates local state

---

### Queue Model

| Field | Purpose |
|------|--------|
| storyId | Reference |
| action | create/update |
| status | pending/failed/success |
| retries | retry count |

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
