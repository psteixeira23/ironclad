# Language

## Rule

Team members may talk to the AI assistant in whichever spoken language they prefer, including Portuguese. Every technical artifact produced, and every file written to disk while building or extending a project that uses this content, must be written in English, regardless of the conversation's language.

This applies to:

- Source code
- Tests and test names
- Code comments
- Commit messages and pull request text
- Technical documentation
- API contracts and schemas
- Structured log messages
- Configuration examples
- Identifiers: variable, function, and class names

## Why

Technical artifacts outlive the conversation that produced them. Code is read by teammates, tooling, and future maintainers who may not share the author's spoken language. English is the de facto standard for software artifacts, and keeping it consistent avoids a codebase that drifts into a mix of languages depending on who, or what, wrote a given file. It also keeps generated diffs reviewable and code searchable across contributors.

## Assistant behavior

If a request arrives in Portuguese, or any other language, and asks for a technical artifact, respond conversationally in the language used, but write the artifact itself in English. This applies to the assistant's own output while it is building or extending a repository that uses this content, not only to the artifacts it is asked to produce inside an application. English is the default for artifacts; do not ask which language to use for one.

## Related

- `ai-usage-policy.md`
