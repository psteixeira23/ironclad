# Changelog

All notable changes are documented here, most recent entry first. Each
entry is dated and attributed to who made the change, so this file can
serve as a real history, not just a running list.

Timestamp note: dates and times below come from screenshot filenames and
the relative-time labels the chat interface showed at capture time, not
from invented values. Where the interface showed a rounded label ("an
hour ago," "2 hours ago"), the computed time is marked approximate.
Where no screenshot evidence exists for an entry, only the date is
given, inferred from the confirmed entries immediately around it.

## 2026-09-13 ~20:51 (from terminal clock, approximate)

**Author:** Patrick de Souza Teixeira

### Added

- `VERSION`: single source of truth for the current version, starts at
  `1.0.0`.
- `bin/ironclad`: new global CLI command, currently supports
  `--version`/`--v`/`-v`, reporting the version installed at
  `~/.ironclad/VERSION`.
- `.githooks/pre-push`: git hook that bumps `VERSION` automatically
  based on Conventional Commit types since the last version-bump commit
  (`fix` = patch, `feat` = minor, a breaking-change marker = major),
  creates its own commit for the bump, and stops the first push so that
  commit is included.
- `scripts/setup-git-hooks.sh`: one-time per-machine setup, points Git
  at `.githooks/` via `core.hooksPath` and makes the hook executable.

### Changed

- `installer/install.js`: now also copies `VERSION` to
  `~/.ironclad/VERSION`, and installs `bin/ironclad` onto the user's
  `PATH` (`~/.local/bin/ironclad` on macOS/Linux with executable
  permissions, `%LOCALAPPDATA%\Ironclad\bin\ironclad.cmd` plus a `.js`
  file on Windows), warning if that location is not already on `PATH`.
- `README.md` (root): documented `ironclad --version` and the one-time
  git hook setup, under new "Checking the installed version" and
  "Versioning" sections. Added `bin/` and `VERSION` to "What's inside".
- `content/commits.md`: added a "Commit type drives version bumps"
  section explaining that the commit type on the title line now decides
  the automatic version bump, not just documentation.

## 2026-09-13 20:11

**Author:** Patrick de Souza Teixeira

### Changed

- `installer/install.js`: added a clear "✓ Ironclad installed
  successfully." line at the end of a run (or a "nothing was installed"
  message if no harness was selected), and now prints an ASCII banner at
  startup by reading `installer/banner.txt` instead of embedding it as
  an escaped string in the source, with a plain-text "IRONCLAD" fallback
  if that file is missing.
- `installer/banner.txt`: new file, the ASCII banner as plain UTF-8
  text.
- `installer/README.md`: documented the success message and added a
  "Files" section listing `install.js`, `banner.txt`, and
  `package.json`.

## 2026-09-13 18:44

**Author:** Patrick de Souza Teixeira

### Changed

- `content/debug.md`: added a stop-criterion to the hypothesis-testing
  section, separate observed symptom from inferred cause, stop
  investigating once evidence is sufficient to name the exact cause.
- `content/ai-usage-policy.md`: Scope discipline now covers
  verification-only tasks explicitly, stop once the stated proof is
  complete, do not add polish or unrelated tests after criteria pass. A
  new "Writing economy" subsection instructs cutting filler, hedging,
  and redundant phrasing from all generated prose, while explicitly
  preserving the reasoning that explains why a rule exists.
- `content/architecture.md`: "Simplicity is part of the standard" now
  includes stating explicit non-goals before building new feature work.
- `content/review-checklist.md` and `content/security.md`: minor
  wording trims removing redundant phrasing, no rule content changed.
- `CHANGELOG.md` restructured from a single growing "Unreleased" block
  into dated, attributed entries, most recent first.

## 2026-09-13 ~18:35 (approximate)

**Author:** Patrick de Souza Teixeira

### Changed

- `README.md`: added a "Why the name" section, placed before "Why this
  exists."

## 2026-09-13 (time not captured)

**Author:** Patrick de Souza Teixeira

### Changed

