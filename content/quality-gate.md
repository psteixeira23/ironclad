# Quality Gate

A quality gate is an automated check that runs before code merges and
blocks the merge if the check fails. It is what turns the advisory rules
in this content set into an enforced barrier: a rule the assistant is
asked to follow can be skipped in a given turn, a gate that fails the
build cannot.

This file describes the gate in a language-agnostic way. The specific
tools belong to each project's stack, not to Ironclad, so each project
chooses its own equivalents from the mapping below.

## What the gate must guarantee

At minimum, before code merges, the gate must fail on:

1. A reference to a symbol that does not exist: an undefined function,
   method, class, variable, import, or module. This is the primary
   defense against invented symbols, see the grounding rule in
   `ai-usage-policy.md`.
2. A type error: a value used in a way its type does not allow.

Beyond that minimum, a gate usually also runs a linter for likely-bug and
quality issues, the test suite, and a secrets scan, see `security.md`.

## Compiled, statically typed languages

In a compiled, statically typed language (Java, Kotlin, Go, Rust, C#, and
TypeScript when it is actually type-checked), the compiler already
enforces both guarantees: it refuses to build a reference to a symbol
that does not exist, and it rejects a type error. The build itself is the
anti-hallucination gate, at no extra cost. What to add here is static
analysis for code that compiles but is still wrong, plus the test suite.

Examples, as reference, not as a required toolchain:

- Java: `javac`, plus SpotBugs, Error Prone, Checkstyle.
- Kotlin: `kotlinc`, plus Detekt, ktlint.
- Go: `go build` and `go vet`, plus staticcheck.
- Rust: `cargo build`, plus Clippy.
- C#: the compiler, plus Roslyn analyzers.

## Dynamic languages

In a dynamic language (Python, JavaScript, Ruby, PHP), an undefined
symbol runs fine until it is reached and then fails at runtime, too late.
The guarantee the compiler gives for free above must be added
explicitly, with a type checker and a linter that flags undefined
references:

- Python: a type checker (mypy or Pyright), plus a linter that catches
  undefined names (Ruff, which includes Pyflakes, or Flake8).
- JavaScript: ESLint with `no-undef` and related rules; add TypeScript
  (`tsc`) if the project is typed.
- Ruby: a type checker (Sorbet), plus RuboCop.
- PHP: a static analyzer (PHPStan or Psalm).

Frontend follows the same split: TypeScript checked with `tsc` is the
typed case; plain JavaScript relies on ESLint's undefined-reference
rules.

## Where the gate runs

Run it as early as is practical, and in more than one place:

- A pre-commit or pre-push git hook catches problems on the developer's
  machine, before they are shared. Fast feedback.
- A continuous-integration check on the pull request is the authoritative
  gate, the one that must pass to merge, because a local hook can be
  bypassed.

A local hook is for speed; CI is for the guarantee. A project that can
only have one should make CI the one.

## Relationship to the advisory rules

The grounding rule in `ai-usage-policy.md` asks the assistant not to
invent symbols. This gate catches the cases where it does anyway. The
rule reduces the frequency; the gate removes what slips through before it
reaches production. Neither replaces the other, and neither alone makes
hallucinated code impossible.

Related: `ai-usage-policy.md`, `testing.md`, `security.md`, `commits.md`.
