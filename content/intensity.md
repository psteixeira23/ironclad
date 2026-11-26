# Intensity

Ironclad applies at one of three intensity levels. The level controls how
much of the adjustable, craft-depth guidance loads for a task. It never
removes the security floor: the dial trades thoroughness of engineering
guidance against token and attention cost, not safety.

## The two sets

**Always-on floor (never dropped, at any level):**

- `ai-usage-policy.md`
- `language.md`
- `security.md`
- `lgpd.md`, whenever the project handles personal data.

These load regardless of level. A lower intensity is never a reason to
skip security or data-protection rules.

**Adjustable depth (what the level acts on):** `architecture.md`,
`backend.md`, `frontend.md`, `database.md`, `concurrency.md`,
`testing.md`, `debug.md`, `refactor.md`, `commits.md`,
`observability.md`, `resilience.md`, `review-checklist.md`.

## Levels

**`core`** (default): the always-on floor, plus only the single most
task-specific adjustable file from the matching `task-routing.md` row
(for an API task, `backend.md` without its `architecture.md`
companion). Lowest token cost, and the right default for ordinary
application work: measured at `full` (the previous default) across
100 executions, this content set made no detectable difference to
quality (0.884 vs. 0.904 without it, p = 0.44) while doubling cost per
execution, because `full` loads 7 to 10 files per task where `core`
loads 1.

**`full`:** the always-on floor, plus every adjustable file the
matching `task-routing.md` row or rows point to. Select it deliberately
when a task's architectural surface is wide enough that the single
file `core` picks is not enough on its own.

**`max`:** everything `full` reads, plus `review-checklist.md` applied
proactively rather than only on an explicit review request, and the
minimum coverage floor in `testing.md` treated as mandatory rather than a
default to revisit. Intended for security-sensitive, personal-data, or
otherwise critical work.

## What the level changes in behavior

The level governs how the assistant works, not only which files load.

**`core`:** plan only when the requirement is genuinely ambiguous after
reading the code, or when the confirmation protocol in
`ai-usage-policy.md` requires it. Prefer assuming and stating over
asking, per the escalation order there. Do not apply the review
checklist proactively.

**`full`:** the behavior described across this content set, unchanged.

**`max`:** run the alignment protocol in `plan.md` for any non-trivial
task, apply `review-checklist.md` to your own output before reporting
completion, and treat the coverage floor in `testing.md` as mandatory.

What no level relaxes: the confirmation protocol for a schema change, a
destructive migration, a new dependency, a major version upgrade, or
anything else irreversible. Those hold at `core` exactly as they hold at
`max`. The dial trades thoroughness for speed, never safety.

## How the level is selected

Precedence, highest first:

1. An explicit `/ironclad core`, `/ironclad full`, or `/ironclad max`
   given this session.
2. An `.ironclad` file at the project root, whose first non-empty,
   non-comment line names the level (`core`, `full`, or `max`). This
   fixes the level for the whole project, so a critical project can be
   set to `max` once and stay there. Lines beginning with `#` are
   comments.
3. The built-in default, `core`, when neither of the above is present.

An unrecognized value falls back to the same default, `core`, rather
than silently guessing a level.

## Relationship to task routing

The level does not replace `task-routing.md`, it filters its output.
Routing still decides which files a task maps to; the level decides how
many of the adjustable ones in that mapping actually load. The floor is
added on top in every case.

Related: `task-routing.md`, `ai-usage-policy.md`, `testing.md`,
`review-checklist.md`.
