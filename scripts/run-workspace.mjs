#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

const [workspace, script, ...rest] = process.argv.slice(2);

if (!workspace || !script) {
  console.error('Usage: node scripts/run-workspace.mjs <backend|frontend> <script> [args...]');
  process.exit(1);
}

const cwd = workspace === 'backend' ? 'backend' : workspace === 'frontend' ? 'frontend' : workspace;
const userAgent = process.env.npm_config_user_agent ?? '';
const isYarn = userAgent.includes('yarn');

const command = isYarn ? 'yarn' : 'npm';
const args = isYarn ? [script, ...rest] : ['run', script, ...rest];

const result = spawnSync(command, args, {
  cwd,
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

process.exit(result.status ?? 1);
