---
description: Update ralph.sh and prompt.md in current project from the plugin
allowed-tools: Bash
---

# Update Ralph Scripts

Copying latest ralph.sh and prompt.md from the installed plugin...

```!
PLUGIN_DIR=$(ls -d ~/.claude/plugins/cache/claude-ralph-plugin/ralph/*/ 2>/dev/null | sort -V | tail -1)

if [[ -z "$PLUGIN_DIR" ]]; then
    echo "ERROR: Plugin not found."
    echo "Install with: claude plugin marketplace add jrhe/claude-ralph-plugin && claude plugin install ralph"
    exit 1
fi

VERSION=$(basename "$PLUGIN_DIR")
cp "$PLUGIN_DIR/ralph.sh" ./
cp "$PLUGIN_DIR/prompt.md" ./
chmod +x ./ralph.sh

echo "Updated from plugin version $VERSION"
echo ""
echo "Files updated:"
echo "  - ./ralph.sh"
echo "  - ./prompt.md"
echo ""
echo "Run ./ralph.sh to start the loop."
```
