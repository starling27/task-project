# 📦 planner.spec

context:
  name: Planning Engine
  description: Generates an execution plan by decomposing specifications into atomic tasks assignable to agents

inputs:

  - AGENTS.md
  - ARCHITECTURE.md
  - specs/*.spec

outputs:

  - executionPlan

entity:

  name: Task
  fields:

    id:
      type: uuid

    name:
      type: string

    description:
      type: string

    agent:
      type: string

    phase:
      type: string

    inputs:
      type: array

    outputs:
      type: array

    dependencies:
      type: array

    status:
      type: string
      enum: [pending, in_progress, completed, failed]

    validationCriteria:
      type: string

---

use_cases:

  - name: Generate Execution Plan
    input:
      specs: list
    output:
      plan: ExecutionPlan

  - name: Re-plan on Failure
    input:
      failedTaskId: uuid
    output:
      updatedPlan: ExecutionPlan

---

rules:

  - name: Tasks must be atomic
    type: system
    validation: maxComplexity(task) < threshold

  - name: Tasks must have clear inputs and outputs
    type: system
    validation: hasIO(task)

  - name: Tasks must declare dependencies
    type: system
    validation: explicitDependencies(task)

  - name: No circular dependencies allowed
    type: system
    validation: noCycles(plan)

---

planning_strategy:

  phases:

    - name: analysis
      agents: [planner, reviewer]

    - name: spec_refinement
      agents: [spec_agent]

    - name: backend_generation
      agents: [backend_agent, db_agent]

    - name: frontend_generation
      agents: [frontend_agent]

    - name: integration
      agents: [integration_agent]

    - name: validation
      agents: [qa_agent]

---

task_templates:

  - name: validate_spec
    agent: spec_agent
    inputs: [spec_file]
    outputs: [validated_spec]

  - name: generate_backend_module
    agent: backend_agent
    inputs: [spec_file, architecture]
    outputs: [controller, service, routes]

  - name: generate_db_schema
    agent: db_agent
    inputs: [spec_file]
    outputs: [schema]

  - name: generate_ui_component
    agent: frontend_agent
    inputs: [ui.spec]
    outputs: [react_component]

  - name: run_tests
    agent: qa_agent
    inputs: [codebase]
    outputs: [test_results]

---

plan_structure:

  format: hierarchical

  levels:

    - phase
    - tasks

---

example_output:

  phases:

    - name: spec_refinement
      tasks:

        - id: t1
          name: Validate project.spec
          agent: spec_agent
          inputs: [project.spec]
          outputs: [validated_project.spec]
          dependencies: []
          validationCriteria: "No schema errors"

        - id: t2
          name: Validate epic.spec
          agent: spec_agent
          inputs: [epic.spec]
          outputs: [validated_epic.spec]
          dependencies: [t1]
          validationCriteria: "Relations valid"

    - name: backend_generation
      tasks:

        - id: t3
          name: Generate project module
          agent: backend_agent
          inputs: [validated_project.spec, architecture.md]
          outputs: [project.module]
          dependencies: [t1]

---

tests:

  unit:

    - name: Should generate tasks for each spec
      given:
        specs: [project, epic]
      expect:
        tasksCount: "> 2"

    - name: Should assign correct agents
      given:
        task: generate_backend_module
      expect:
        agent: backend_agent

    - name: Should include dependencies
      given:
        tasks: multiple
      expect:
        dependenciesDefined: true

  integration:

    - name: Generate full plan from specs
      steps:
        - loadSpecs
        - generatePlan
      expect:
        phasesCreated: true

    - name: Re-plan after failure
      steps:
        - failTask
        - replan
      expect:
        newTasksCreated: true