---
name: ralph
description: Convert a PRD markdown file to prd.json for Ralph autonomous execution
---

# Ralph PRD Converter

Convert Product Requirements Documents to structured JSON format for autonomous execution.

## Usage

When invoked, ask: "Which PRD file should I convert? (e.g., `tasks/prd-feature-name.md`)"

If no PRD files exist, suggest: "No PRD files found. Use `/prd` first to generate one."

## Conversion Process

### Step 1: Archive Existing PRD (if needed)

If `prd.json` exists and has a different `branchName`:
1. Create archive directory: `archive/YYYYMMDD-HHMMSS-<old-branch>/`
2. Move `prd.json` and `progress.txt` to archive
3. Inform user of archival

### Step 2: Extract User Stories

Parse the markdown PRD and extract:
- Project name (from title or filename)
- Feature description
- Each user story with acceptance criteria

### Step 3: Validate Story Size

Each story must be completable in ONE context window. Check:
- Can describe the change in 2-3 sentences
- Touches limited number of files
- Has clear, atomic scope

If a story is too big, split it and inform the user.

### Step 4: Order by Dependencies

Arrange stories so earlier ones don't depend on later ones:
1. Database/model changes first
2. Backend/API logic second
3. UI components third
4. Integration/aggregate views last

### Step 5: Generate prd.json

Create `prd.json` with this structure:

```json
{
  "project": "ProjectName",
  "branchName": "ralph/feature-name",
  "description": "Brief description of the feature",
  "userStories": [
    {
      "id": "US-001",
      "title": "Story title",
      "description": "As a [user], I want [feature] so that [benefit]",
      "acceptanceCriteria": [
        "First criterion",
        "Second criterion",
        "Typecheck passes"
      ],
      "priority": 1,
      "passes": false,
      "notes": ""
    }
  ]
}
```

### Required Fields

- **id**: Sequential (US-001, US-002, etc.)
- **title**: Short, descriptive title
- **description**: Full "As a... I want... So that..." statement
- **acceptanceCriteria**: Array of checkable criteria
- **priority**: Integer (1 = do first, higher = do later)
- **passes**: Boolean, always starts as `false`
- **notes**: Empty string, filled during execution

### Validation Rules

1. Every story MUST have "Typecheck passes" in acceptanceCriteria
2. UI stories MUST have "Verify in browser" in acceptanceCriteria
3. Stories must be ordered by dependency (priority reflects this)
4. Branch name must be kebab-case with `ralph/` prefix

## Output

After conversion:

1. Save to `prd.json`
2. Create/clear `progress.txt` with header
3. Suggest git branch creation

Tell the user:
```
PRD converted to prd.json with N user stories.

Next steps:
1. git checkout -b ralph/feature-name
2. Review prd.json and adjust if needed
3. Run: ./ralph.sh [max_iterations]

Example: ./ralph.sh 20
```

## Branch Naming

Generate branch name from feature:
- Prefix: `ralph/`
- Feature: kebab-case
- Examples:
  - `ralph/user-authentication`
  - `ralph/task-priority`
  - `ralph/api-rate-limiting`
