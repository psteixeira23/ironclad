# Claude Code adapter

This adapter installs Ironclad as a Claude Code skill at
`~/.claude/skills/ironclad/`. The installer writes `SKILL.md` from
`SKILL.md.template` and copies every `content/*.md` file into that same
folder, since Claude Code skills support supporting files referenced by
relative markdown links from within the skill's own directory.

## Usage

- `/ironclad` with no argument shows a short index of the bundled content
  files and stops.
- `/ironclad backend` (or `database`, `security`, `testing`,
  `observability`, `resilience`, `lgpd`, `review`) reads the matching
  content file and applies it to the current task.
- `/ironclad review` reads `review-checklist.md` and applies it to the
  current diff or recently changed files.

`ai-usage-policy.md` and `language.md` are applied on every invocation
regardless of topic, since they are cross-cutting.

## Known limitations

None specific to this adapter at this time; Claude Code skills support
bundled supporting files and relative links natively, which is what this
adapter relies on.

## Where to check for updates

Claude Code's skill format (frontmatter fields, the skills directory
layout, and how supporting files are resolved) is documented in
Anthropic's Claude Code documentation. Check there before changing how
this adapter is structured, since the skill file format could evolve.
