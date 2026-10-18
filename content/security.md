# Security

Pre-launch and ongoing security checklist.

1. **API keys.** Never in client-side code, never committed to git, only
   in environment variables loaded server-side.
2. **Git secrets.** No `.env` file, credential, or private key is ever
   committed. Check history for anything leaked in the past; rotate any
   key that was ever committed, even if later removed, it stays in git
   history regardless.
3. **Database keys.** Only a minimal-privilege key is ever exposed
   client-side. A service-role or admin-level key is never sent to a
   client.
4. **Row Level Security.** See the full treatment in `database.md`; this
   item exists here as a checklist entry pointing there.
5. **Encryption at rest** for sensitive fields (personal data, tokens),
   not just relying on provider-level disk encryption alone.
6. **Authentication enforced server-side** on every request. Never trust
   a client-side check alone, such as hiding a button, to gate a
   protected action.
7. **Access restriction and IDOR.** Every endpoint that reads or mutates
   a specific user's data verifies ownership first, see `backend.md`.
8. **Mass assignment.** Only allow-listed fields are settable from client
   input, see `backend.md`.
9. **Cookies.** `HttpOnly`, `Secure`, and `SameSite` set on any session
   or auth cookie, see `backend.md`.
10. **Password hashing.** bcrypt, argon2, or scrypt with a proper cost
    factor, see `backend.md`.
11. **Rate limiting and API contract.** Rate limits on authentication,
    password reset, and any expensive or abusable endpoint. An API
    versioning strategy so breaking changes do not silently affect
    existing clients. HTTP methods used per their real semantics. Request
    and response schemas validated against a contract.
12. **Bot protection** on public forms prone to abuse (signup, contact,
    comments).
13. **Parameterized queries, always.** Never interpolate user input
    directly into SQL, shell commands, or templates.
14. **Input validation server-side**, regardless of any client-side
    validation.
15. **Data over-exposure.** API responses return only the fields a client
    needs, never a full database row, another user's data, or an
    unfiltered join leaking unrelated records.
16. **Upload restrictions.** See `backend.md`.
17. **API response trimming.** No verbose error messages, stack traces,
    or internal identifiers leaked in production responses.
18. **Security headers.** `Content-Security-Policy`,
    `X-Content-Type-Options: nosniff`, `X-Frame-Options` (or a CSP
    `frame-ancestors` directive), and `Strict-Transport-Security` set
    appropriately.
19. **HTTPS enforced.** HTTP requests redirect to HTTPS, and sensitive
    endpoints refuse to operate over plain HTTP in production.
20. **Dependency supply-chain check.** Verify a package's name before
    installing it, to catch typosquatting or dependency-confusion risk on
    an internal-sounding name, and check for known vulnerabilities before
    adding a new dependency.
21. **Path traversal.** See `backend.md`.
22. **CSRF (Cross-Site Request Forgery).** Every state-changing,
    cookie-authenticated request is protected with a CSRF token, not
    `SameSite` alone. See `backend.md`.
23. **XSS (Cross-Site Scripting).** All rendered output is escaped by
    default; raw HTML is only rendered through an allow-list sanitizer.
    See `frontend.md`.
24. **CORS.** An explicit origin allow-list, never a wildcard combined
    with credentials. See `backend.md`.
25. **Subresource Integrity.** Any third-party script loaded from a CDN
    or external origin has an `integrity` hash, so a tampered version
    fails to load instead of executing. See `frontend.md`.
26. **Dynamic code execution.** No `eval()`, unrestricted deserializer,
    or equivalent runs on user-supplied or externally-sourced input,
    client-side or server-side. See `frontend.md` and `backend.md`.

"No vulnerabilities" is not an achievable absolute. The goal is
eliminating known, testable vulnerability classes and following rigorous
practice. Real security still requires human review, dependency scanning,
and testing beyond what a checklist alone can guarantee.

Related: `backend.md`, `frontend.md`, `database.md`, `lgpd.md`, `review-checklist.md`.
