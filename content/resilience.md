# Resilience

Applies to outbound calls this project makes to third-party services:
email, SMS, calendar integrations, payment processors, or any other
external dependency.

- **Timeouts** on every outbound call to an external dependency. No
  unbounded wait; a hung third-party API should not hang the request
  that called it.
- **Retries** with exponential backoff and jitter for transient
  failures, with a defined retry limit, not unlimited retries. Retrying
  forever turns a transient failure into a resource leak or a
  self-inflicted denial of service.
- **Idempotency** for any operation where a retry could duplicate an
  effect, for example sending a duplicate notification, or charging a
  payment twice, because a retry fired after the first attempt actually
  succeeded but the response was lost.
- **Graceful degradation.** A non-critical external dependency being
  down should degrade the feature it supports, not take down the whole
  request. If sending a confirmation email fails, the underlying action
  it confirms should still succeed where that is safe to do.

## Heavier patterns, only when the project's risk profile calls for it

Circuit breakers, bulkheads, and dead-letter queues are patterns for
high-volume, financial-grade, or otherwise business-critical
distributed systems. Do not introduce that weight by default.

Check whether this project actually has that risk profile before
skipping this section, it depends on the project, not a fixed
assumption: a project that processes payments, moves money, or has a
dependency whose failure causes real financial or safety harm likely
does need some of this. A project with only low-stakes integrations
(a confirmation email, a calendar sync) likely does not. Either way,
treat adding this weight as a decision requiring the confirmation
protocol in `ai-usage-policy.md`, rather than adding it reflexively or
skipping it reflexively.

## Related

`backend.md`, `observability.md`, `ai-usage-policy.md`.
