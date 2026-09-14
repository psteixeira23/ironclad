# Testing

## Process

- **TDD**: write the failing test before the implementation for new
  logic (red, green, refactor). Trivial glue code with no branching logic
  is the only exception.
- Fixing a bug starts with a test that reproduces it, then the fix makes
  that test pass. A bug fix without a reproducing test does not prove the
  bug is fixed, and does nothing to stop it from coming back.

## What a test should verify

- Tests validate behavior, not implementation. A test should still pass
  after a valid internal refactor that does not change behavior.
- Fragile tests: a test that breaks on a valid refactor because it
  asserts on implementation details (private method calls, internal
  field names, call order that does not matter) instead of observable
  behavior is a defect in the test, not a sign the refactor was wrong.
- Test quality is not the same as coverage. A test that passes regardless
  of whether the underlying logic is correct, a false positive, is worse
  than no test at all, because it hides risk while appearing to reduce
  it.
- Misuse of mocking or test doubles: over-mocking to the point a test no
  longer verifies real behavior, mocking something that should be a real
  fast unit (a pure function has no reason to be mocked), or a mock that
  has drifted from the real interface it replaces and would not catch a
  breaking change to that interface.

## Test scope

- Unit tests for domain and use case logic do not hit a real database,
  network, or filesystem. Use fakes or mocks at the boundary, see
  `architecture.md` for what "the boundary" means in this project's
  layering.
- Integration tests are a separate suite and may hit real infrastructure,
  but must not be the only tests covering business rules. Business logic
  needs fast, isolated unit coverage in addition to integration coverage.

## Minimum coverage floor: 95%.

This is a floor, not a target to optimize toward. Treat any test written
to close a coverage gap with the same scrutiny as any other test: it must
actually fail if the logic it covers is wrong. A high coverage number
produced by shallow, assertion-free tests is a worse outcome than a lower
number produced by tests that genuinely verify behavior. When coverage
and test quality conflict, quality wins, and that conflict itself is
worth flagging rather than resolving silently in favor of the number.

Related: `architecture.md`, `review-checklist.md`, `ai-usage-policy.md`.
