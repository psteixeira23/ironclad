# Refactoring

Applies regardless of language or framework.

## Never mix refactoring with a behavior change

A refactor's diff should be behavior-preserving. If behavior genuinely needs to change, that is a separate change with its own tests, not something folded into the same commit or pull request as a refactor. Mixing the two makes both harder to review and impossible to revert independently.

## Test coverage comes first, always

Do not refactor code that is not covered by a test that would fail if the refactor broke it. If coverage already exists, it must still pass, unchanged, after the refactor, per the behavior-not-implementation rule in `testing.md`.

## Legacy code with no test coverage

This is common, not an edge case, and it needs its own step before anything else: write characterization tests first. A characterization test documents the code's actual current behavior, quirks included, without judging whether that behavior is correct. This creates a safety net that lets the refactor be verified as behavior-preserving, even for code nobody deliberately designed to behave the way it does.

If a bug is discovered while writing characterization tests, do not fix it in the same pass. Note it, and treat the fix as its own deliberate change with its own test, per the rule above.

## Small, reversible steps

Prefer a sequence of small refactors that each keep the code working over one large rewrite. Each step should be independently revertible. A refactor that cannot be paused halfway through without breaking things is a sign it should have been split further.

## Preserve the public interface unless that is the explicit goal

A refactor that changes a function's signature, a module's public API, or a service's contract is no longer purely a refactor. Treat it as the architectural-decision case in `ai-usage-policy.md`'s confirmation protocol, requiring a plan before proceeding.

## Mechanical refactors still need verification

A rename, a move, or an automated codemod across many files is not automatically safe just because it is mechanical. Run the actual test suite afterward. Static tooling can miss a dynamic reference, a string-based lookup, reflection, or a configuration file pointing at the old name.

## Stay inside the refactor's boundary

If duplication or complexity turns up while refactoring something else, fix it if it is the actual target of the task, otherwise follow the scope discipline in `ai-usage-policy.md`: note it as a suggestion rather than silently expanding the refactor.

## Related

- `testing.md` for what makes a test trustworthy enough to refactor against.
- `architecture.md` for what counts as a structural, not cosmetic, change.
- `ai-usage-policy.md` for the confirmation protocol and scope discipline.
- `review-checklist.md` for what a reviewer checks in a refactor-only change.
