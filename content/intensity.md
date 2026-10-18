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
`backend.md`, `frontend.md`, `database.md`, `testing.md`, `debug.md`,
`refactor.md`, `commits.md`, `observability.md`, `resilience.md`,
`review-checklist.md`.

## Levels

**`core`:** the always-on floor, plus only the single most task-specific
adjustable file from the matching `task-routing.md` row (for an API task,
`backend.md` without its `architecture.md` companion). Lowest token cost.
Intended for prototypes, throwaway scripts, and spikes, where loading the
full standard is disproportionate. The reduced architectural guidance is
a deliberate trade-off of this level, not an oversight, so do not select
`core` for code heading to production.

**`full`** (default): the always-on floor, plus every adjustable file the
matching `task-routing.md` row or rows point to. This is the standard
behavior and the right default for ordinary application work.

**`max`:** everything `full` reads, plus `review-checklist.md` applied
proactively rather than only on an explicit review request, and the
minimum coverage floor in `testing.md` treated as mandatory rather than a
default to revisit. Intended for security-sensitive, personal-data, or
otherwise critical work.

## How the level is selected

Precedence, highest first:

1. An explicit `/ironclad core`, `/ironclad full`, or `/ironclad max`
   given this session.
2. An `.ironclad` file at the project root, whose first non-empty,
   non-comment line names the level (`core`, `full`, or `max`). This
   fixes the level for the whole project, so a critical project can be
   set to `max` once and stay there. Lines beginning with `#` are
   comments.
3. The built-in default, `full`, when neither of the above is present.

An unrecognized value falls back to `full`, the safe middle, rather than
silently guessing a level.

## Relationship to task routing

The level does not replace `task-routing.md`, it filters its output.
Routing still decides which files a task maps to; the level decides how
many of the adjustable ones in that mapping actually load. The floor is
added on top in every case.

Related: `task-routing.md`, `ai-usage-policy.md`, `testing.md`,
`review-checklist.md`.
