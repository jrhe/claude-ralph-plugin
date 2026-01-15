---
description: Generate a Product Requirements Document (PRD) through guided questions
---

# PRD Generator

Generate structured Product Requirements Documents through collaborative dialogue.

## Process

### Step 1: Clarifying Questions

Ask 3-5 essential questions to understand the feature. Use lettered options (A, B, C, D) when possible.

**Question categories:**
1. **Problem/Goal**: What problem does this solve? What's the desired outcome?
2. **Core Functionality**: What are the must-have features vs nice-to-have?
3. **Scope**: What's explicitly out of scope?
4. **Success Criteria**: How will we know when it's done?
5. **Technical Context**: Any constraints, existing patterns, or dependencies?

Ask ONE question at a time. Wait for the answer before asking the next.

### Step 2: Generate PRD

After gathering answers, generate a PRD with this structure:

```markdown
# [Feature Name] PRD

## Introduction
Brief overview of the feature and why it's needed.

## Goals
- Primary goal
- Secondary goals

## User Stories

### US-001: [Story Title]
**As a** [user type]
**I want** [capability]
**So that** [benefit]

**Acceptance Criteria:**
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Typecheck passes

### US-002: [Next Story]
...

## Functional Requirements
- FR-1: Description
- FR-2: Description

## Non-Goals (Out of Scope)
- What we're explicitly NOT building

## Design Considerations
- UI/UX notes if applicable

## Technical Considerations
- Architecture notes
- Dependencies
- Patterns to follow

## Success Metrics
- How to measure success

## Open Questions
- Any unresolved items
```

### Step 3: Save PRD

Save the PRD to: `tasks/prd-[feature-name].md`

Use kebab-case for the filename (e.g., `prd-user-authentication.md`).

## User Story Guidelines

Each user story must:
1. Be completable in a single Claude context window
2. Follow "As a... I want... So that..." format
3. Have specific, verifiable acceptance criteria
4. Include "Typecheck passes" as a criterion
5. Include "Verify in browser" for any UI changes

**Size check**: If you can't describe the change in 2-3 sentences, it's too big. Split it.

**Good examples:**
- Add a database column
- Create a single UI component
- Add one API endpoint
- Update a form with new field

**Too big (split these):**
- Build entire authentication system
- Create complete dashboard
- Implement full CRUD for a resource

## Important

Do NOT begin implementation. Only create the PRD document.

After creating the PRD, tell the user:
> "PRD saved to `tasks/prd-[name].md`. Use `/ralph` to convert it to prd.json for autonomous execution."
