# LGPD (Data Protection)

This project's user base is mostly minors, each with a legal adult
guardian on record. LGPD (Lei Geral de Proteção de Dados) treats a
child's or adolescent's data with extra weight, and this project's
practices reflect that.

- Data belonging to a minor gets the special treatment required under
  LGPD Article 14: data minimization (collect only what the stated
  purpose actually requires), guardian consent for collection and use,
  and no secondary use beyond what the guardian consented to. Do not
  repurpose data collected for one stated reason (say, enrollment) for
  an unrelated one (say, marketing) without new consent.
- Keep an audit trail: log who accessed or modified a student or guardian
  record, and when, without logging the sensitive data itself in that
  trail. This satisfies the accountability principle and supports
  answering "who touched this record" without creating a second place
  where personal data leaks, since the audit trail itself becomes an
  attack surface if it duplicates the data it is auditing.
- Never paste a real student's or guardian's personal data into an AI
  chat session for debugging. Use synthetic or anonymized data instead;
  see `ai-usage-policy.md` for the same rule stated from the AI-usage
  side.
- Data minimization applies to logs and error messages too, see
  `observability.md`. A stack trace or debug log that includes a
  student's full record to make troubleshooting easier is itself a data
  protection problem.

Related: `security.md`, `observability.md`, `ai-usage-policy.md`.
