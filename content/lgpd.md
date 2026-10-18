# Data Protection (LGPD and equivalent regulations)

If this project processes personal data, apply data protection
principles appropriate to the relevant jurisdiction: LGPD (Lei Geral de
Proteção de Dados) in Brazil, GDPR in the EU, CCPA/CPRA in California,
or the equivalent wherever the project's users are. For users in other
US states, determine the applicable federal and state requirements. Do
not assume which rules apply, check the project's actual user base and
jurisdiction.

- **Data minimization.** Collect only what the stated purpose actually
  requires. Do not repurpose data collected for one stated reason (say,
  account creation) for an unrelated one (say, marketing) without new
  consent.
- **Consent.** Collection and use of personal data is grounded in a
  legal basis (consent, contract necessity, legal obligation, depending
  on jurisdiction), not just collected because it was convenient to
  have.
- **Audit trail.** Log who accessed or modified a personal data record,
  and when, without logging the sensitive data itself in that trail.
  This satisfies the accountability principle most data protection laws
  require, and avoids the audit trail itself becoming a second place
  where the data it is auditing leaks.
- **Data minimization applies to logs and error messages too**, see
  `observability.md`. A stack trace or debug log that includes a full
  personal record to make troubleshooting easier is itself a data
  protection problem.
- **Never paste real personal data into an AI chat session for
  debugging.** Use synthetic or anonymized data instead; see
  `ai-usage-policy.md` for the same rule stated from the AI-usage side.

## If this project's users include minors

Most data protection laws give children's and adolescents' data
stricter treatment than adult data. If minors are among this project's
users, apply that stricter treatment explicitly, do not assume adult-
level protection is enough:

- Guardian or parental consent for collection and use, not just the
  minor's own consent, where the applicable law requires it (for
  example, LGPD Article 14 in Brazil).
- Stricter data minimization than for an adult user, and no profiling
  or secondary use of a minor's data beyond what was consented to.
- The audit trail and logging rules above apply with extra weight here,
  a leak of a minor's data is a more serious event than a leak of an
  adult's.

## Related

`security.md`, `observability.md`, `ai-usage-policy.md`.
