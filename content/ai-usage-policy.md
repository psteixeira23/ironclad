# AI Usage Policy

This file covers two related but distinct concerns: how the team uses AI,
and how the AI assistant itself should behave while working.

## Part 1: Team accountability

- The AI is an assistant. It supports engineering decisions; it does not
  replace engineering ownership.
- A developer remains responsible for code they accept, modify, merge, or
  deploy, regardless of whether AI generated it. "The AI wrote it" is not
  a defense for a bug or a security issue that ships.
- AI-generated code goes through the same review, the same tests, and the
  same standards as manually written code. It is not exempt from any rule
  in this content set.
- Never paste real personal data (student/guardian data, or any other
  personal data this project handles) into a chat session to debug an
  issue. Use synthetic or anonymized data, see `lgpd.md`.

## Part 2: How the assistant should operate

### Grounding and uncertainty

Do not reference or call a function, method, class, flag, environment
variable, file path, configuration key, or library API that you have not
confirmed exists. Confirm it in the actual code or the library's current
documentation, not from memory, which goes stale and produces
plausible-looking names that do not exist. An invented symbol that merely
looks correct is the most common failure in AI-generated code.

When stating a fact about the codebase (that something is configured in a
given file, that one function calls another, that a value comes from a
particular place), point to the source: the file, and the line or symbol.
A claim a reviewer can check in one step is worth more than a confident
assertion they have to take on trust.

When you do not know something and cannot verify it in the available code
or documentation, say so and check, or ask. Do not fill the gap with a
plausible guess presented as fact. "I need to confirm X before using it"
is a correct and useful answer; a fabricated X that fails at runtime is
not.

This generalizes the versioning rule below: verify against the real
artifact, not against training data, for symbols and APIs just as for
version-support status. The quality gate in `quality-gate.md` is what
enforces this automatically, for the cases a rule alone does not catch.

### Confirmation protocol

Risk-based, not blanket. Do not ask for approval on every change, that
defeats the purpose of using an assistant. Use this trigger instead: a
short written plan and explicit go-ahead is required before coding for

- database schema changes,
- new dependencies,
- architectural decisions,
- removing or significantly restructuring existing code,
- major version upgrades of a language, runtime, or framework, or
- any requirement that is genuinely ambiguous.

A plan is not required for bug fixes with a clear reproduction, adding a
missing test, small isolated functions, or formatting. When a plan is
required, keep it short: files to touch, approach, and any trade-off,
then wait for a reply before writing code.

### Assumptions

If a detail is unspecified, such as a field name, an edge case, or a date
format, state the assumption made in one line instead of silently picking
one and moving on. Do not turn a low-stakes, easily reversible assumption
into a question.

### Retry limit

If an approach fails twice in a row, the same test still fails, or the
same error persists, stop. Report what was tried, why it likely failed,
and ask how to proceed instead of attempting further variations
unprompted.

### Scope discipline

Touch only what the task requires. Do not refactor, rename, or clean up
unrelated code while working on something else, even if the opportunity
is right there; flag it as a suggestion afterward instead. Do not
generate README files, docstrings, or comments beyond what makes
non-obvious code understandable, unless explicitly asked.

When the task is specifically to verify that existing work meets a
stated condition, stop as soon as that proof is complete. Do not add
polish, cleanup, or an unrelated test after the criteria already pass,
a verification task is not an invitation to expand into a general
review.

### Writing economy

Cut filler before it is written, not after: "just," "really," "basically,"
"essentially," pleasantries ("happy to," "of course"), hedging ("it might
be worth," "you could consider"), and redundant phrasing ("in order to"
instead of "to," "make sure to" instead of a direct instruction). This
applies to comments, commit messages, generated documentation, and
conversational replies, not only to files in `content/`.

This is not the same rule as terse-for-its-own-sake writing. Keep the
reasoning that explains _why_ a rule exists, that is what makes a
standard teachable rather than a command to obey blindly. Cut the words
that carry no meaning; keep the ones that carry the reason.

### Working economy

Distinct from writing economy above, which is about words. This is about
not wasting the work itself:

- Read the part of a file the task needs (a search, a line range), not
  the whole file, and do not re-read what is already available in the
  current context.
- When changing code, show the changed region or a diff, not a full
  reprint of an unchanged file.
- Do not echo the request back before answering it.

Spend the saved effort where it matters: on the grounding above. Reading
the real code to confirm a symbol exists is not waste, it is the point.
Cheap on output, never cheap on verification.

### Versioning and upgrades

Prefer the most recent stable or long-term-support version of a language,
runtime, or framework that still receives security patches, not
necessarily the newest release available. Verify current support status
rather than relying on training data, which goes stale. Dependencies stay
pinned in a lockfile; updates are deliberate and reviewed. A security
patch that fixes a known vulnerability is the exception to the plan-first
rule above, since the risk of staying vulnerable usually outweighs the
risk of the bump, but still report what was updated and why.

Related: `lgpd.md`, `language.md`, `review-checklist.md`, `quality-gate.md`.
