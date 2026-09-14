#!/usr/bin/env node
'use strict';

/**
 * Ironclad installer.
 *
 * Cross-platform by design: uses path.join and os.homedir() throughout,
 * no hardcoded separators, no POSIX-only assumptions, no shell scripts.
 * Run with: node install.js
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');

const REPO_ROOT = path.join(__dirname, '..');
const CONTENT_SRC = path.join(REPO_ROOT, 'content');
const ADAPTERS_DIR = path.join(REPO_ROOT, 'adapters');

const IRONCLAD_HOME = path.join(os.homedir(), '.ironclad');
const CONTENT_DEST = path.join(IRONCLAD_HOME, 'content');

const IRONCLAD_START = '<!-- IRONCLAD START -->';
const IRONCLAD_END = '<!-- IRONCLAD END -->';

const CODEX_SIZE_WARNING_BYTES = 30 * 1024; // warn before the documented 32 KB cap

function readBanner() {
  try {
    return fs.readFileSync(path.join(__dirname, 'banner.txt'), 'utf8');
  } catch (err) {
    return 'IRONCLAD';
  }
}

const summary = [];

function log(message) {
  console.log(message);
}

function copyDirFlat(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const src = path.join(srcDir, entry.name);
    const dest = path.join(destDir, entry.name);
    fs.copyFileSync(src, dest);
  }
}

function installCanonicalContent() {
  copyDirFlat(CONTENT_SRC, CONTENT_DEST);
  log(`Canonical content copied to ${CONTENT_DEST}`);
  summary.push(`Canonical content: ${CONTENT_DEST}`);

  const versionSrc = path.join(REPO_ROOT, 'VERSION');
  const versionDest = path.join(IRONCLAD_HOME, 'VERSION');
  try {
    fs.copyFileSync(versionSrc, versionDest);
  } catch (err) {
    log('Warning: could not copy VERSION file, "ironclad --version" may not work.');
  }
}

function installBinCommand() {
  const binSrc = path.join(REPO_ROOT, 'bin', 'ironclad');

  if (process.platform === 'win32') {
    const binDir = path.join(process.env.LOCALAPPDATA || os.homedir(), 'Ironclad', 'bin');
    fs.mkdirSync(binDir, { recursive: true });

    const jsDest = path.join(binDir, 'ironclad.js');
    fs.copyFileSync(binSrc, jsDest);

    const cmdWrapper = '@echo off\r\nnode "%~dp0ironclad.js" %*\r\n';
    fs.writeFileSync(path.join(binDir, 'ironclad.cmd'), cmdWrapper, 'utf8');

    log(`ironclad command installed at ${binDir}`);
    summary.push(`ironclad command: ${binDir} (invoke with "ironclad --version")`);

    const pathEnv = process.env.PATH || '';
    if (!pathEnv.split(';').some((p) => p.replace(/\\+$/, '') === binDir)) {
      log(`Note: ${binDir} is not on your PATH yet. Add it in`);
      log('System Properties > Environment Variables, or run in PowerShell:');
      log(`  setx PATH "$env:PATH;${binDir}"`);
    }
  } else {
    const binDir = path.join(os.homedir(), '.local', 'bin');
    fs.mkdirSync(binDir, { recursive: true });

    const dest = path.join(binDir, 'ironclad');
    fs.copyFileSync(binSrc, dest);
    fs.chmodSync(dest, 0o755);

    log(`ironclad command installed at ${dest}`);
    summary.push(`ironclad command: ${dest} (invoke with "ironclad --version")`);

    const pathEnv = process.env.PATH || '';
    if (!pathEnv.split(':').includes(binDir)) {
      log(`Note: ${binDir} is not on your PATH yet. Run:`);
      log(`  echo 'export PATH="${binDir}:$PATH"' >> ~/.zshrc && source ~/.zshrc`);
      log('(or the equivalent for your shell, e.g. ~/.bashrc)');
    }
  }
}

function installClaude() {
  const skillDir = path.join(os.homedir(), '.claude', 'skills', 'ironclad');
  fs.mkdirSync(skillDir, { recursive: true });

  const templatePath = path.join(ADAPTERS_DIR, 'claude', 'SKILL.md.template');
  const template = fs.readFileSync(templatePath, 'utf8');
  fs.writeFileSync(path.join(skillDir, 'SKILL.md'), template, 'utf8');

  copyDirFlat(CONTENT_SRC, skillDir);

  log(`Claude Code skill installed at ${skillDir}`);
  summary.push(`Claude Code: skill installed at ${skillDir} (invoke with /ironclad)`);
}

/**
 * GitHub Copilot's user-level custom instructions file path has changed
 * before and may change again. Verify against current GitHub documentation
 * before relying on this in a new environment. As of this writing, VS
 * Code's Copilot Chat reads personal instructions from a `prompts`
 * folder inside the VS Code user data directory.
 */
