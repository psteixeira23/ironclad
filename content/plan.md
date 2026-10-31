# Planning and Alignment

The cheapest moment to catch a misunderstanding is before any code is
written. This file describes how to align on a task first, so the work
that follows builds the right thing instead of a plausible wrong thing.

## When to run this

Run the alignment protocol before coding whenever the confirmation
protocol in `ai-usage-policy.md` applies: a database schema change, a new
dependency, an architectural decision, removing or significantly
restructuring existing code, a major version upgrade, or any genuinely
ambiguous requirement. Also run it whenever the user invokes
`/ironclad plan`.

Do not run it for a task that is already clear and low-risk: a typo fix,
a missing test with an obvious shape, a small isolated function, or
formatting. Grilling someone over a trivial change is friction with no
payoff, and it trains them to ignore the protocol.

## How to question

- Ask one question at a time, and wait for the answer before the next.
  A batch of questions gets skimmed and half-answered; a single question
  gets a real answer.
- Ask only what changes the implementation. If a detail is low-stakes and
  easily reversible, state the assumption in one line instead of asking,
  per the assumptions rule in `ai-usage-policy.md`.
- Stop asking as soon as you have enough to proceed. The goal is
  alignment, not interrogation for its own sake.

## What to resolve before coding

- The actual requirement, stated back in your own words, and what "done"
  means for it (the acceptance criteria).
- The edge cases that would change the design, not every edge case.
- The seam: the interface or boundary the change sits behind, since that
  is what the tests will target, see `testing.md`.
- The data shape, when the task touches persisted or transferred data.
- The non-goals: what this change will deliberately not do, so scope does
  not drift mid-implementation.

## The plan

Once aligned, write a short plan before touching code:

- the files to be created or changed,
- the approach, in a few sentences,
- the main trade-off being made, if there is one,
- the test strategy (what proves it works),
- the non-goals.

Keep it short. A plan is a shared understanding to confirm, not a
document to admire.

## Then stop

Present the plan and wait for an explicit go-ahead before writing code.
That pause is the whole point: it is where a wrong direction gets
corrected while correcting it is still cheap. Once the plan is agreed, the
seam is agreed, which is exactly what sets up test-first work, see
`testing.md`.

Related: `ai-usage-policy.md`, `testing.md`, `architecture.md`,
`task-routing.md`.
