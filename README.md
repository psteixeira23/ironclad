# Ironclad

Ironclad is a portable engineering governance toolkit for AI coding agents. It keeps a consistent set of architecture, security, testing, and process rules in one place, and installs a thin, harness-specific adapter for whichever AI coding tool you use, so the same standards apply everywhere without being rewritten per project or per tool.

## Why the name

An ironclad ship was armored to withstand what would sink an unprotected hull. The name is meant the same way here: a set of rules an AI coding agent cannot easily talk itself out of, sidestep under time pressure, or forget between sessions. The standards in `content/` exist so that architecture, security, and testing discipline hold up regardless of which project, which harness, or which conversation produced the code.

## Why this exists

An AI coding assistant is only as consistent as the instructions it is given. Left unguided across different projects and tools, it drifts: inconsistent architecture, insecure shortcuts, thin tests, and context wasted re-explaining the same standards every time.

Ironclad keeps the actual rules in one place, [`content/`](content/), and generates a small adapter per harness that imports from that single source instead of duplicating it. Update a rule once, every installed harness picks it up.

## What's inside

- **[`content/`](content/)**, the canonical engineering rules, one topic per file:

  | File                  | Covers                                                                                                                   |
  | --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
  | `language.md`         | English-only rule for all project content and output.                                                                    |
  | `architecture.md`     | Layered architecture, dependency rule, SOLID.                                                                            |
  | `backend.md`          | Server-side validation, IDOR, mass assignment, error handling, sessions, passwords, SSRF, path traversal.                |
  | `database.md`         | Schema design, indexing, N+1 prevention, migrations, Row Level Security, preventing duplicate records under concurrency. |
  | `security.md`         | Pre-launch and ongoing security checklist.                                                                               |
  | `testing.md`          | TDD, test scope, fragile tests, the coverage floor.                                                                      |
  | `debug.md`            | Systematic debugging, local and production incidents.                                                                    |
  | `refactor.md`         | Behavior-preserving change, characterization tests for legacy code.                                                      |
  | `commits.md`          | Conventional Commits format, message content and length.                                                                 |
  | `observability.md`    | Instrumenting a system and detecting when something is wrong.                                                            |
  | `resilience.md`       | Timeouts, retries, idempotency, graceful degradation for outbound calls.                                                 |
  | `lgpd.md`             | Data protection for minors and guardians under LGPD.                                                                     |
  | `ai-usage-policy.md`  | Team accountability for AI-generated code, and how the assistant should operate.                                         |
  | `review-checklist.md` | The full code review checklist.                                                                                          |
  | `task-routing.md`     | Table mapping task type to which files to read.                                                                          |

- **`adapters/`**, per-harness templates that reference `content/` rather than copying it.
- **`installer/`**, a cross-platform Node.js CLI that installs the adapters for the harness(es) you choose, at the global (machine-wide) scope, so they apply to every project on that machine.
- **`bin/ironclad`**, a small global command the installer places on your `PATH`, currently used to check the installed version (`ironclad --version`).
- **`VERSION`**, the single source of truth for the current version, bumped automatically by the `pre-push` git hook, see "Versioning" below.

## Supported harnesses

| Harness        | Status                                                                                                                                            |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Claude Code    | Supported: installs as a personal skill (`/ironclad`)                                                                                             |
| GitHub Copilot | Supported for always-on instructions; on-demand `/ironclad` invocation is currently limited to repository scope, see `adapters/copilot/README.md` |
| OpenAI Codex   | Supported via global `AGENTS.md`; subject to a 32 KB instruction file limit, see `adapters/codex/README.md`                                       |

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
