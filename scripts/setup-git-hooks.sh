#!/usr/bin/env bash
#
# One-time setup per machine/clone: points Git at the versioned hooks
# folder and makes the hook executable.

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"

git -C "$REPO_ROOT" config core.hooksPath .githooks
chmod +x "$REPO_ROOT/.githooks/pre-push"

echo "Git hooks configured. The pre-push hook will now bump VERSION"
echo "automatically based on Conventional Commit types."
