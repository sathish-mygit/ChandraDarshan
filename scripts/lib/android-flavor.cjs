#!/usr/bin/env node
/**
 * Android flavor, package isolation, and Gradle task resolution.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BASE_APP_ID = 'com.sathish.utilites.chandra_darshan';
const CANONICAL_DEV_ID = `${BASE_APP_ID}.dev`;

const FLAVORS = {
  dev: {
    appId: CANONICAL_DEV_ID,
    appName: '[Dev] Chandra Darshan',
  },
  prod: {
    appId: BASE_APP_ID,
    appName: 'Chandra Darshan',
  },
};

const DEFAULT_BUILD_TYPES = {
  dev: 'debug',
  prod: 'release',
};

const PACKAGE_MODE_FILE = '.capacitor-package-mode';

function getProjectRoot() {
  return path.join(__dirname, '..', '..');
}

function getCurrentBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
  } catch {
    return 'main';
  }
}

function getFlavorFromBranch(branch) {
  if (branch === 'main' || branch === 'master' || branch === 'HEAD') {
    return 'prod';
  }
  return 'dev';
}

function resolveFlavor(flavorArg) {
  const flavor = (
    flavorArg ??
    process.env.CAPACITOR_FLAVOR ??
    getFlavorFromBranch(getCurrentBranch())
  ).toLowerCase();

  if (flavor !== 'dev' && flavor !== 'prod') {
    throw new Error(`Invalid flavor "${flavor}". Use "dev" or "prod".`);
  }

  return flavor;
}

function describeFlavorSource(flavorArg, envFlavor = process.env.CAPACITOR_FLAVOR) {
  if (flavorArg) {
    return `explicit arg (${flavorArg})`;
  }
  if (envFlavor) {
    return `CAPACITOR_FLAVOR (${envFlavor})`;
  }
  const branch = getCurrentBranch();
  return `branch (${branch})`;
}

function sanitizeBranchSuffix(branch) {
  if (branch === 'main' || branch === 'master' || branch === 'HEAD') {
    return 'main';
  }
  if (branch === 'develop') {
    return 'develop';
  }
  return branch.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
}

function branchDisplayLabel(branch) {
  return branch
    .replace(/^(feature|bugfix|hotfix)\//g, '')
    .replace(/_/g, '-');
}

function resolvePackageMode() {
  const envMode = process.env.CAPACITOR_PACKAGE_MODE?.toLowerCase();
  if (envMode === 'auto' || envMode === 'shared' || envMode === 'isolate') {
    return envMode;
  }

  const modeFile = path.join(getProjectRoot(), PACKAGE_MODE_FILE);
  if (fs.existsSync(modeFile)) {
    const fileMode = fs.readFileSync(modeFile, 'utf8').trim().toLowerCase();
    if (fileMode === 'shared' || fileMode === 'isolate') {
      return fileMode;
    }
  }

  return 'auto';
}

function shouldIsolateDevPackage(branch, mode) {
  if (mode === 'shared') {
    return false;
  }
  if (mode === 'isolate') {
    return true;
  }
  return branch !== 'develop' && branch !== 'main' && branch !== 'master' && branch !== 'HEAD';
}

function resolveDevApplicationId(branch, mode) {
  if (!shouldIsolateDevPackage(branch, mode)) {
    return CANONICAL_DEV_ID;
  }
  const suffix = sanitizeBranchSuffix(branch);
  return `${CANONICAL_DEV_ID}.${suffix}`;
}

function resolveApplicationId(flavor, branch, mode) {
  if (flavor === 'prod') {
    return BASE_APP_ID;
  }
  return resolveDevApplicationId(branch, mode);
}

function resolveAppName(flavor, branch, mode) {
  if (flavor === 'prod') {
    return 'Chandra Darshan';
  }
  if (!shouldIsolateDevPackage(branch, mode)) {
    return '[Dev] Chandra Darshan';
  }
  const label = branchDisplayLabel(branch);
  return `[${label}] Chandra Darshan`;
}

function resolveArtifactTag(flavor, branch, mode) {
  if (flavor === 'prod') {
    return 'prod';
  }
  if (!shouldIsolateDevPackage(branch, mode)) {
    return 'dev';
  }
  return `dev_${sanitizeBranchSuffix(branch)}`;
}

function isCanonicalDevPackage(applicationId) {
  return applicationId === CANONICAL_DEV_ID;
}

function resolvePackageManifest(flavorArg) {
  const branch = getCurrentBranch();
  const flavor = resolveFlavor(flavorArg);
  const packageMode = resolvePackageMode();
  const prodApplicationId = BASE_APP_ID;
  const devApplicationId = resolveDevApplicationId(branch, packageMode);
  const applicationId = flavor === 'prod' ? prodApplicationId : devApplicationId;

  return {
    branch,
    flavor,
    packageMode,
    applicationId,
    prodApplicationId,
    devApplicationId,
    appName: resolveAppName(flavor, branch, packageMode),
    prodAppName: 'Chandra Darshan',
    devAppName: resolveAppName('dev', branch, packageMode),
    artifactTag: resolveArtifactTag(flavor, branch, packageMode),
    artifactTagProd: 'prod',
    artifactTagDev: resolveArtifactTag('dev', branch, packageMode),
    isCanonicalDev: isCanonicalDevPackage(devApplicationId),
  };
}

function resolveGradleTask(flavor, buildType) {
  const normalizedFlavor = flavor.toLowerCase();
  if (normalizedFlavor !== 'dev' && normalizedFlavor !== 'prod') {
    throw new Error(`Invalid flavor "${flavor}". Use "dev" or "prod".`);
  }

  const normalizedBuildType = (buildType ?? DEFAULT_BUILD_TYPES[normalizedFlavor]).toLowerCase();
  if (normalizedBuildType !== 'debug' && normalizedBuildType !== 'release') {
    throw new Error(`Invalid build type "${buildType}". Use "debug" or "release".`);
  }

  const flavorCap = normalizedFlavor.charAt(0).toUpperCase() + normalizedFlavor.slice(1);
  const buildTypeCap = normalizedBuildType.charAt(0).toUpperCase() + normalizedBuildType.slice(1);
  return `assemble${flavorCap}${buildTypeCap}`;
}

module.exports = {
  BASE_APP_ID,
  CANONICAL_DEV_ID,
  FLAVORS,
  DEFAULT_BUILD_TYPES,
  PACKAGE_MODE_FILE,
  getProjectRoot,
  getCurrentBranch,
  getFlavorFromBranch,
  sanitizeBranchSuffix,
  resolvePackageMode,
  shouldIsolateDevPackage,
  resolveDevApplicationId,
  resolveApplicationId,
  resolveAppName,
  resolveArtifactTag,
  isCanonicalDevPackage,
  resolvePackageManifest,
  resolveFlavor,
  describeFlavorSource,
  resolveGradleTask,
};
