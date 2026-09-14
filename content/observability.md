# Observability

Applies regardless of language, framework, or telemetry vendor. This file covers instrumenting a system and detecting when something is wrong. Diagnosing and resolving an incident once detected is covered in `debug.md`.

## Instrument

- Structured logging with a correlation identifier per request, so a single request's logs can be reconstructed across services.
- Never log secrets, tokens, passwords, or personal data belonging to an end user, see `lgpd.md` for what counts as sensitive in a given project's domain.
- Meaningful log levels: errors are errors, not routine flow logged defensively at a high level "just in case."
- Three lenses help decide what to instrument, use whichever fits the component:
  - **Golden Signals**: latency, traffic, errors, and saturation, a general-purpose starting point for most services.
  - **RED method** (rate, errors, duration): for request-driven services, an endpoint or a queue consumer.
  - **USE method** (utilization, saturation, errors): for a resource, a CPU, a connection pool, a disk, anything that can run out of capacity.

## Measure

- Never rely on an average alone. A mean can look healthy while a meaningful share of requests are slow. Track percentiles (p50, p95, p99) for latency-sensitive paths, the tail is often where the real problem is.
- Business metrics matter as much as technical ones. A service can be technically healthy, low latency, no errors, while the business operation it exists to support is failing (for example, successful requests that all fail a downstream validation). Instrument the business outcome, not only the request's HTTP status.
- Metric cardinality: do not use a value that is unique per record, a user ID, an order ID, a request ID, as a metric label. Unbounded-cardinality labels degrade or break most metrics backends. That kind of identifier belongs in a log line or a trace span, not a metric label.
- Runtime-specific metrics apply only when that runtime is actually in use, do not carry them into a project where they do not apply: heap and garbage-collection metrics for a JVM-based service, event-loop lag for Node, queue depth and consumer lag for a message-driven system built on Kafka, SQS, or similar. Instrument these when the component in question exists, not by default.

## Correlate

- A correlation ID ties a single request's log lines, metrics, and trace spans together. Without it, three separate signals about the same event are three separate investigations instead of one.
- When diagnosing a problem that could originate in a call to another service, check whether the fault is local or belongs to a dependency before assuming either. See `resilience.md` for how a dependency's failure should be handled once identified.

## Detect

- Every alert must be actionable. If nobody would know what to do when it fires, it should not exist, either give it a runbook or remove it.
- Alert on the symptom a user or the business would notice (elevated error rate, degraded latency, a failed business outcome), not only on a technical threshold picked without a stated reason.
- Prefer a few alerts people trust over many that people learn to ignore. Alert fatigue from noisy, non-actionable alerts is a worse state than having fewer alerts.

## Reliability targets

Formal Service Level Indicators, Objectives, and error budgets are worth defining only when both are true: real users depend on the service's reliability, and someone is actually responsible for acting when the budget is at risk. An SLO nobody reads and nobody owns is a number for its own sake, the same failure mode as chasing a test-coverage percentage disconnected from whether the tests mean anything, see `testing.md`. Do not introduce this formality by default; introduce it when a service has reached the point where it earns its cost.

## Related

- `debug.md` for diagnosing and resolving an incident once detected here.
- `lgpd.md` for what counts as sensitive data that must never be logged.
- `resilience.md` for handling a dependency once identified as the source of a problem.
- `security.md` for not leaking internals through logs or error responses.
