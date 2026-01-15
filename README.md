# Claude Ralph Plugin

Autonomous AI agent loop for Claude Code, faithfully adapted from the [original Ralph](https://github.com/snarktank/ralph) for Amp.

Ralph runs Claude in a bash loop, spawning fresh instances until all PRD items are complete. Each iteration has clean context, with memory persisting through git history, progress logs, and task status.

## What is Ralph?

Ralph is the "Ralph Wiggum" coding technique - a simple `while true` loop that repeatedly runs an AI agent with the same prompt until the task is complete. As Geoffrey Huntley describes it: persistence wins.

**Key concept**: Each iteration sees its previous work through files and git history, creating a self-improving feedback loop.

## Installation

### Option 1: Clone into project
```bash
git clone https://github.com/jrhe/claude-ralph-plugin.git
cp claude-ralph-plugin/{ralph.sh,prompt.md,prd.json.example} ./
chmod +x ralph.sh
```

### Option 2: Claude Code plugin
```bash
claude plugins add github:jrhe/claude-ralph-plugin
```

## Quick Start

### 1. Generate a PRD
```bash
# In Claude Code, invoke the skill:
/prd
```

Answer the clarifying questions to generate a structured PRD.

### 2. Convert to JSON
```bash
/ralph
```

This converts your PRD markdown to `prd.json` format.

### 3. Create a branch
```bash
git checkout -b ralph/your-feature-name
```

### 4. Run Ralph
```bash
./ralph.sh 20  # Run up to 20 iterations
```

Claude will work through each user story until all pass or max iterations reached.

## How It Works

```
┌─────────────────────────────────────────────────────────┐
│                      ralph.sh                           │
│                                                         │
│   ┌─────────────────────────────────────────────────┐   │
│   │              Iteration 1                        │   │
│   │  claude -p "$(cat prompt.md)"                  │   │
│   │  → Implements US-001, commits, updates prd.json│   │
│   └─────────────────────────────────────────────────┘   │
│                         ↓                               │
│   ┌─────────────────────────────────────────────────┐   │
│   │              Iteration 2                        │   │
│   │  claude -p "$(cat prompt.md)"                  │   │
│   │  → Implements US-002, commits, updates prd.json│   │
│   └─────────────────────────────────────────────────┘   │
│                         ↓                               │
│                        ...                              │
│                         ↓                               │
│   ┌─────────────────────────────────────────────────┐   │
│   │              Iteration N                        │   │
│   │  All stories pass!                             │   │
│   │  → Outputs <promise>COMPLETE</promise>         │   │
│   └─────────────────────────────────────────────────┘   │
│                                                         │
│   EXIT SUCCESS                                          │
└─────────────────────────────────────────────────────────┘
```

## Files

| File | Description |
|------|-------------|
| `ralph.sh` | Main bash loop orchestrator |
| `prompt.md` | Instructions for each Claude iteration |
| `prd.json` | Task list with completion status |
| `prd.json.example` | Example PRD format |
| `progress.txt` | Append-only learnings log |
| `skills/prd/SKILL.md` | PRD generation skill |
| `skills/ralph/SKILL.md` | PRD-to-JSON conversion skill |

## PRD Format

```json
{
  "project": "MyApp",
  "branchName": "ralph/feature-name",
  "description": "Feature description",
  "userStories": [
    {
      "id": "US-001",
      "title": "Story title",
      "description": "As a user, I want...",
      "acceptanceCriteria": ["Criterion 1", "Typecheck passes"],
      "priority": 1,
      "passes": false,
      "notes": ""
    }
  ]
}
```

## Monitoring Progress

```bash
# Check story status
cat prd.json | jq '.userStories[] | {id, title, passes}'

# Read learnings from iterations
cat progress.txt

# View commits
git log --oneline -10
```

## Best Practices

### Story Sizing
Keep stories small - completable in one context window:
- Add a database column
- Create a single UI component
- Add one API endpoint
- Fix a specific bug

**NOT**: "Build entire dashboard" or "Implement full auth system"

### Dependency Order
Order stories so earlier ones don't depend on later:
1. Database/model changes
2. Backend/API logic
3. UI components
4. Integration views

### Quality Gates
Every story requires:
- Typecheck passes
- Lint passes
- Tests pass
- Build succeeds (if applicable)
- Browser verification (for UI changes)

## Dependencies

- `jq` - JSON processor (`brew install jq`)
- Claude Code CLI with `--dangerously-skip-permissions` support

## Differences from Original

| Aspect | Original (Amp) | This Plugin (Claude) |
|--------|----------------|---------------------|
| CLI | `amp --dangerously-allow-all` | `claude --dangerously-skip-permissions -p` |
| Platform | Amp | Claude Code |
| Skills | Amp skills format | Claude Code skills format |

## Credits

- Original Ralph technique: [Geoffrey Huntley](https://ghuntley.com/ralph/)
- Amp implementation: [snarktank/ralph](https://github.com/snarktank/ralph)

## License

MIT
