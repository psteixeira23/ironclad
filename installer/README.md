# Installer

`install.js` is a single cross-platform Node.js CLI, no dependencies, that
installs Ironclad's content and per-harness adapters. It runs identically
on macOS and Windows via `node install.js`.

## Running it

```bash
cd installer
node install.js
```

You will be prompted to choose which harness(es) to install for: Claude
Code, GitHub Copilot, OpenAI Codex, or all three.

## What it does

1. Copies this repository's `content/` directory to `~/.ironclad/content/`
   (created if missing, overwritten if present). This is the canonical
   shared copy every adapter's file-path references point to. Re-running
   the installer refreshes it.
2. Prompts for which harness(es) to install.
3. **Claude Code**: creates `~/.claude/skills/ironclad/`, writes
   `SKILL.md` from the adapter template, and copies every `content/*.md`
   file into that same folder.
4. **GitHub Copilot**: locates the user-level Copilot instructions file
   for the current OS and writes or updates it, wrapping Ironclad's
   contribution in `<!-- IRONCLAD START -->` / `<!-- IRONCLAD END -->`
   markers so re-running the installer replaces only that block and
   leaves the rest of the file untouched. See `adapters/copilot/README.md`
   for the current known limitation on this file's path.
5. **OpenAI Codex**: same demarcated-block approach against
   `~/.codex/AGENTS.md`, with a size check that warns if the Ironclad
   block would push the file near or past Codex's documented 32 KB
   instruction file cap.

The whole run is idempotent: running it again updates an existing install
in place instead of duplicating content.

At the end, it prints a summary of what was installed, where, and for
which harness(es), followed by a clear "✓ Ironclad installed
successfully." line.

## Files

- `install.js`: the CLI itself.
- `banner.txt`: the ASCII banner printed at startup, kept as plain text
  rather than embedded in `install.js` so it stays editable without
  touching code. If this file is missing, the installer falls back to
  the plain word "IRONCLAD" instead of failing.
- `package.json`: no runtime dependencies; only used so `npm install`
  has something valid to check.

## Notes

- No project-specific configuration is required; everything installs at
  the user's home-directory scope, so it applies across every project on
  the machine.
- If you only want to refresh the canonical content copy without
  touching any harness's install, run the installer and answer with no
  valid harness number (or interrupt after the content copy step);
  content is always copied first, before the harness prompt.
