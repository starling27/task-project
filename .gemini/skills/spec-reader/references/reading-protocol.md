# Reading protocol — quick reference

Use this as a reminder card. The full instructions are in SKILL.md.

## The 6 steps

1. **Full read** — read the entire spec, do not implement mid-read
2. **Catalogue** — extract ALL requirements into typed categories
3. **Clarify** — resolve ambiguities before writing code or plans
4. **Mode** — planning mode or implementation mode
5. **Checklist** — tick off every requirement before closing the session
6. **Report** — coverage summary at the end

## Categories that are most commonly skipped

### Business logic rules
Look for:
- Conditional branches ("if the user is X, then Y")
- Calculation formulas or pricing rules
- Permission or role restrictions
- State machine transitions
- Time-based rules (expiry, scheduling, deadlines)

### UI / UX details
Look for:
- Exact wording of labels, buttons, messages
- Behavior on hover, focus, click
- Error message text and placement
- Empty state visuals or messages
- Loading/skeleton states
- Responsive breakpoint behavior
- Animation or transition requirements
- Accessibility notes (ARIA, keyboard nav)

## Warning signs during implementation

If you catch yourself doing any of these, stop and re-read the spec:
- "I'll add that later"
- "The user probably meant..."
- "This edge case seems unlikely"
- Implementing the happy path only
- Copying the error handling from a similar feature without checking the spec
