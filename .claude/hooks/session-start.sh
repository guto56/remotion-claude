#!/bin/bash
set -euo pipefail

# Only needed in Claude Code on the web sessions.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

npm install

# Remotion downloads Chrome Headless Shell from remotion.media, which the
# cloud network allowlist blocks. Use the pre-installed one instead.
BROWSER=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
if [ -x "$BROWSER" ] && [ -n "${CLAUDE_ENV_FILE:-}" ]; then
  echo "export REMOTION_BROWSER_EXECUTABLE=\"$BROWSER\"" >> "$CLAUDE_ENV_FILE"
fi
