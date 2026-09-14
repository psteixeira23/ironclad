# Debugging

Applies regardless of language or tooling.

## Reproduce before fixing

Do not attempt a fix until the issue reproduces reliably, on demand. If it cannot be reproduced yet, spend effort making it reproducible first, a fix for a bug you cannot trigger on demand is a guess, not a fix. This is the same principle behind the bug-fix rule in `testing.md`: a reproducing test comes before the change that resolves it.

## Form a hypothesis, then test it specifically

Change one variable at a time. Do not edit several unrelated things at once hoping one of them fixes it, that makes it impossible to know which change mattered, and often introduces a second problem on top of the first.

Separate the symptom you observed from the cause you are inferring, they are not the same thing until proven. Stop investigating as soon as the evidence is sufficient to name the exact cause, continuing to dig past that point burns time without adding certainty.

## Read the full error before acting

The most useful line in a stack trace or exception chain is often not the first line shown. Read the whole trace, including any "caused by" or wrapped exception, before deciding where the actual fault is.

## Use a debugger or systematic tracing over guesswork

Prefer stepping through actual execution (for example `pdb` or `debugpy` in Python, the Chrome or Node inspector in JavaScript and TypeScript, `delve` in Go, `gdb` or `lldb` in C, C++, or Rust, an IDE debugger in Java or Kotlin) or deliberate, temporary logging at decision points, over adding print statements at random until something looks informative.

## Bisect when the search space is large

When a regression appears and the cause is unclear, find what changed since it last worked (a `git bisect`, or simply comparing against the last known-good commit or deployment) before searching blindly through the whole codebase.

## Fix the root cause, not the symptom

A change that makes a symptom disappear without an understood cause is suspect. If a symptom-level mitigation is unavoidable under time pressure, say so explicitly and record it as a known gap, do not present it as a resolved root cause.

## Retry limit applies here too

See `ai-usage-policy.md`: after two failed attempts at the same approach, stop and report what was tried and why it likely failed, rather than continuing to guess.

## Production incidents

- Prefer read-only diagnostic actions first: logs, metrics, a read-only query, before making any change to a live system.
- Do not deploy an untested fix directly to production to see if it helps. Reproduce in a lower environment when at all possible. If a live change is genuinely unavoidable, prefer one gated behind a feature flag or kill switch over an irreversible direct change.
- Identify a rollback plan before making a production change, not after something goes wrong.
- Record what was observed and changed during the incident, see `observability.md` for correlation IDs and `lgpd.md` if the incident involves personal data.
- After resolution, write a short, blameless note: what happened, the root cause, and what prevents it from recurring.

## Related

- `testing.md` for the reproduce-first rule applied to bug fixes.
- `ai-usage-policy.md` for the retry limit.
- `observability.md` for what to capture during an investigation.
- `resilience.md` for the failure-handling patterns that prevent some incidents outright.
