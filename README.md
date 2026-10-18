# Ironclad

![Ironclad logo](assets/ironclad-logo.png)

[![CI](https://github.com/psteixeira23/ironclad/actions/workflows/ci.yml/badge.svg)](https://github.com/psteixeira23/ironclad/actions/workflows/ci.yml)

Ironclad is a portable engineering governance toolkit for AI coding agents. It keeps a consistent set of architecture, security, testing, and process rules in one place, and installs a thin, harness-specific adapter for whichever AI coding tool you use, so the same standards apply everywhere without being rewritten per project or per tool.

## Why the name

An ironclad ship was armored to withstand what would sink an unprotected hull. The name is meant the same way here: a set of rules an AI coding agent cannot easily talk itself out of, sidestep under time pressure, or forget between sessions. The standards in `content/` exist so that architecture, security, and testing discipline hold up regardless of which project, which harness, or which conversation produced the code.

## Why this exists

An AI coding assistant is only as consistent as the instructions it is given. Left unguided across different projects and tools, it drifts: inconsistent architecture, insecure shortcuts, thin tests, and context wasted re-explaining the same standards every time.

Ironclad keeps the actual rules in one place, [`content/`](content/), and generates a small adapter per harness that imports from that single source instead of duplicating it. Update a rule once, every installed harness picks it up.

## What's inside

- **[`content/`](content/)**, the canonical engineering rules, one topic per file:

  | File                  | Covers                                                                                                                                        |
  | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
  | `language.md`         | English-only rule for all project content and output.                                                                                         |
  | `intensity.md`        | The three intensity levels (core, full, max) and how the active level is selected.                                                           |
  | `architecture.md`     | Layered architecture, dependency rule, SOLID.                                                                                                 |
  | `backend.md`          | Server-side validation, IDOR, mass assignment, error handling, sessions, passwords, CSRF, CORS, SSRF, path traversal, dynamic code execution. |
  | `frontend.md`         | XSS/output escaping, client-side storage, third-party script integrity, component structure.                                                  |
  | `database.md`         | Schema design, indexing, N+1 prevention, migrations, Row Level Security, preventing duplicate records under concurrency.                      |
  | `security.md`         | Pre-launch and ongoing security checklist.                                                                                                    |
  | `testing.md`          | TDD, test scope, fragile tests, the coverage floor.                                                                                           |
  | `debug.md`            | Systematic debugging, local and production incidents.                                                                                         |
  | `refactor.md`         | Behavior-preserving change, characterization tests for legacy code.                                                                           |
  | `commits.md`          | Conventional Commits format, message content and length.                                                                                      |
  | `observability.md`    | Instrumenting a system and detecting when something is wrong.                                                                                 |
  | `resilience.md`       | Timeouts, retries, idempotency, graceful degradation for outbound calls.                                                                      |
  | `lgpd.md`             | Personal data protection (LGPD, GDPR, or equivalent), with extra guidance when minors are among the project's users.                          |
  | `ai-usage-policy.md`  | Team accountability for AI-generated code, and how the assistant should operate.                                                              |
  | `review-checklist.md` | The full code review checklist.                                                                                                               |
  | `quality-gate.md`     | Automated pre-merge gate (compile/type + lint) that blocks undefined symbols and type errors, per stack.                                      |
  | `task-routing.md`     | Table mapping task type to which files to read.                                                                                               |

- **`adapters/`**, per-harness templates that reference `content/` rather than copying it.
- **`installer/`**, a cross-platform Node.js CLI that installs the adapters for the harness(es) you choose, at the global (machine-wide) scope, so they apply to every project on that machine.
- **`bin/ironclad`**, a small global command the installer places on your `PATH`, currently used to check the installed version (`ironclad --version`).
- **`VERSION`**, the single source of truth for the current version, bumped automatically by the `pre-push` git hook, see "Versioning" below.

## Supported harnesses

| Harness        | Status                                                                                                                                            |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Claude Code    | Tested: installs as a personal skill (`/ironclad`)                                                                                            |
| GitHub Copilot | Tested for always-on instructions; on-demand `/ironclad` invocation is limited to repository scope, see `adapters/copilot/README.md`           |
| OpenAI Codex   | Tested via global `AGENTS.md`; subject to a 32 KB instruction file limit, see `adapters/codex/README.md`                                       |

Installation is exercised in CI on Linux, macOS, and Windows, see "Testing" below.

## Getting started

```bash
git clone https://github.com/psteixeira23/ironclad.git
cd ironclad/installer
npm install
node install.js
```

The installer asks which harness(es) to set up and installs at the global scope. No project-specific configuration is required.

## Checking the installed version

```bash
ironclad --version
```

Reports the version currently installed on this machine (from `~/.ironclad/VERSION`, written by the installer), not necessarily whatever this repository's checkout currently has. Re-run the installer after pulling changes to update it.

## Intensity levels

Ironclad runs at one of three levels, set per project by an `.ironclad`
file at the project root (or per session with `/ironclad core|full|max`
on Claude Code), defaulting to `full`:

- `core`: the security floor plus only the single most task-specific
  file. Lowest token cost, for prototypes and throwaway work.
- `full` (default): the floor plus every file a task maps to. The
  standard behavior.
- `max`: everything `full` loads, plus the review checklist applied
  proactively and a mandatory coverage floor. For critical or
  personal-data work.

The security floor (`ai-usage-policy.md`, `language.md`, `security.md`,
and `lgpd.md` when personal data is involved) loads at every level; the
dial never trades away safety. See `content/intensity.md`.

## Testing

Two suites guard the mechanism:

- An installer smoke test runs the installer into an isolated home
  directory and asserts it lands the expected files for all three
  harnesses. Run it with `cd installer && npm test`.
- A hook test drives the `pre-push` version-bump logic through `fix`,
  `feat`, breaking, no-op, and idempotent cases. Run it with
  `bash scripts/test-hook.sh`.

Both run in CI on every push and pull request: the installer smoke test
on Linux, macOS, and Windows, the hook test on Linux and macOS.

## Versioning

Version bumps are automatic, based on Conventional Commits (see `content/commits.md`): a `fix` commit bumps the patch number, a `feat` commit bumps minor, and a breaking-change marker bumps major. This happens locally, in a `pre-push` git hook, not in CI.

One-time setup per machine or fresh clone:

```bash
chmod +x scripts/setup-git-hooks.sh .githooks/pre-push bin/ironclad
./scripts/setup-git-hooks.sh
```

The hook creates its own commit for the version bump and stops the first push so that commit is included; pushing a second time goes through normally.

## Author

**Patrick de Souza Teixeira**
Coordinator of Software Engineering

- LinkedIn: [linkedin.com/in/patrick-de-souza-teixeira](https://www.linkedin.com/in/patrick-de-souza-teixeira/)
- GitHub: [github.com/psteixeira23](https://github.com/psteixeira23)

## License

MIT, see [LICENSE](LICENSE).
