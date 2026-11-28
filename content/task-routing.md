# Task Routing

Before starting a task, read the files this table points to. Always read
`ai-usage-policy.md` and `language.md` regardless of task type, they apply
to everything.

## Intensity

The active intensity level (see `intensity.md`) decides how many of the
files below actually load for a task. `ai-usage-policy.md`,
`language.md`, and `security.md`, plus `lgpd.md` whenever the project
handles personal data, always load, at every level. At `core` (the
default), read only the single most task-specific file from the
matching row. At `full`, read every file the matching row points to. At
`max`, also read
`review-checklist.md` and treat the coverage floor in `testing.md` as
mandatory. The level filters this table's output, it does not replace it.

| Task type                                                                                                | Read                                     |
| -------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| Planning or aligning on a non-trivial task before writing code                                           | plan.md, ai-usage-policy.md              |
| API or backend implementation                                                                            | architecture.md, backend.md, testing.md  |
| Frontend, UI, or rendering-layer work                                                                    | architecture.md, frontend.md             |
| Database or query work                                                                                   | architecture.md, database.md, testing.md |
| Concurrency, locking, or code that can run more than once at the same time                               | concurrency.md, database.md              |
| Authentication or security-sensitive work                                                                | architecture.md, security.md             |
| Writing or fixing tests                                                                                  | architecture.md, testing.md              |
| Debugging an issue or a production incident                                                              | debug.md, testing.md                     |
| Refactoring existing code                                                                                | refactor.md, testing.md, architecture.md |
| Writing a commit message                                                                                 | commits.md                               |
| Logging or monitoring                                                                                    | observability.md                         |
| External integration (email, SMS, calendar, or similar)                                                  | backend.md, resilience.md                |
| Anything touching personal data (student/guardian data, or any other personal data this project handles) | lgpd.md, security.md                     |
| Code review                                                                                              | review-checklist.md                      |
| Setting up or changing a quality gate, CI check, or commit hook                                          | quality-gate.md                          |
