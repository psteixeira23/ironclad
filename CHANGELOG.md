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

## 2026-10-31 (time not captured)

**Author:** Patrick de Souza Teixeira

### Added

- `content/plan.md`: new topic. A planning and alignment protocol run
  before coding on a non-trivial task: resolve ambiguity by asking one
  question at a time, resolve the requirement, acceptance criteria, seam,
  data shape, and non-goals, then write a short plan (files, approach,
  trade-off, test strategy, non-goals) and wait for an explicit go-ahead.
  Does not run for clear, low-risk changes. This turns the confirmation
  protocol, previously only described in `ai-usage-policy.md`, into an
  explicit, invokable step.
- `adapters/claude/SKILL.md.template`: a `/ironclad plan` command that
  runs the protocol on demand, the `plan` topic argument, the `plan.md`
  index row, and a note in the auto-invocation path to plan before coding
  when the confirmation protocol applies.

### Changed

- `content/ai-usage-policy.md`: the confirmation protocol now points to
  `plan.md` for how to align before coding.
- `content/task-routing.md`: added a planning row, listed first.
- `adapters/copilot/instructions.md.template` and
  `adapters/codex/AGENTS.md.template`: added the planning routing row and
  a condensed note pointing to `plan.md`.
- `README.md`: added the `plan.md` index row.
- Committed as `feat`, which bumps the minor version (1.2.0 to 1.3.0) via
  the `pre-push` hook. `VERSION` was not edited by hand.

## 2026-10-18 01:06 (America/Sao_Paulo)

**Author:** Patrick de Souza Teixeira

### Added

- `installer/test/smoke.test.js`: installer smoke test. Runs the
  interactive installer (feeding "4" to select all harnesses) into an
  isolated temporary home directory and asserts it lands the canonical
  content, the Claude skill, the `bin` command, and the Codex and Copilot
  files, at the correct per-platform paths. No test framework, plain
  `node:assert`.
- `scripts/test-hook.sh`: integration test for the `pre-push`
  version-bump hook, covering `fix`, `feat`, breaking, no-op, and
  idempotent cases against throwaway git repositories.
- `.github/workflows/ci.yml`: CI running the smoke test on Linux, macOS,
  and Windows, and the hook test on Linux and macOS, on every push to
  `main` and every pull request.
- `SECURITY.md`: vulnerability reporting policy via GitHub private
  reporting, with scope.
- `CONTRIBUTING.md`: the single-source-of-truth rule, the content-versus-
  mechanism review bars, Conventional Commit requirement, and how to run
  the tests.

### Changed

- `installer/package.json`: added a `test` script running the smoke test.
- `README.md`: harness matrix changed from "Supported" to "Tested" for
  all three harnesses (manually validated on each, plus Windows), added a
  CI badge, and added a "Testing" section.
- This is project infrastructure and documentation, committed as `ci:`,
  which does not bump the product version. `VERSION` was not edited.

## 2026-10-18 00:48 (America/Sao_Paulo)

**Author:** Patrick de Souza Teixeira

### Added

