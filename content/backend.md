# Backend

Standards for API and backend implementation, regardless of language or
framework. These apply at the HTTP/interface layer and the use case layer
described in `architecture.md`.

## Input handling

- Request validation and sanitization happens server-side, always. Client-side
  validation is a UX convenience, never a security boundary; a request can
  reach the server without ever going through the client's validation code.
- Only allow-listed fields can be set from client input when creating or
  updating a record. Never spread a request body directly into a database
  write (no mass assignment). Map explicitly from the validated request
  model to the fields the operation is actually allowed to change.
- Request and response schemas are validated against a contract (Pydantic,
  JSON Schema, OpenAPI, or equivalent) at the boundary, not informally
  assumed from whatever code happens to produce them.

## Authorization

- Every endpoint that reads or mutates a specific user's data must verify
  the authenticated user owns that resource before acting. Do not rely on
  the resource ID being "hard to guess" (no IDOR — Insecure Direct Object
  Reference). Ownership checks happen server-side on every request, not
  only when a UI element happens to hide an action.

## Error handling

- Weak exception handling is a defect, not a style preference: catching
  exceptions too broadly (a bare `except:` or `catch (Exception e)` that
  swallows anything), catching and doing nothing meaningful with the
  error, or catching only to log and re-throw without adding value, all
  count.
- Return errors with a consistent shape and correct HTTP status codes.
  Never leak stack traces, internal file paths, or raw exception messages
  to a client, see `security.md` item 17.

## Function behavior

- A function should not do more than its name and signature promise. A
  "getter" that mutates state, or a validation function that also
  persists data, hides behavior from the caller and makes the codebase
  harder to reason about. Split responsibilities instead.
- Keep controllers and handlers thin: parse input, call a use case, map
  the result to a response. No business logic in the HTTP layer, see
  `architecture.md`.

## HTTP semantics

- Use HTTP methods per their real semantics: `GET` never mutates state,
  `DELETE` is idempotent (calling it twice on the same resource produces
  the same end state as calling it once).

## Sessions and passwords

- Session or auth cookies must set `HttpOnly`, `Secure`, and an
  appropriate `SameSite` value.
- Password hashing uses bcrypt, argon2, or scrypt with a proper cost
  factor. Never plain text, and never a fast general-purpose hash such as
  MD5 or SHA1, for passwords.

## Cross-site request forgery (CSRF)

- Any state-changing request (`POST`, `PUT`, `PATCH`, `DELETE`) made by
  an authenticated, cookie-based session must be protected against
  forgery from another site. `SameSite=Lax` or `SameSite=Strict` on the
  session cookie helps but is not sufficient alone, browser support and
  edge cases (subdomains, older clients) vary.
- Use a CSRF token (synchronizer token or double-submit cookie pattern)
  for cookie-authenticated state-changing requests, verified server-side
  on every such request, not just present in the form and never checked.
- An API authenticated by a bearer token in a header (not a cookie sent
  automatically by the browser) is not vulnerable to CSRF the same way,
  a token-based API does not need this same defense, but confirm which
  authentication model this project actually uses before assuming
  either way.

## Cross-origin resource sharing (CORS)

- Set an explicit allow-list of origins permitted to call this API from
  a browser. Never `Access-Control-Allow-Origin: *` on an endpoint that
  also allows credentials (cookies, `Authorization` headers tied to a
  session), that combination defeats the same-origin protections CORS
  exists to provide.
- Only allow the HTTP methods and headers the endpoint actually needs,
  do not reflect back whatever the request asked for.

## Outbound requests

- Any outbound HTTP call built from user-supplied input must validate the
  destination before making the request (no SSRF — Server-Side Request
  Forgery). Do not resolve and fetch an arbitrary user-supplied URL
  without checking it against an allow-list or otherwise constraining
  what it can reach, including internal/private network ranges.

## Dynamic code execution

Never let user-supplied or externally-sourced input control what code
runs, regardless of the specific mechanism a language exposes for
this:

- `eval()` / `exec()` (Python, JavaScript/Node, Ruby).
- An unrestricted deserializer that executes code as a side effect of
  parsing: Python's `pickle`, PHP's `unserialize`, Java's native
  `ObjectInputStream` deserialization, Ruby's `Marshal.load`.
- A scripting or expression-language engine fed untrusted input: Java's
  JSR 223 `ScriptEngine`, Spring Expression Language (SpEL) injection,
  or a JNDI lookup built from user input, the mechanism behind the
  Log4Shell vulnerability.
- A template engine's raw-code execution mode, or reflection-based
  instantiation of a class named by user input.

Parse external input as data, never as code or as a reference the
runtime resolves and executes.

## File uploads and paths

- Validate uploaded file type, size, and content server-side. Never trust
  a file extension or a client-declared MIME type alone; inspect the
  actual content where the risk warrants it. Serve uploaded files from a
  location that cannot execute as code.
- Path traversal: any file path built from user input (filenames, upload
  names, path parameters) must be normalized and checked against an
  allow-listed base directory before being used to read, write, or serve
  a file. Never trust that a client-supplied path segment like
  `../../etc/passwd` will not appear; resolve the path and validate the
  resolved result, do not just string-match the raw input.

Related: `architecture.md`, `security.md`, `database.md`, `review-checklist.md`.
