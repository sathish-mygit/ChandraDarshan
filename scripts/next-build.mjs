#!/usr/bin/env node
/**
 * Run `next build` after applying flavor-specific env (dev → .env.development).
 */

import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { applyBuildEnv } = require('./apply-build-env.cjs');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

applyBuildEnv(process.env.CAPACITOR_FLAVOR ?? process.argv[2]);

const result = spawnSync('npx', ['next', 'build'], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true,
  env: process.env,
});

process.exit(result.status ?? 1);
