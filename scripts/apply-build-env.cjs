#!/usr/bin/env node
/**
 * Apply env files before `next build` so Capacitor web assets match Android flavor.
 * - dev  → .env.development
 * - prod → .env.production + Next.js default env (.env, .env.local)
 *
 * Usage: node scripts/apply-build-env.cjs [dev|prod]
 * Flavor: arg > CAPACITOR_FLAVOR > git branch > .package-resolved.json
 */

const fs = require('fs');
const path = require('path');
const { loadEnvFile } = require('./lib/load-env-file.cjs');
const { resolveFlavor, getProjectRoot } = require('./lib/android-flavor.cjs');

const rootDir = getProjectRoot();
const packageResolvedPath = path.join(rootDir, 'android', '.package-resolved.json');

function logAnalyticsStatus() {
  const flag = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED ?? '(unset)';
  const enabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true';
  console.log(`Analytics: ${enabled ? 'enabled' : 'disabled'} (NEXT_PUBLIC_ANALYTICS_ENABLED=${flag})`);
}

function resolveBuildFlavor(flavorArg) {
  if (flavorArg) {
    return resolveFlavor(flavorArg);
  }
  try {
    if (fs.existsSync(packageResolvedPath)) {
      const manifest = JSON.parse(fs.readFileSync(packageResolvedPath, 'utf8'));
      if (manifest.flavor === 'dev' || manifest.flavor === 'prod') {
        return manifest.flavor;
      }
    }
  } catch {
    // fall through
  }
  return resolveFlavor();
}

function applyBuildEnv(flavorArg) {
  const flavor = resolveBuildFlavor(flavorArg);

  if (flavor === 'dev') {
    const devEnvPath = path.join(rootDir, '.env.development');
    const { loaded, keys } = loadEnvFile(devEnvPath, { override: true });
    if (!loaded) {
      console.error(`Missing ${devEnvPath}. Required for dev Android/web builds.`);
      process.exit(1);
    }
    console.log(`Build env: dev — loaded .env.development (${keys.length} keys)`);
    logAnalyticsStatus();
    return flavor;
  }

  const prodEnvPath = path.join(rootDir, '.env.production');
  const { loaded, keys } = loadEnvFile(prodEnvPath, { override: false });
  console.log(
    loaded
      ? `Build env: prod — loaded .env.production (${keys.length} keys) + Next.js default env`
      : 'Build env: prod — using Next.js default env (.env / .env.local / .env.production)',
  );
  logAnalyticsStatus();
  return flavor;
}

if (require.main === module) {
  applyBuildEnv(process.argv[2]);
}

module.exports = { applyBuildEnv, resolveBuildFlavor };
