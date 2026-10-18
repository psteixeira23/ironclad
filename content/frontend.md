# Frontend

Standards for client-side and rendering-layer implementation, regardless
of framework.

## Cross-site scripting (XSS)

- Escape all rendered output by default. Never use
  `dangerouslySetInnerHTML`, `innerHTML`, `v-html`, or the equivalent in
  whatever framework this project uses, on data that came from a user or
  any external source, without sanitizing it first through a trusted
  library built for that purpose.
- Treat every value that originated outside this project's own code as
  untrusted when rendering it: form input, URL parameters, data from an
  API response, even a value already stored in this project's own
  database, since it may have been written by a user earlier. Trust the
  rendering step's escaping, not the origin of the data.
- If raw HTML genuinely needs to be rendered (a rich-text field, for
  example), sanitize it server-side or client-side through an
  allow-list-based sanitizer, never a naive strip-tags or regex
  approach, both are reliably bypassable.
- Building HTML by string concatenation and inserting it into the DOM
  is the same risk as `dangerouslySetInnerHTML`, regardless of whether
  a framework's "safe by default" templating is being used at that
  point or not.

## Third-party scripts and dynamic code execution

- Any script loaded from a third-party CDN or external origin includes
  a Subresource Integrity (`integrity` attribute) hash, so a
  compromised or silently altered version of that script fails to
  load instead of executing.
- Never pass user-supplied or externally-sourced data to `eval()`,
  `new Function()`, or `setTimeout`/`setInterval` called with a string
  argument. Use `JSON.parse` to parse untrusted JSON-like data, never
  `eval`.

## Client-side storage

- Never store a secret, an API key, or a token that grants access to a
  sensitive action in `localStorage` or `sessionStorage`. Both are
  readable by any script running on the page, including one injected
  through an XSS vulnerability elsewhere in the app; a token stored
  there turns any XSS bug into full account takeover instead of a
  contained issue.
- Prefer an `HttpOnly` cookie for session state precisely because
  client-side script, malicious or not, cannot read it, see the cookie
  rules in `backend.md`.

## Component structure

- Keep components small and focused: presentation components render
  UI, container or hook logic handles state and side effects, do not
  tangle the two together in one file.
- Do not put business rules in a component. If a component is deciding
  something more complex than what to render, that logic belongs in a
  hook, service, or shared utility that can be unit tested on its own,
  see `architecture.md` on keeping business logic out of the interface
  layer.
- Handle loading, error, and empty states explicitly, do not assume the
  happy path is the only path a user will see.

## Related

`backend.md` for CSRF, CORS, and cookie configuration that the frontend
depends on. `security.md` for the checklist entry this file backs.
`architecture.md` for keeping business logic out of the rendering layer.
