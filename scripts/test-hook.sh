#!/usr/bin/env bash
#
# Integration test for the pre-push version-bump hook. Creates throwaway
# git repositories, crafts commits, runs the hook, and asserts the
# resulting VERSION. The hook exits 1 when it bumps (by design, to stop
# the push), so this test checks VERSION, not the exit code. No -e for
# that reason.

set -uo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HOOK="$REPO_ROOT/.githooks/pre-push"

fail() { echo "FAIL: $1"; exit 1; }

setup_repo() {
  local start_version="$1" dir
  dir="$(mktemp -d)"
  cd "$dir" || exit 1
  git init -q
  git config user.email t@example.com
  git config user.name tester
  git config commit.gpgsign false
  mkdir -p .githooks
  cp "$HOOK" .githooks/pre-push
  chmod +x .githooks/pre-push
  echo "$start_version" > VERSION
  git add VERSION .githooks
  git commit -q -m "chore: init"
  echo "$dir"
}

run_hook() { bash .githooks/pre-push >/dev/null 2>&1; }

# feat -> minor
d="$(setup_repo 1.0.0)"; cd "$d"
git commit -q --allow-empty -m "feat: add a thing"
run_hook
[ "$(cat VERSION)" = "1.1.0" ] || fail "feat 1.0.0 -> 1.1.0, got $(cat VERSION)"

# fix -> patch
d="$(setup_repo 1.0.0)"; cd "$d"
git commit -q --allow-empty -m "fix: a bug"
run_hook
[ "$(cat VERSION)" = "1.0.1" ] || fail "fix 1.0.0 -> 1.0.1, got $(cat VERSION)"

# breaking -> major
d="$(setup_repo 1.2.3)"; cd "$d"
git commit -q --allow-empty -m "feat!: breaking change"
run_hook
[ "$(cat VERSION)" = "2.0.0" ] || fail "feat! 1.2.3 -> 2.0.0, got $(cat VERSION)"

# highest severity wins across the range
d="$(setup_repo 1.0.0)"; cd "$d"
git commit -q --allow-empty -m "fix: small"
git commit -q --allow-empty -m "feat: feature"
run_hook
[ "$(cat VERSION)" = "1.1.0" ] || fail "mixed fix+feat should bump minor, got $(cat VERSION)"

# no conventional type -> no bump
d="$(setup_repo 1.0.0)"; cd "$d"
git commit -q --allow-empty -m "docs: update readme"
run_hook
[ "$(cat VERSION)" = "1.0.0" ] || fail "docs should not bump, got $(cat VERSION)"

# idempotent: a second run after a release bump does not re-bump
d="$(setup_repo 1.0.0)"; cd "$d"
git commit -q --allow-empty -m "feat: x"
run_hook
run_hook
[ "$(cat VERSION)" = "1.1.0" ] || fail "second run should not re-bump, got $(cat VERSION)"

echo "hook test passed: bump logic correct for fix, feat, breaking, none, idempotent"
