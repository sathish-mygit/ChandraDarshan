#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const {
  getCurrentBranch,
  getBuildConfigPath,
  readBuildInfo,
  writeBuildInfoTs,
} = require('./buildinfo-ts.cjs');

const buildConfigPath = getBuildConfigPath();

if (!fs.existsSync(buildConfigPath)) {
  const branch = getCurrentBranch();
  writeBuildInfoTs(readBuildInfo(branch), branch);
  console.log(`✓ Created ${path.relative(process.cwd(), buildConfigPath)} for local dev`);
}
