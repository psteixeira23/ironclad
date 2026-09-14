# Commits

Every commit message is written in English, per `language.md`, regardless of the language used elsewhere in the conversation.

## Format: Conventional Commits

Title line:

```
<type>(<optional scope>): <short summary, imperative mood, no period>
```

Common types:

- `feat`: a new capability from the user's or caller's perspective.
- `fix`: a bug fix.
- `refactor`: a behavior-preserving structural change, see `refactor.md`.
- `test`: adding or correcting tests, without changing production behavior.
- `docs`: documentation only.
- `perf`: a change made specifically to improve performance.
- `build`: changes to the build system or dependencies.
- `ci`: changes to CI/CD configuration.
- `chore`: everything else that does not alter source or test behavior (tooling, formatting config, and similar).

The scope is optional and names the affected area, for example `feat(auth): ...` or `fix(booking): ...`.

A breaking change is marked with a `!` after the type or scope (`feat(api)!: ...`), and explained in a `BREAKING CHANGE:` footer.

## Body: four lines, objective, readable by any seniority

The body is short on purpose, roughly four lines, and answers two questions: what changed, at a level someone unfamiliar with the surrounding code can follow, and why the change was made. It is not a restatement of the diff, and it does not assume the reader already has the context that motivated the change.

```
feat(auth): add password reset via email

Adds a time-limited reset token sent by email. Needed because
users had no self-service way to regain access, only manual
support intervention. Tokens expire after 30 minutes and are
single-use.
```

Avoid messages that carry no information for a future reader: `fix`, `wip`, `update`, `final`, `changes`. A commit message should let someone reconstruct why the change exists without opening the diff.

## One logical change per commit

Do not bundle an unrelated fix into a feature commit, or several unrelated fixes into one commit. Each commit should be revertible on its own without taking unrelated changes down with it.

## Reference tracking, if the project has it

If the project tracks work in an issue tracker, reference the issue or ticket number in a footer line (`Closes #482`), not in the title.

## Commit type drives version bumps

If the project has a `VERSION` file and a `pre-push` hook (see the root `README.md`), the type on this commit's title line decides the next version automatically: `fix` bumps patch, `feat` bumps minor, a breaking-change marker bumps major. This is one more reason the type has to be accurate, it is not just a label, an incorrect type produces the wrong version number.

## Related

- `refactor.md` for what qualifies as a `refactor` type commit.
- `review-checklist.md`, a commit history that follows this convention is itself part of what a reviewer checks.
- `ai-usage-policy.md` for the scope discipline that keeps a commit's diff matching what its message describes.
