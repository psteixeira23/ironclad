# Review Checklist

Checked during code review, and by `/ironclad review` against the
current diff or recently changed files.

## Correctness and logic

- Wrong or inconsistent logic relative to the stated business rule.
- Missing validation on inputs, especially at trust boundaries.
- Weak exception handling.
- Unexpected side effects, see `backend.md`.
- Null or nil risks: dereferencing a value that could be absent without a
  guard.
- Misuse of optional or nullable wrapper types (`Optional`, `Maybe`,
  `T | None`): using them as a substitute for proper validation,
  unwrapping without checking, or overusing them where a plain required
  value would be clearer.

## Structure and complexity

- Unnecessary complexity; prefer the simplest solution that correctly
  handles the real requirement.
- Duplicated logic that should be a shared function or module. A second
  occurrence is worth watching, a third is a strong signal the helper is
  missing.
- Large functions or methods: if a function needs a comment to explain a
  section in the middle of it, that section is probably a function of
  its own.
- High coupling between modules that should be independent.
- Misplaced responsibility: logic living in the wrong layer or the wrong
  class, see `architecture.md`.
- Violation of layer boundaries, see `architecture.md`.
- Poor package or module organization.
- Unused imports, variables, or dead branches left behind by the change
  being reviewed.

## Comments and naming

- Bad naming that does not say what something is or does.
- Unnecessary comments, or comments that only restate what the code
  already says. A comment should explain why, not narrate what.

## Tests

- Missing or weak tests on business-critical logic.
- Fragile tests, see `testing.md`.
- Test quality beyond pass or fail, see `testing.md`.
- Misuse of mocking or test doubles, see `testing.md`.

## Data access and performance

- Unnecessary database calls that could be batched, cached, or avoided.
- N+1 query patterns, see `database.md` for the example.
- Blocking calls inside async or concurrent flows: a synchronous database
  or HTTP call inside an async function blocks the event loop or thread.

## Concurrency

- Thread safety: shared mutable state accessed by more than one
  concurrent execution unit without protection.
- Race conditions: outcome depends on timing between concurrent
  operations. The classic case is check-then-act without atomicity, for
  example checking a record does not exist, then inserting it, without a
  unique constraint or transaction backing that up.
- Inadequate synchronization: missing locks where shared state is
  modified, or synchronization so broad it defeats the point of
  concurrency.
- Deadlocks: two or more concurrent units waiting on each other's locks
  in a cycle. Inconsistent lock acquisition order across the codebase is
  the most common cause.
- Misuse of lightweight concurrency units (Java Virtual Threads, Go
  goroutines, Python `asyncio` tasks, Node's event loop): spawning an
  unbounded number without a limit, or not handling cancellation or
  cleanup on failure.
- Misuse of async or future composition (Java `CompletableFuture`,
  JavaScript `Promise`, Python `asyncio.Future` or `gather`, Kotlin
  coroutines): unhandled rejected results, fire-and-forget where the
  outcome matters, or blocking synchronously on an async result.

## API and security surface

- Path traversal, see `backend.md`.
- Everything in `security.md`, applied to the specific change under
  review, not the whole codebase at once.

## Review priorities

When trade-offs are unavoidable, weigh in this order: correctness and
business rule consistency first, then security, then performance, then
SOLID and Clean Architecture adherence, then maintainability and
readability. Do not sacrifice correctness or security for a cleaner
abstraction, and do not over-engineer a simple problem in the name of
SOLID; simplicity itself is part of maintainability.

Related: every other file in `content/`, this file is the synthesis point.
