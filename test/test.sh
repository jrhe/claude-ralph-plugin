#!/bin/bash

# Ralph: Autonomous AI Agent Loop for Claude Code
# Runs Claude repeatedly until all PRD items are complete.
# Each iteration spawns a fresh Claude instance with clean context.

set -e

claude

echo $?