- `README.md`: "What's inside" now lists all fifteen files in
  `content/` with a one-line description each, replacing a prose
  summary that had gone stale after later additions. Removed three em
  dashes left over from the original draft.

## 2026-09-13 ~18:30 (approximate)

**Author:** Patrick de Souza Teixeira

### Added

- `content/database.md`: a "Preventing duplicate records under
  concurrency" section covering unique constraints, atomic upserts
  (`INSERT ... ON CONFLICT`), idempotency keys for externally-triggered
  operations, and when `SERIALIZABLE` isolation is warranted instead of
  a constraint alone.

### Changed

- `content/observability.md` restructured around six responsibilities:
  Instrument, Measure, Correlate, Detect, and Reliability targets
  (Diagnose and Improve now live in `content/debug.md`, to avoid
  duplicating incident-response guidance across two files). Added
  percentile-over-average guidance, metric cardinality guidance, Golden
  Signals/RED/USE as situational lenses, and a conditional rule for
  when formal SLO/error-budget tracking is worth the overhead.

## 2026-09-13 ~17:35 (approximate)

**Author:** Patrick de Souza Teixeira

### Added

- Three new canonical topics: `content/debug.md` (debugging, local and
  production incidents), `content/refactor.md` (refactoring, including
  legacy code with no test coverage), and `content/commits.md` (commit
  message conventions: Conventional Commits, English, a one-line title,
  an objective four-line body). `content/task-routing.md` now routes to
  all three, propagated to every harness adapter: `adapters/claude/
SKILL.md.template` (index table and topic arguments), `adapters/
copilot/instructions.md.template` and `adapters/codex/
AGENTS.md.template` (inlined routing tables).

## 2026-09-12 (time not captured)

**Author:** Patrick de Souza Teixeira

### Fixed

- `adapters/claude/SKILL.md.template` treated automatic, self-invoked
  skill triggering the same as a user typing the bare `/ironclad`
  command, both paths showed the file index and stopped, so automatic
  invocation never actually read or applied any rule file. The template
  now separates the two cases: a bare `/ironclad` still shows the
  index, automatic invocation consults `task-routing.md` and reads
  every file the task matches.

## 2026-09-12 (time not captured)

**Author:** Patrick de Souza Teixeira

### Fixed

- `content/architecture.md` and `content/language.md` were silently
  rewritten during the initial build instead of being left as the
  pre-existing, already-correct files the build spec said they were.
  The rewrite of `architecture.md` dropped its SOLID section, even
  though `review-checklist.md` still references SOLID in its review
  priorities. Both files corrected to keep the useful additions
  introduced by the rewrite alongside the original content that was
  removed.
- Deleted stray duplicate copies of `architecture.md` and `language.md`
  left at the repository root; the only copies of these files that
  should exist are inside `content/`.

## 2026-09-12 (date inferred, time not captured)

**Author:** Patrick de Souza Teixeira

### Added

- Remaining `content/` standards: `backend.md`, `database.md`,
  `security.md`, `testing.md`, `observability.md`, `resilience.md`,
  `lgpd.md`, `ai-usage-policy.md`, `review-checklist.md`, and
  `task-routing.md`, completing the canonical rule set every adapter
  points to.
- `adapters/claude/`, `adapters/copilot/`, and `adapters/codex/`, each
  with its harness-specific template and a `README.md` covering usage
  and known limitations.
- `installer/install.js`: a dependency-free, cross-platform Node CLI
  that copies canonical content to `~/.ironclad/content/`, prompts for
  which harness(es) to install, writes the Claude Code skill, and
  upserts demarcated blocks into the Copilot and Codex global
  instruction files (idempotent on re-run), plus `installer/
package.json` and `installer/README.md`.

## 2026-09-12 (date inferred, time not captured)

**Author:** Patrick de Souza Teixeira

### Added

- Initial repository scaffold: `content/`, `adapters/`, `installer/`.
- `README.md`, `LICENSE` (MIT), and this changelog.
- `content/language.md` and `content/architecture.md` as the first
  canonical rule files.
