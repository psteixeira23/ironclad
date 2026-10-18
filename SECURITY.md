# Security Policy

Ironclad is a set of engineering standards installed locally. It runs no
server and collects no data. Even so, the installer writes files to your
home directory and installs a git hook, so a defect here could affect a
developer's machine. Security reports are welcome.

## Reporting a vulnerability

Please do not open a public issue for a security problem. Instead, use
GitHub's private vulnerability reporting on this repository: open the
**Security** tab and choose **Report a vulnerability**. That keeps the
report private until a fix is available.

Include, as far as you can: what the problem is, how to reproduce it, the
affected files or steps, and the impact you foresee.

## Scope

In scope: the installer (`installer/install.js`), the git hook
(`.githooks/pre-push`), the `bin/ironclad` command, and anything in this
repository that executes or writes files on a user's machine.

The guidance inside `content/` describes secure practices for other
projects. A disagreement with that advice is a normal issue or pull
request, not a vulnerability report.

## Supported versions

This project is distributed from its `main` branch. Fixes are applied
there and released by version bump. Please report against the latest state
of `main`.
