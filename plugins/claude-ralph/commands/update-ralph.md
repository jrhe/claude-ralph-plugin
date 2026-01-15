---
description: Update ralph.sh and prompt.md in current project from the plugin
allowed-tools: Bash(cp:*, ls:*, chmod:*)
---

# Update Ralph Scripts

Copy the latest ralph.sh and prompt.md from the installed plugin to the current project.

## Steps

1. Find the plugin cache directory:
```bash
PLUGIN_DIR=$(ls -d ~/.claude/plugins/cache/claude-ralph-plugin/claude-ralph/*/ 2>/dev/null | sort -V | tail -1)
```

2. Check if plugin is installed:
- If `$PLUGIN_DIR` is empty, tell user: "Plugin not found. Install with: `claude plugin marketplace add jrhe/claude-ralph-plugin && claude plugin install claude-ralph`"

3. Copy files to current directory:
```bash
cp "$PLUGIN_DIR/ralph.sh" ./
cp "$PLUGIN_DIR/prompt.md" ./
chmod +x ./ralph.sh
```

4. Report what was updated:
- Show the version from the plugin directory name
- Confirm files copied successfully

## Output

Tell the user:
```
Updated ralph.sh and prompt.md from plugin version X.X.X

Files updated:
  - ./ralph.sh
  - ./prompt.md

Run ./ralph.sh to start the loop.
```
