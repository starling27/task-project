# 🧠 AGENTS.md

## 🎯 Resumen Del Sistema

Este sistema es un panel de gestión de backlog que permite a los usuarios:
- Gestionar proyectos
- Definir epics e historias de usuario
- Organizar backlogs
- Visualizar datos usando una UI tipo acordeón
- Sincronizar el backlog con Jira vía MCP

---

## 🤖 Definición De Agentes

### 1. Project Manager Agent
**Responsabilidad:**
- Crear, actualizar y eliminar proyectos
- Mantener la metadata del proyecto

**Entradas:**
- Nombre del proyecto
- Descripción

**Salidas:**
- Entidad `Project`

---

### 2. Epic Agent
**Responsabilidad:**
- Crear y gestionar epics dentro de un proyecto

**Entradas:**
- `projectId`
- Nombre del epic
- Descripción

**Salidas:**
- Entidad `Epic`

---

### 3. Story Agent
**Responsabilidad:**
- Gestionar historias de usuario dentro de epics

**Entradas:**
- `epicId`
- Título
- Descripción
- Criterios de aceptación

**Salidas:**
- Entidad `Story`

---

### 4. Jira Sync Agent
**Responsabilidad:**
- Transformar el backlog en issues de Jira
- Comunicar con Jira MCP

**Entradas:**
- `Story[]`
- `Epic[]`

**Salidas:**
- Tickets de Jira creados

---

### 5. UI Agent
**Responsabilidad:**
- Representar datos jerárquicos en formato acordeón

**Structure:**
Project
 └── Epics
      └── Stories

---

## 🔄 Flujo De Interacción Entre Agentes

1. Project Manager Agent crea el proyecto
2. Epic Agent agrega epics
3. Story Agent agrega historias
4. UI Agent renderiza la estructura
5. Jira Sync Agent exporta a Jira

---

## 📌 Restricciones

- Todas las entidades deben ser relacionales
- La UI debe soportar navegación tipo acordeón
- La integración con Jira debe ser opcional y asíncrona

---

## 🚀 Consideraciones Futuras

- Permisos por usuario
- Colaboración en tiempo real
- Generación asistida por IA del backlog
