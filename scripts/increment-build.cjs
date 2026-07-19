#!/usr/bin/env node

const fs = require('fs');
const {
  getCurrentBranch,
  getBuildInfoPath,
  readBuildInfo,
  writeBuildInfoTs,
} = require('./buildinfo-ts.cjs');

const currentBranch = getCurrentBranch();
const buildInfoPath = getBuildInfoPath(currentBranch);

let buildInfo = readBuildInfo(currentBranch);

if (!fs.existsSync(buildInfoPath)) {
  console.log(`Creating ${buildInfoPath} with defaults for ${currentBranch}`);
}

buildInfo.buildNumber++;
buildInfo.versionCode++;
buildInfo.lastBuildDate = new Date().toISOString();

fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2));
writeBuildInfoTs(buildInfo, currentBranch);

const buildDate = new Date(buildInfo.lastBuildDate).toLocaleDateString();
const formattedBuild = `Build #${buildInfo.buildNumber} (${currentBranch}) - ${buildDate}`;
console.log(`✓ ${formattedBuild}`);