function getCopilotInstructionsPath() {
  const platform = process.platform;
  let vscodeUserDir;

  if (platform === 'darwin') {
    vscodeUserDir = path.join(os.homedir(), 'Library', 'Application Support', 'Code', 'User');
  } else if (platform === 'win32') {
    const appData = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming');
    vscodeUserDir = path.join(appData, 'Code', 'User');
  } else {
    vscodeUserDir = path.join(os.homedir(), '.config', 'Code', 'User');
  }

  return path.join(vscodeUserDir, 'prompts', 'copilot-instructions.md');
}

function renderTemplate(template) {
  return template.split('{{CONTENT_DIR}}').join(CONTENT_DEST);
}

function upsertDemarcatedBlock(filePath, blockContent) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  let existing = '';
  if (fs.existsSync(filePath)) {
    existing = fs.readFileSync(filePath, 'utf8');
  }

  const startIdx = existing.indexOf(IRONCLAD_START);
  const endIdx = existing.indexOf(IRONCLAD_END);

  let updated;
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    const before = existing.slice(0, startIdx);
    const after = existing.slice(endIdx + IRONCLAD_END.length);
    updated = before + blockContent + after;
  } else if (existing.length > 0) {
    const separator = existing.endsWith('\n') ? '\n' : '\n\n';
    updated = existing + separator + blockContent + '\n';
  } else {
    updated = blockContent + '\n';
  }

  fs.writeFileSync(filePath, updated, 'utf8');
  return updated;
}

function installCopilot() {
  const templatePath = path.join(ADAPTERS_DIR, 'copilot', 'instructions.md.template');
  const template = fs.readFileSync(templatePath, 'utf8');
  const rendered = renderTemplate(template);

  const targetPath = getCopilotInstructionsPath();
  upsertDemarcatedBlock(targetPath, rendered);

  log(`GitHub Copilot instructions updated at ${targetPath}`);
  log('Note: Copilot\'s user-level instructions file path can change between');
  log('releases. If this path looks wrong, check current GitHub documentation');
  log('and see adapters/copilot/README.md.');
  summary.push(`GitHub Copilot: instructions written at ${targetPath}`);
}

function installCodex() {
  const templatePath = path.join(ADAPTERS_DIR, 'codex', 'AGENTS.md.template');
  const template = fs.readFileSync(templatePath, 'utf8');
  const rendered = renderTemplate(template);

  const targetPath = path.join(os.homedir(), '.codex', 'AGENTS.md');
  const updated = upsertDemarcatedBlock(targetPath, rendered);

  const sizeBytes = Buffer.byteLength(updated, 'utf8');
  log(`OpenAI Codex AGENTS.md updated at ${targetPath} (${sizeBytes} bytes)`);
  if (sizeBytes >= CODEX_SIZE_WARNING_BYTES) {
    log(`Warning: ${targetPath} is ${sizeBytes} bytes, approaching or past Codex's`);
    log('documented 32 KB instruction file cap. Codex truncates silently past');
    log('that limit; consider trimming this file. See adapters/codex/README.md.');
    summary.push(`OpenAI Codex: AGENTS.md written at ${targetPath} (${sizeBytes} bytes, WARNING: near/over 32 KB cap)`);
  } else {
    summary.push(`OpenAI Codex: AGENTS.md written at ${targetPath} (${sizeBytes} bytes)`);
  }
}

function promptHarnesses() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const question = [
    '',
    'Which harness(es) would you like to install Ironclad for?',
    '  1) Claude Code',
    '  2) GitHub Copilot',
    '  3) OpenAI Codex',
    '  4) All',
    'Enter one or more numbers separated by commas (e.g. "1,3"), or "4" for all: ',
  ].join('\n');

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function parseSelection(answer) {
  const normalized = answer.toLowerCase();
  if (normalized === '' || normalized === '4' || normalized.includes('all')) {
    return { claude: true, copilot: true, codex: true };
  }

  const parts = normalized.split(',').map((p) => p.trim());
  return {
    claude: parts.includes('1'),
    copilot: parts.includes('2'),
    codex: parts.includes('3'),
  };
}

async function main() {
  console.log(readBanner());
  log('Engineering standards for AI coding agents');
  log('');

  installCanonicalContent();
  installBinCommand();

  const answer = await promptHarnesses();
  const selection = parseSelection(answer);

  if (!selection.claude && !selection.copilot && !selection.codex) {
    log('No valid harness selected. Nothing else to install.');
  }

  if (selection.claude) installClaude();
  if (selection.copilot) installCopilot();
  if (selection.codex) installCodex();

  log('');
  log('Summary');
  log('-------');
  for (const line of summary) {
    log(`- ${line}`);
  }
  log('');
  if (selection.claude || selection.copilot || selection.codex) {
    log('\u2713 Ironclad installed successfully.');
  } else {
    log('Ironclad installer finished, nothing was installed.');
  }
  log('');
  log('Re-run this installer at any time to refresh content or add another harness.');
}

main().catch((err) => {
  console.error('Ironclad installer failed:', err);
  process.exitCode = 1;
});
