#!/bin/bash
set -e
#    set +e
claude --dangerously-skip-permissions "say hi"
exit_code=$?
#    set -e


