'use strict';

// Installer smoke test. Runs install.js into an isolated temporary home
// directory and asserts it lands the expected files for all three
// harnesses. No test framework: plain node:assert, so it runs anywhere
// the installer runs (Node >= 18).

const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const REPO_ROOT = path.join(__dirname, '..', '..');
const INSTALL_JS = path.join(REPO_ROOT, 'installer', 'install.js');
const CONTENT_SRC = path.join(REPO_ROOT, 'content');
const MARKER = '<!-- IRONCLAD START -->';

function run() {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'ironclad-smoke-'));
  const isWin = process.platform === 'win32';

  // Redirect every home-derived path the installer uses into the temp dir.
  const env = { ...process.env, HOME: home, USERPROFILE: home };
  if (isWin) {
    env.LOCALAPPDATA = path.join(home, 'LocalAppData');
    env.APPDATA = path.join(home, 'AppData', 'Roaming');
  }

  // install.js is interactive; "4" selects all harnesses. execFileSync
  // throws if the installer exits non-zero, which fails the test.
  execFileSync('node', [INSTALL_JS], {
    input: '4\n',
    env,
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  const mdFiles = fs.readdirSync(CONTENT_SRC).filter((f) => f.endsWith('.md'));
  assert.ok(mdFiles.length > 0, 'repo content/ has no .md files to install');

  // 1. Canonical content: every content/*.md must land in ~/.ironclad/content
  const contentDest = path.join(home, '.ironclad', 'content');
  for (const f of mdFiles) {
    assert.ok(
      fs.existsSync(path.join(contentDest, f)),
      `canonical content missing: ${f}`
    );
  }

  // 2. VERSION copied
  assert.ok(
    fs.existsSync(path.join(home, '.ironclad', 'VERSION')),
    'VERSION not copied to ~/.ironclad'
  );

  // 3. Claude skill: SKILL.md plus every content file copied flat
  const skillDir = path.join(home, '.claude', 'skills', 'ironclad');
  assert.ok(fs.existsSync(path.join(skillDir, 'SKILL.md')), 'Claude SKILL.md missing');
  for (const f of mdFiles) {
    assert.ok(
      fs.existsSync(path.join(skillDir, f)),
      `Claude skill missing content file: ${f}`
    );
  }

  // 4. bin command, at the platform-specific path
  const binPath = isWin
    ? path.join(env.LOCALAPPDATA, 'Ironclad', 'bin', 'ironclad.cmd')
    : path.join(home, '.local', 'bin', 'ironclad');
  assert.ok(fs.existsSync(binPath), `ironclad command missing at ${binPath}`);

  // 5. Codex AGENTS.md with the demarcation marker
  const codexPath = path.join(home, '.codex', 'AGENTS.md');
  assert.ok(fs.existsSync(codexPath), 'Codex AGENTS.md missing');
  assert.ok(
    fs.readFileSync(codexPath, 'utf8').includes(MARKER),
    'Codex AGENTS.md missing Ironclad marker'
  );

  // 6. Copilot instructions with the marker, at the platform-specific path
  let copilotPath;
  if (process.platform === 'darwin') {
    copilotPath = path.join(
      home, 'Library', 'Application Support', 'Code', 'User', 'prompts',
      'copilot-instructions.md'
    );
  } else if (isWin) {
    copilotPath = path.join(
      env.APPDATA, 'Code', 'User', 'prompts', 'copilot-instructions.md'
    );
  } else {
    copilotPath = path.join(
      home, '.config', 'Code', 'User', 'prompts', 'copilot-instructions.md'
    );
  }
  assert.ok(fs.existsSync(copilotPath), `Copilot instructions missing at ${copilotPath}`);
  assert.ok(
    fs.readFileSync(copilotPath, 'utf8').includes(MARKER),
    'Copilot instructions missing Ironclad marker'
  );

  fs.rmSync(home, { recursive: true, force: true });
  console.log('smoke test passed: installer lands files for all three harnesses');
}

run();
