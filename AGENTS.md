# 🧠 AGENTS.md

## 🎯 System Overview

This system is a backlog management panel that allows users to:
- Manage projects
- Define epics and user stories
- Organize sprint backlogs
- Visualize data using accordion UI
- Sync backlog to Jira via MCP

---

## 🤖 Agents Definition

### 1. Project Manager Agent
**Responsibility:**
- Create, update, delete projects
- Maintain project metadata

**Inputs:**
- Project name
- Description

**Outputs:**
- Project entity

---

### 2. Epic Agent
**Responsibility:**
- Create and manage epics inside a project

**Inputs:**
- Project ID
- Epic name
- Description

**Outputs:**
- Epic entity

---

### 3. Story Agent
**Responsibility:**
- Manage user stories inside epics

**Inputs:**
- Epic ID
- Title
- Description
- Acceptance criteria

**Outputs:**
- Story entity

---

### 4. Sprint Agent
**Responsibility:**
- Organize stories into sprint backlogs

**Inputs:**
- Sprint name
- Story IDs

**Outputs:**
- Sprint backlog

---

### 5. Jira Sync Agent
**Responsibility:**
- Transform backlog into Jira issues
- Communicate with Jira MCP

**Inputs:**
- Stories
- Epics
- Sprint data

**Outputs:**
- Jira tickets created

---

### 6. UI Agent
**Responsibility:**
- Represent hierarchical data in accordion format

**Structure:**
Project
 └── Epics
      └── Stories
           └── Sprint Assignment

---

## 🔄 Agent Interaction Flow

1. Project Manager creates project
2. Epic Agent adds epics
3. Story Agent adds stories
4. Sprint Agent groups stories
5. UI Agent renders structure
6. Jira Sync Agent exports to Jira

---

## 📌 Constraints

- All entities must be relational
- UI must support accordion navigation
- Jira integration must be optional and async

---

## 🚀 Future Considerations

- Permissions per user
- Real-time collaboration
- AI-assisted backlog generation