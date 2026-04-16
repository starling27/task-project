# ♊ GEMINI.md

## 🚀 Project Overview

**backlog-jira-sync-system** is a full-stack backlog management system designed for modularity and scalability. It features a modern React frontend and a robust Node.js backend, with built-in support for Jira synchronization via a dedicated worker process.

### Core Technologies
- **Frontend:** React 19, Vite, Zustand (State Management), Tailwind CSS.
- **Backend:** Node.js, Fastify, Prisma ORM (SQLite).
- **Communication:** REST API, Event-driven architecture for Jira sync.

---

## 🛠️ Building and Running

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Setup
1. **Install Dependencies:**
   ```bash
   npm install
   ```
2. **Database Initialization:**
   Prisma uses SQLite. Ensure the database is migrated before starting:
   ```bash
   npm run db:migrate
   ```
3. **Seeding (Optional):**
   ```bash
   npx prisma db seed
   ```

### Development
Start the entire system (Frontend, Backend, and Sync Worker) concurrently:
```bash
npm run dev
```

### Testing
Run integration tests:
```bash
npm run test:integration
```

---

## 📐 Architecture & Conventions

### Architectural Principles
- **Modular Design (DDD):** Logic is organized into domain-specific modules (Project, Epic, Story, etc.).
- **Hexagonal Architecture:** Separation of concerns between core logic and infrastructure.
- **Event-Oriented:** Story updates trigger events for asynchronous processing (e.g., Jira Sync).
- **Async-First:** Long-running tasks like Jira synchronization are handled by workers.

### Frontend Conventions
- **UI Strategy:** Single-page backlog with accordion-based navigation for hierarchical data (Project > Epic > Story).
- **Optimistic UI:** Updates are reflected immediately in the UI before server confirmation.
- **State Management:** Use `useBacklogStore` (Zustand) for global state.

### Backend Conventions
- **Soft Deletes:** Core entities (Project, Epic, Story, User) use `deletedAt` for soft deletion.
- **Audit Trails:** `StatusHistory` and `AssigneeHistory` track changes over time.
- **Integration:** The `JiraSyncQueue` manages the state of external synchronization tasks.

---

## 🤖 AI Orchestration

This project uses a structured multi-agent orchestration system defined in:
- `ORCHESTRATOR.md`: Defines the execution flow and agent roles (Planner, Reviewer, Code, QA).
- `AGENTS.md`: Outlines specific responsibilities for Project, Epic, Story, and Jira Sync agents.
- `specs/`: Contains detailed functional specifications for each module.

---

## 📂 Key Files
- `ARCHITECTURE.md`: In-depth architectural documentation.
- `prisma/schema.prisma`: Data model definition.
- `src/index.ts`: Backend entry point and route definitions.
- `src/store/useBacklogStore.ts`: Central frontend state and API interaction logic.
- `src/workers/jiraSyncWorker.ts`: Background process for Jira integration.
