# 📦 jira-integration.spec

context:
  name: Integración con Jira vía MCP
  description: Sincroniza el backlog local con Jira usando el protocolo MCP

integration:
  type: external
  provider: jira
  protocol: MCP

config:

  required:
    - jiraBaseUrl
    - projectKey
    - authToken

  optional:
    - defaultIssueTypeMapping
    - statusMapping

mappings:

  issueType:

    story: Story
    bug: Bug
    task: Task

  priority:

    low: Low
    medium: Medium
    high: High
    critical: Highest

  status:

    unassigned: To Do
    assigned: To Do
    in_progress: In Progress
    blocked: Blocked
    in_pr_review: In Review
    pr_approved: Done
    integrated: Done

  hierarchy:

    epic: parent
    story: child

use_cases:

  - name: Sincronizar Project a Jira
    description: Crea el Project en Jira si no existe

  - name: Sincronizar Epic a Jira
    input:
      projectId: uuid
    output:
      jiraEpics: []

  - name: Sincronizar Story a Jira
    input:
      epicId: uuid
    output:
      jiraIssues: []

  - name: Sincronizar backlog completo
    input:
      projectId: uuid
    output:
      synced: boolean

  - name: Actualizar issue de Jira desde local
    input:
      storyId: uuid
    output:
      updated: boolean

  - name: Sincronizar Jira a local (pull)
    input:
      projectKey: string
    output:
      localUpdated: boolean

rules:

  - name: Solo se pueden sincronizar stories listas
    type: business
    validation: status in ['assigned','in_progress','in_pr_review','pr_approved','integrated']

  - name: Epic debe existir en Jira antes de sincronizar Story
    type: dependency
    validation: ensureEpicSynced(epicId)

  - name: Evitar issues duplicadas en Jira
    type: business
    validation: notExists(jiraIssueKey)

  - name: Mantener idempotencia
    type: system
    validation: safeRetry(syncOperation)

transforms:

  story_to_jira:

    fields:
      summary: title
      description: description
      issuetype: mapped(type)
      priority: mapped(priority)

    customFields:
      acceptanceCriteria: acceptanceCriteria
      storyPoints: storyPoints

  epic_to_jira:

    fields:
      summary: name
      description: description
      issuetype: Epic

sync_flow:

  push:

    steps:

      - validateStoriesReady
      - groupByEpic
      - createOrSyncEpics
      - createOrSyncStories
      - linkStoriesToEpics
      - updateLocalWithJiraKeys

  pull:

    steps:

      - fetchJiraIssues
      - mapToLocalEntities
      - updateLocalDB

error_handling:

  strategies:

    - retry_on_failure
    - partial_sync_allowed
    - log_failed_items
    - continue_on_error

  errors:

    - auth_error
    - network_error
    - validation_error
    - jira_api_limit

api:

  basePath: /jira

  endpoints:

    - method: POST
      path: /sync/project/:projectId
      use_case: Sync Full Backlog

    - method: POST
      path: /sync/story/:storyId
      use_case: Update Jira Issue from Local

    - method: POST
      path: /pull
      use_case: Sync Jira to Local

tests:

  unit:

    - name: Debe mapear Story al formato Jira
      given:
        title: "Login"
      expect:
        summary: "Login"

    - name: Debe mapear priority correctamente
      given:
        priority: high
      expect:
        jiraPriority: High

    - name: Debe impedir sincronizar stories no listas
      given:
        status: draft
      expect:
        error: "Story not ready"

  integration:

    - name: Sincronizar backlog completo
      steps:
        - createProject
        - createEpic
        - createStory
        - markStoryReady
        - syncToJira
      expect:
        synced: true

    - name: Asegurar que Epic se cree antes que Story
      steps:
        - createEpic
        - createStory
        - syncToJira
      expect:
        epicLinked: true

    - name: Pull desde Jira actualiza local
      steps:
        - pullFromJira
      expect:
        localUpdated: true

    - name: Reintentar en fallo
      steps:
        - simulateNetworkError
        - syncToJira
      expect:
        retried: true
