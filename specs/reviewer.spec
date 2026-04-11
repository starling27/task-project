# 📦 reviewer.spec

context:
  name: Architecture Reviewer
  description: Analyzes specifications and architecture to detect issues, propose improvements, and enforce best practices

mode: aggressive

inputs:

  - AGENTS.md
  - ARCHITECTURE.md
  - specs/*.spec

outputs:

  - reviewReport
  - improvementProposals
  - refactorSuggestions

entity:

  name: ReviewFinding
  fields:

    id:
      type: uuid

    type:
      type: string
      enum: [bug, risk, improvement, refactor]

    severity:
      type: string
      enum: [low, medium, high, critical]

    area:
      type: string
      enum: [architecture, backend, frontend, integration, data, ux]

    description:
      type: string

    recommendation:
      type: string

    affectedFiles:
      type: array

---

use_cases:

  - name: Review Architecture
    input:
      architecture: file
    output:
      findings: ReviewFinding[]

  - name: Review Specs Consistency
    input:
      specs: list
    output:
      findings: ReviewFinding[]

  - name: Suggest Improvements
    input:
      findings: list
    output:
      proposals: list

  - name: Generate Refactor Plan
    input:
      findings: list
    output:
      refactorPlan: list

---

rules:

  - name: Must detect missing relations
    type: system
    validation: detectOrphanEntities(specs)

  - name: Must detect duplicated logic
    type: system
    validation: detectDuplication(specs)

  - name: Must detect tight coupling
    type: architecture
    validation: detectCoupling(architecture)

  - name: Must detect missing validations
    type: system
    validation: missingValidations(specs)

  - name: Must detect scalability risks
    type: architecture
    validation: detectScalabilityIssues(architecture)

---

analysis_dimensions:

  - data_consistency
  - modularity
  - scalability
  - performance
  - maintainability
  - ux_coherence
  - integration_resilience

---

improvement_patterns:

  - name: Extract Entity
    description: Move embedded fields into separate entity

  - name: Introduce Queue
    description: Add async processing layer

  - name: Normalize Data
    description: Remove duplicated data

  - name: Add Caching Layer
    description: Improve performance

  - name: Introduce Event-Driven Flow
    description: Decouple services

---

example_findings:

  - id: f1
    type: improvement
    severity: high
    area: data
    description: "Story observations stored as plain text"
    recommendation: "Extract observations into Comment entity"
    affectedFiles: [story.spec]

  - id: f2
    type: risk
    severity: critical
    area: integration
    description: "Jira sync without retry mechanism"
    recommendation: "Introduce retry queue with exponential backoff"
    affectedFiles: [jira-integration.spec]

  - id: f3
    type: improvement
    severity: medium
    area: ux
    description: "Accordion may re-render all items"
    recommendation: "Implement virtual scrolling"
    affectedFiles: [ui-accordion.spec]

---

refactor_strategies:

  - name: incremental
    description: Small safe improvements

  - name: structural
    description: Medium architectural changes

  - name: disruptive
    description: Major redesign

---

tests:

  unit:

    - name: Should detect missing relations
      given:
        specs: incomplete
      expect:
        findings: "> 0"

    - name: Should classify severity correctly
      given:
        issue: critical
      expect:
        severity: critical

    - name: Should propose improvements
      given:
        findings: list
      expect:
        proposalsGenerated: true

  integration:

    - name: Full system review
      steps:
        - loadSpecs
        - analyze
      expect:
        findingsGenerated: true

    - name: Generate refactor plan
      steps:
        - analyze
        - suggestImprovements
      expect:
        refactorPlanCreated: true