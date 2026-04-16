---
name: spec-reader
description: >
  Use this skill whenever the user provides a specification file (.md) and asks
  to create a plan, task list, or begin implementation. Also activate when a
  subagent is about to implement a feature and a spec document exists in the
  project. This skill enforces a strict reading protocol to ensure NO requirement
  is skipped — especially business logic rules and UI/UX details.
---

# Spec Reader

This skill enforces a disciplined, step-by-step protocol for reading and
processing specification documents before planning or implementing anything.
It exists because agents tend to skip business logic details and UX specifics
when jumping straight into implementation.

---

## Core Rule

**Never write a single line of code or a single task in a plan until the full
spec has been read and all requirements have been catalogued.**

---

## Step 1 — Full read (no skimming)

Read the entire spec file from top to bottom. Do not stop to implement or plan
mid-read. Your only goal in this step is to understand the full scope.

While reading, look for these patterns regardless of how the spec is structured:

- Explicit requirements ("the system must...", "users should be able to...")
- Implicit requirements hidden in examples or diagrams
- Conditional logic ("if X then Y", "when Z happens...")
- Business rules (pricing, permissions, validations, calculations)
- UI/UX details (layout, behavior on interaction, error states, empty states,
  loading states, responsive behavior)
- Integrations with other systems or services
- Edge cases (what happens with empty input, invalid data, concurrent actions)
- Non-functional requirements (performance, security, accessibility)

---

## Step 2 — Build the requirement catalogue

After reading the full spec, produce a structured catalogue using this format.
Do not skip any category even if empty — write "none identified" instead.

```
## Requirement Catalogue

### Functional requirements
- [REQ-F-01] <description>
- [REQ-F-02] <description>

### Business logic rules
- [REQ-B-01] <description>  ← HIGH PRIORITY — these are commonly skipped
- [REQ-B-02] <description>

### UI / UX details
- [REQ-U-01] <description>  ← HIGH PRIORITY — these are commonly skipped
- [REQ-U-02] <description>

### Integrations
- [REQ-I-01] <description>

### Edge cases & validations
- [REQ-E-01] <description>

### Non-functional
- [REQ-N-01] <description>

### Ambiguous or unclear
- [REQ-?-01] <description> → needs clarification before implementation
```

---

## Step 3 — Flag ambiguities before proceeding

If any requirement in the catalogue is marked `REQ-?`, stop and ask the user
for clarification. Do not assume. Do not proceed with a guess.

List all ambiguities clearly and wait for answers before moving to Step 4.

---

## Step 4 — Choose mode

### Planning mode

Activated when the user asks for a plan, task list, tickets, or roadmap.

1. Group requirements into logical implementation phases.
2. For each task in the plan, include a `Covers:` field that references the
   relevant requirement IDs from the catalogue.
3. Order tasks so that business logic and data model tasks come before UI tasks.
4. Flag any task that depends on an ambiguous requirement.

Example task format:
```
### Task: Implement pricing calculation
Covers: REQ-B-01, REQ-B-02, REQ-E-03
Priority: High
Description: Build the calculatePrice() function following the business rules
in the spec. Must handle the discount tiers defined in REQ-B-02 and the
edge case of zero-quantity orders in REQ-E-03.
```

### Implementation mode

Activated when a subagent is implementing a feature from an existing plan or
spec.

1. Before writing any code, print the implementation checklist (see Step 5).
2. Implement the feature.
3. After implementation, go through the checklist item by item and confirm
   each one is covered. Do not mark a session complete until every item is
   checked or explicitly deferred with a reason.

---

## Step 5 — Implementation checklist

Use this checklist before closing any implementation session. Go through every
item. If something is not implemented, either implement it now or write a
clear TODO with the requirement ID.

```
## Implementation checklist for [feature name]

### Business logic
- [ ] [REQ-B-xx] <rule> — implemented in <file/function>
- [ ] All conditional branches from the spec are handled

### UI / UX
- [ ] [REQ-U-xx] <detail> — implemented in <component>
- [ ] Error states shown to user (not just console errors)
- [ ] Loading/pending states handled
- [ ] Empty states handled
- [ ] Responsive behavior matches spec

### Validations & edge cases
- [ ] [REQ-E-xx] <case> — handled in <location>
- [ ] Invalid inputs rejected with appropriate feedback

### Integrations
- [ ] [REQ-I-xx] <integration> — connected and tested

### Non-functional
- [ ] [REQ-N-xx] <requirement> — verified

### Coverage summary
Total requirements from spec: X
Implemented this session: X
Deferred (with reason): X
Blocked (pending clarification): X
```

---

## Step 6 — Coverage report

At the end of a planning or implementation session, produce a one-line summary:

```
Coverage: X/Y requirements addressed | Deferred: Z | Blocked: W
```

If any business logic or UX requirement is deferred without explicit user
approval, flag it as a risk.

---

## References

Consult the files in the `references/` directory for:
- `reading-protocol.md` — quick reminder card for the reading protocol
- `checklist-template.md` — blank checklist to copy into new sessions (in assets/)
