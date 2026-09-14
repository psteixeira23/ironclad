# Resilience

This file is scoped to outbound calls to third-party services (email,
SMS, calendar, or any other external integration), not to financial
transaction processing, since this project does not process payments
in-system.

- **Timeouts** on every outbound call to an external dependency. No
  unbounded wait; a hung third-party API should not hang the request
  that called it.
- **Retries** with exponential backoff and jitter for transient failures,
  with a defined retry limit, not unlimited retries. Retrying forever
  turns a transient failure into a resource leak or a self-inflicted
  denial of service.
- **Idempotency** for any operation where a retry could duplicate an
  effect, for example sending a duplicate notification to the same
  guardian because a retry fired after the first attempt actually
  succeeded but the response was lost.
- **Graceful degradation.** A non-critical external dependency being down
  should degrade the feature it supports, not take down the whole
  request. If sending a confirmation SMS fails, the underlying action it
  confirms should still succeed.

## Out of scope

Circuit breakers, bulkheads, and dead-letter queues are patterns for
high-volume, financial-grade, or otherwise business-critical distributed
systems. Do not introduce that weight into this project unless a specific
external dependency's failure mode actually calls for it, and treat
adding one as a decision requiring the confirmation protocol in
`ai-usage-policy.md`.

Related: `backend.md`, `observability.md`, `ai-usage-policy.md`.
