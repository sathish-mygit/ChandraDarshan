#!/usr/bin/env node
/**
 * Full Android build: web assets + cap sync + Gradle APK.
 * Usage: node scripts/build-android.mjs [dev|prod] [debug|release]
 * Flavor: CLI arg > CAPACITOR_FLAVOR > current git branch.
 */

import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const {
  getCurrentBranch,
  resolveFlavor,
  describeFlavorSource,
  resolveGradleTask,
} = require('./lib/android-flavor.cjs');
const { applyBuildEnv } = require('./apply-build-env.cjs');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

const flavorArg = process.argv[2];
applyBuildEnv(flavorArg);
const branch = getCurrentBranch();
const flavor = resolveFlavor(flavorArg);
const source = describeFlavorSource(flavorArg);
const buildType = process.argv[3];
const gradleTask = resolveGradleTask(flavor, buildType);

console.log(`Android build — branch: ${branch}, flavor: ${flavor} (from ${source}), task: ${gradleTask}`);

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? rootDir,
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, CAPACITOR_FLAVOR: flavor, ...options.env },
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run('node', ['scripts/resolve-android-package.cjs']);
run('node', ['scripts/increment-build.cjs']);
run('node', ['scripts/next-build.mjs']);
run('npx', ['cap', 'sync', 'android']);

const gradlew = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
run(gradlew, [gradleTask], { cwd: path.join(rootDir, 'android') });

console.log(`Done — ${flavor} APK via ${gradleTask}`);
