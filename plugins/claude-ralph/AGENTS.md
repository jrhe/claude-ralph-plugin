# Ralph Agent Instructions

Ralph is an autonomous AI agent loop that runs Claude Code repeatedly until all PRD items are complete. Each iteration is a fresh Claude instance with clean context.

## Commands

```bash
# Run Ralph (from project with prd.json)
./ralph.sh [max_iterations]

# Example: run up to 20 iterations
./ralph.sh 20

# Generate a PRD (invoke skill)
/prd

# Convert PRD to JSON (invoke skill)
/ralph
```

## Key Files

| File | Purpose |
|------|---------|
| `ralph.sh` | Bash loop that spawns fresh Claude instances |
| `prompt.md` | Instructions given to each Claude iteration |
| `prd.json` | Task list with completion status |
| `prd.json.example` | Example PRD format |
| `progress.txt` | Append-only learnings log |

## How It Works

```
┌─────────────────────────────────────────────────┐
│                  ralph.sh                        │
│                                                  │
│  for i in 1..max_iterations:                    │
│    ┌─────────────────────────────────────────┐  │
│    │         Fresh Claude Instance           │  │
│    │                                         │  │
│    │  1. Read prd.json, progress.txt        │  │
│    │  2. Select highest-priority story      │  │
│    │  3. Implement story                    │  │
│    │  4. Run quality checks                 │  │
│    │  5. Commit if passing                  │  │
│    │  6. Update prd.json, progress.txt      │  │
│    │  7. Output <promise>COMPLETE</promise> │  │
│    │     if all stories done                │  │
│    └─────────────────────────────────────────┘  │
│                                                  │
│  if COMPLETE detected: exit 0                   │
│  if max iterations: exit 1                      │
└─────────────────────────────────────────────────┘
```

## Workflow

### 1. Generate PRD
Use the `/prd` skill to create a detailed requirements document through guided questions.

### 2. Convert to JSON
Use the `/ralph` skill to convert the markdown PRD to structured `prd.json`.

### 3. Create Branch
```bash
git checkout -b ralph/your-feature-name
```

### 4. Run Ralph
```bash
./ralph.sh 20
```

### 5. Monitor Progress
```bash
# Check story status
cat prd.json | jq '.userStories[] | {id, title, passes}'

# Read learnings
cat progress.txt

# View git history
git log --oneline -10
```

## Patterns

### Memory Persistence
Context persists between iterations via:
- Git history (code changes)
- `progress.txt` (learnings and patterns)
- `prd.json` (task status)
- `AGENTS.md` files (discovered patterns)

### Story Sizing
Stories should be completable in one context window:
- Add a database column
- Create one UI component
- Add one API endpoint
- Fix a specific bug

NOT: "Build entire feature" or "Refactor everything"

### Quality Gates
Every story must pass before commit:
- Typecheck (`npm run typecheck` or `npx tsc --noEmit`)
- Linting (`npm run lint`)
- Tests (`npm test`)
- Build (`npm run build`)

### Documentation Updates
Update AGENTS.md with reusable patterns:
- Module-specific conventions
- API patterns
- Testing approaches
- Common gotchas

## Debugging

```bash
# Check iteration count
grep -c "^## Iteration" progress.txt

# See which stories are done
jq '.userStories | map({id, passes})' prd.json

# Review last iteration's work
git diff HEAD~1
```

## Learn More

- Original technique: https://ghuntley.com/ralph/
- Amp version: https://github.com/snarktank/ralph
