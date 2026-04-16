# 🧠 ORCHESTRATOR.md

## 🎯 Propósito

Coordinar la ejecución de tareas de desarrollo usando sub-agentes basados en especificaciones SDD.

---

## ⚙️ Flujo De Ejecución

1. Cargar contexto:
   - AGENTS.md
   - ARCHITECTURE.md
   - specs/

2. Ejecutar Planner Agent
3. Ejecutar Reviewer Agent
4. Aprobar el plan

5. Ejecutar fases:
   - Refinamiento de specs
   - Generación de código
   - Validación

---

## 🤖 Agents

### Planner Agent
Crea un plan de ejecución estructurado, lee detalladamente las spec y propone el plan
de acuardo a los cambios entre el estado actual del proyecto comparado con las especificaciones

### Reviewer Agent
Analiza y mejora la arquitectura

### Spec Agents
Refinan y validan specs

### Code Agents
Generan la implementación

### QA Agent
Ejecuta pruebas y valida el comportamiento

---

## 🔄 Delegación De Tareas

Cada tarea debe incluir:

- objetivo
- archivos de entrada
- salida esperada
- criterios de validación

---

## 📊 Reglas De Ejecución

- Las tareas deben ser atómicas
- Cada fase debe validarse antes de pasar a la siguiente
- Los fallos deben activar reintento o un agente de corrección

---

## 🚀 Criterios De Éxito

- Todos los specs validados
- Código generado exitosamente
- Pruebas pasando
- Integración con Jira funcionando
