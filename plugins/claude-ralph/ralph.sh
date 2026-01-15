#!/bin/bash

# Ralph: Autonomous AI Agent Loop for Claude Code
# Runs Claude repeatedly until all PRD items are complete.
# Each iteration spawns a fresh Claude instance with clean context.

set -e

# Configuration
# 0 = infinite (default, true to original Ralph spirit)
MAX_ITERATIONS=${1:-0}
PROMPT_FILE="prompt.md"
PRD_FILE="prd.json"
PROGRESS_FILE="progress.txt"
LAST_BRANCH_FILE=".last-branch"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}  Ralph: Autonomous AI Agent Loop${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""

# Check for required files
if [[ ! -f "$PROMPT_FILE" ]]; then
    echo -e "${RED}Error: $PROMPT_FILE not found${NC}"
    echo "Create prompt.md with instructions for each Claude iteration."
    exit 1
fi

if [[ ! -f "$PRD_FILE" ]]; then
    echo -e "${RED}Error: $PRD_FILE not found${NC}"
    echo "Create prd.json using the /ralph skill to convert your PRD."
    exit 1
fi

# Check for jq
if ! command -v jq &> /dev/null; then
    echo -e "${RED}Error: jq is required but not installed${NC}"
    echo "Install with: brew install jq"
    exit 1
fi

# Get current branch from prd.json
CURRENT_BRANCH=$(jq -r '.branchName' "$PRD_FILE")
echo -e "${YELLOW}Project:${NC} $(jq -r '.project' "$PRD_FILE")"
echo -e "${YELLOW}Branch:${NC} $CURRENT_BRANCH"
if [[ $MAX_ITERATIONS -eq 0 ]]; then
    echo -e "${YELLOW}Max iterations:${NC} infinite (Ctrl+C to stop)"
else
    echo -e "${YELLOW}Max iterations:${NC} $MAX_ITERATIONS"
fi
echo ""

# Handle branch change - archive previous run
if [[ -f "$LAST_BRANCH_FILE" ]]; then
    LAST_BRANCH=$(cat "$LAST_BRANCH_FILE")
    if [[ "$LAST_BRANCH" != "$CURRENT_BRANCH" ]]; then
        echo -e "${YELLOW}Branch changed from $LAST_BRANCH to $CURRENT_BRANCH${NC}"
        ARCHIVE_DIR="archive/$(date +%Y%m%d-%H%M%S)-$LAST_BRANCH"
        mkdir -p "$ARCHIVE_DIR"

        # Archive previous files if they exist
        [[ -f "$PROGRESS_FILE" ]] && mv "$PROGRESS_FILE" "$ARCHIVE_DIR/"

        echo -e "${GREEN}Archived previous run to $ARCHIVE_DIR${NC}"
        echo ""
    fi
fi

# Save current branch
echo "$CURRENT_BRANCH" > "$LAST_BRANCH_FILE"

# Initialize progress file if it doesn't exist
if [[ ! -f "$PROGRESS_FILE" ]]; then
    echo "# Progress Log" > "$PROGRESS_FILE"
    echo "" >> "$PROGRESS_FILE"
    echo "## Codebase Patterns" >> "$PROGRESS_FILE"
    echo "(Add discovered patterns here)" >> "$PROGRESS_FILE"
    echo "" >> "$PROGRESS_FILE"
    echo "---" >> "$PROGRESS_FILE"
    echo "" >> "$PROGRESS_FILE"
fi

# Main loop
i=1
while true; do
    # Set terminal title for iteration visibility
    if [[ $MAX_ITERATIONS -eq 0 ]]; then
        echo -ne "\033]0;Ralph - Iteration $i\007"
    else
        echo -ne "\033]0;Ralph - Iteration $i of $MAX_ITERATIONS\007"
    fi

    echo -e "${BLUE}======================================${NC}"
    if [[ $MAX_ITERATIONS -eq 0 ]]; then
        echo -e "${BLUE}  Iteration $i${NC}"
    else
        echo -e "${BLUE}  Iteration $i of $MAX_ITERATIONS${NC}"
    fi
    echo -e "${BLUE}======================================${NC}"
    echo ""

    # Show current story status
    echo -e "${YELLOW}Story Status:${NC}"
    jq -r '.userStories[] | "  \(.id): \(.title) - \(if .passes then "DONE" else "PENDING" end)"' "$PRD_FILE"
    echo ""

    # Run Claude with the prompt
    echo -e "${GREEN}Starting Claude...${NC}"
    echo ""

    # Capture output while streaming in real-time (tee to stderr)
    OUTPUT=$(claude --dangerously-skip-permissions -p "$(cat "$PROMPT_FILE")" 2>&1 | tee /dev/stderr) || true

    echo ""

    # Check for completion signal
    if echo "$OUTPUT" | grep -q "<promise>COMPLETE</promise>"; then
        echo ""
        echo -e "${GREEN}======================================${NC}"
        echo -e "${GREEN}  COMPLETE! All stories finished.${NC}"
        echo -e "${GREEN}======================================${NC}"
        exit 0
    fi

    # Check if max iterations reached (if not infinite)
    if [[ $MAX_ITERATIONS -gt 0 ]] && [[ $i -ge $MAX_ITERATIONS ]]; then
        echo ""
        echo -e "${RED}======================================${NC}"
        echo -e "${RED}  Max iterations ($MAX_ITERATIONS) reached${NC}"
        echo -e "${RED}  without completion signal.${NC}"
        echo -e "${RED}======================================${NC}"
        echo ""
        echo "Check progress.txt for learnings and prd.json for status."
        exit 1
    fi

    ((i++))
done
