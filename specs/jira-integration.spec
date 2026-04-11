# 📦 jira-integration.spec

context:
  name: Jira Integration via MCP
  description: Syncs local backlog with Jira using MCP protocol

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

  - name: Sync Project to Jira
    description: Creates Jira project if not exists

  - name: Sync Epics to Jira
    input:
      projectId: uuid
    output:
      jiraEpics: []

  - name: Sync Stories to Jira
    input:
      epicId: uuid
    output:
      jiraIssues: []

  - name: Sync Full Backlog
    input:
      projectId: uuid
    output:
      synced: boolean

  - name: Update Jira Issue from Local
    input:
      storyId: uuid
    output:
      updated: boolean

  - name: Sync Jira to Local (pull)
    input:
      projectKey: string
    output:
      localUpdated: boolean

rules:

  - name: Only ready stories can be synced
    type: business
    validation: status in ['assigned','in_progress','in_pr_review','pr_approved','integrated']

  - name: Epic must exist in Jira before stories
    type: dependency
    validation: ensureEpicSynced(epicId)

  - name: Avoid duplicate Jira issues
    type: business
    validation: notExists(jiraIssueKey)

  - name: Maintain idempotency
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

    - name: Should map story to Jira format
      given:
        title: "Login"
      expect:
        summary: "Login"

    - name: Should map priority correctly
      given:
        priority: high
      expect:
        jiraPriority: High

    - name: Should prevent syncing non-ready stories
      given:
        status: draft
      expect:
        error: "Story not ready"

  integration:

    - name: Sync full backlog
      steps:
        - createProject
        - createEpic
        - createStory
        - markStoryReady
        - syncToJira
      expect:
        synced: true

    - name: Ensure epic created before stories
      steps:
        - createEpic
        - createStory
        - syncToJira
      expect:
        epicLinked: true

    - name: Pull from Jira updates local
      steps:
        - pullFromJira
      expect:
        localUpdated: true

    - name: Retry on failure
      steps:
        - simulateNetworkError
        - syncToJira
      expect:
        retried: true