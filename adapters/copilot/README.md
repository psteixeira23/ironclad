# GitHub Copilot adapter

This adapter installs Ironclad into the GitHub Copilot user-level
instructions file. The exact path for that file differs by OS and has
changed before; the installer resolves it at install time rather than
this adapter hardcoding one, see `installer/README.md`.

Because this file loads at a global scope with no fixed project structure
underneath it, `instructions.md.template` does not rely on an unverified
`@`-style relative import. Instead it inlines the full text of
`language.md` and a condensed version of `ai-usage-policy.md`, and
includes the full `task-routing.md` table with each row's "Read" column
pointing to the absolute path where the installer places the canonical
content (`~/.ironclad/content/`, see `installer/install.js`). An agent
with file-reading tools can act on an explicit absolute path even without
confirmed special import syntax at this scope.

The installer wraps this adapter's contribution in
`<!-- IRONCLAD START -->` / `<!-- IRONCLAD END -->` markers so re-running
it replaces only that block and leaves the rest of the user's
instructions file untouched.

## Known limitations

- On-demand `/ironclad <topic>` style invocation, as available in the
  Claude Code adapter, is repository-scoped in Copilot as far as this has
  been verified; the user-level instructions file installed by this
  adapter is always-on background context, not something invoked with an
  argument. If Copilot later supports an equivalent to Claude Code's
  argument-driven skill invocation at user scope, this adapter should be
  revisited.
- The exact file path for Copilot's user-level instructions differs by
  OS and has changed in the past.

## Where to check for updates

GitHub's official Copilot documentation for custom instructions is the
source of truth for the current file path per OS and for whether
scoped, on-demand invocation becomes available at user level. Check there
before changing this adapter's assumptions.
