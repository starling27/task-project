# 🧠 ORCHESTRATOR.md

## 🎯 Purpose

Coordinate execution of development tasks using sub-agents based on SDD specifications.

---

## ⚙️ Execution Flow

1. Load context:
   - AGENTS.md
   - ARCHITECTURE.md
   - specs/

2. Run Planner Agent
3. Run Reviewer Agent
4. Approve plan

5. Execute phases:
   - Spec refinement
   - Code generation
   - Validation

---

## 🤖 Agents

### Planner Agent
Creates structured execution plan

### Reviewer Agent
Analyzes and improves architecture

### Spec Agents
Refine and validate specs

### Code Agents
Generate implementation

### QA Agent
Run tests and validate behavior

---

## 🔄 Task Delegation

Each task must include:

- objective
- input files
- expected output
- validation criteria

---

## 📊 Execution Rules

- Tasks must be atomic
- Each phase must be validated before next
- Failures must trigger retry or fix agent

---

## 🚀 Success Criteria

- All specs validated
- Code generated successfully
- Tests passing
- Jira integration working