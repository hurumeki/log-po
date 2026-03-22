#!/bin/bash
set -euo pipefail

# Only run in remote (Claude Code on the web) environment
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

echo "=== SessionStart Hook ==="

# Install project dependencies
echo "Installing npm dependencies..."
cd "$CLAUDE_PROJECT_DIR"
npm install

# Install Playwright browsers required by @playwright/mcp
echo "Installing Playwright browsers..."
npx playwright install --with-deps chromium

echo "=== SessionStart Hook Complete ==="