- `content/quality-gate.md`: new file. A language-agnostic guide to an
  automated pre-merge verification gate, the layer that enforces what the
  advisory rules only ask for. States the two guarantees a gate must give
  (no undefined symbol merges, no type error merges) and splits the
  approach by language class: in compiled, statically typed languages
  (Java, Kotlin, Go, Rust, C#) the build already enforces both for free,
  so only static analysis and tests are added; in dynamic languages
  (Python, JavaScript, Ruby, PHP) a type checker plus an
  undefined-reference linter must be added explicitly, with a per-
  ecosystem reference table. Covers where the gate runs (local hook for
  speed, CI for the guarantee) and its relationship to the grounding
  rule. The specific tools stay in each project's stack, not in Ironclad.
- `content/ai-usage-policy.md`: two new sections in Part 2. "Grounding
  and uncertainty" forbids referencing a function, method, flag, path, or
  API not confirmed to exist (verify against the real code or current
  docs, not memory), requires citing file and line for claims about the
  code, and permits saying "I need to check" instead of guessing.
  "Working economy" covers tool-use economy distinct from writing
  economy: read only the slice needed, do not re-read context, show diffs
  not reprints, and spend the saved effort on verification.

### Changed

- `content/task-routing.md`: added a row routing quality-gate, CI, and
  commit-hook setup to `quality-gate.md`.
- `adapters/claude/SKILL.md.template`: added the `quality-gate.md` index
  row and the `quality-gate` topic argument.
- `adapters/copilot/instructions.md.template` and
  `adapters/codex/AGENTS.md.template`: added condensed grounding and
  working-economy bullets to the inlined AI usage policy, and a routing
  row for the quality gate. Codex kept compact for the 32 KB cap.
- `adapters/claude/SKILL.md.template` and `README.md`: file index updated
  for the new topic.
- Committed as `feat`, which triggers a minor version bump via the
  `pre-push` hook on push. The resulting number depends on which `feat`
  commits are in the push range. `VERSION` was not edited by hand.

## 2026-10-17 16:53 (America/Sao_Paulo)

**Author:** Patrick de Souza Teixeira

### Added

- `content/intensity.md`: new file. Three intensity levels, `core`,
  `full` (default), and `max`, that control how much of the adjustable,
  craft-depth guidance loads for a task. The levels never drop the
  security floor (`ai-usage-policy.md`, `language.md`, `security.md`, and
  `lgpd.md` when personal data is involved), which loads at every level,
  so the dial trades token and attention cost against engineering depth,
  not safety. `core` loads the floor plus the single most task-specific
  file; `full` loads the floor plus every file a task maps to; `max`
  adds `review-checklist.md` proactively and makes the `testing.md`
  coverage floor mandatory.
- New `.ironclad` project-root file convention: its first non-empty,
  non-comment line fixes the intensity level for a whole project.
  Precedence is an explicit session command, then the `.ironclad` file,
  then the `full` default; an unrecognized value falls back to `full`.
- Claude adapter commands `/ironclad core`, `/ironclad full`, and
  `/ironclad max` to set the level per session, plus `/ironclad
  intensity` as a readable topic.

### Changed

- `content/task-routing.md`: added an `Intensity` section explaining that
  the active level filters the routing table's output and that the floor
  always loads. The table itself is unchanged.
- `adapters/claude/SKILL.md.template`: added a "Selecting the intensity
  level" section, the `intensity.md` index row, the `intensity` topic
  argument, and the level commands in `when_to_use`.
- `adapters/copilot/instructions.md.template` and
  `adapters/codex/AGENTS.md.template`: inlined the intensity rule, kept
  compact in the Codex adapter for the 32 KB cap.
- `README.md`: added the `intensity.md` index row and an "Intensity
  levels" section.
- Committed as `feat(intensity): ...`, which bumps the minor version
  (1.1.0 to 1.2.0) via the `pre-push` hook on push. `VERSION` was not
  edited by hand, to avoid a double bump.

## 2026-09-27 (time not captured)

**Author:** Patrick de Souza Teixeira

### Added

- `ROADMAP.md`: tracks pending work toward a public release, and a
  separate short list of ballet-school-specific operational follow-ups
  that do not belong in this repository's own roadmap.

## 2026-09-27 (time not captured)

**Author:** Patrick de Souza Teixeira

### Added

- `content/frontend.md`: new file, standards for client-side and
  rendering-layer implementation. Covers XSS/output escaping (never
  render unsanitized data via `dangerouslySetInnerHTML`, `innerHTML`,
  `v-html`, or equivalent; sanitize raw HTML through an allow-list
  sanitizer, never strip-tags or regex), third-party script integrity
  (Subresource Integrity hashes) and a ban on `eval()`/dynamic
  execution of external data, client-side storage rules (no secrets in
  `localStorage`/`sessionStorage`), and component structure guidance.
  Propagated into `content/task-routing.md`, `adapters/claude/
SKILL.md.template` (index and topic arguments), `adapters/copilot/
instructions.md.template`, `adapters/codex/AGENTS.md.template`, and
  `README.md`.

### Changed

- `content/security.md`: checklist expanded from 21 to 26 items, adding
  CSRF (item 22), XSS (item 23), CORS (item 24), Subresource Integrity
  (item 25), and dynamic code execution (item 26). `Related` line
  updated to include `frontend.md`.
- `content/backend.md`: added sections for CSRF (synchronizer token or
  double-submit pattern, `SameSite` alone called out as insufficient),
  CORS (explicit origin allow-list, never a wildcard combined with
  credentials), and dynamic code execution, covering the risk across
  multiple language ecosystems (`eval`/`exec` in Python, JavaScript, and
  Ruby; unrestricted deserialization in Python's `pickle`, PHP's
  `unserialize`, and Java's native `ObjectInputStream`; Java's JSR 223
  `ScriptEngine`, Spring Expression Language injection, and JNDI lookup
  injection, the mechanism behind Log4Shell).

## 2026-09-27 (time not captured)

**Author:** Patrick de Souza Teixeira

### Changed

Generalized content that had assumed this repository's original
project (a ballet school) as a universal fact instead of a
project-specific condition, found during a public-release readiness
review. This was a real gap: the project's own README describes
Ironclad as portable across any project, but four files baked in
assumptions specific to one, which would have given wrong guidance to
anyone installing this on a different kind of project.

- `content/lgpd.md`: reframed from asserting "this project's users are
  mostly minors" as fact, to a conditional structure, apply data
  protection principles appropriate to whatever jurisdiction and user
  base a given project actually has, with a clearly separated section
  for the extra guardian-consent and minimization rules that apply
  specifically when a project's users do include minors.
- `content/resilience.md`: reframed from asserting "this project does
  not process payments" as fact, to a conditional check: whether the
  heavier resilience patterns (circuit breakers, bulkheads, dead-letter
  queues) are warranted now depends on a given project's actual risk
  profile, not an assumption carried over from one project.
- `content/testing.md`: minimum coverage floor changed from a fixed
  95% for every project, to an explicit, project-specific floor with
  an 80% default when none has been set, 80% chosen as a widely
  recognized general baseline rather than a number picked for any one
  project's risk profile.
- `content/task-routing.md`, `content/ai-usage-policy.md`,
  `README.md`: generalized remaining "student or guardian" and
  "minors and guardians" language to "personal data (student/guardian
  data, or any other personal data this project handles)", keeping the
  concrete example while no longer stating it as the only case.
- `adapters/claude/SKILL.md.template`: generalized the frontmatter
  `description`, and corrected two index-table lines that had gone
  stale, `lgpd.md`'s description and `testing.md`'s reference to a
  fixed 95% floor.
- `adapters/copilot/instructions.md.template`,
  `adapters/codex/AGENTS.md.template`: generalized the same "student or
  guardian" language inlined in each adapter's own copy of these rules.

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
