# OpenAI Codex adapter

This adapter installs (merges) Ironclad into the global
`~/.codex/AGENTS.md` file. Same reasoning as the Copilot adapter: this
file does not depend on unverified import behavior at global scope.
`AGENTS.md.template` inlines `language.md` and a condensed version of
`ai-usage-policy.md`, and includes the `task-routing.md` table with
absolute paths to the canonical content location
(`~/.ironclad/content/`, see `installer/install.js`).

The installer wraps this adapter's contribution in
`<!-- IRONCLAD START -->` / `<!-- IRONCLAD END -->` markers so re-running
it replaces only that block and leaves the rest of the user's
`AGENTS.md` untouched.

## Known limitations

- Codex enforces a 32 KB cap on project-level `AGENTS.md` files and
  truncates silently past it. Whether the same cap applies to the global
  `~/.codex/AGENTS.md` has not been confirmed independently here; the
  installer checks the resulting file size and warns the user if the
  Ironclad block would push it near or past 32 KB regardless, rather than
  assuming the cap does or does not apply.
- Codex's support (or lack of support) for an import syntax at this
  global scope is unconfirmed. This adapter is written to work without
  depending on one.

## Where to check for updates

OpenAI's Codex documentation is the source of truth for the current size
cap and for global-scope `AGENTS.md` import support. Check there before
changing this adapter's size-handling or assumptions about how
`~/.codex/AGENTS.md` is loaded.
