import type { NextConfig } from 'next';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

let currentBranch = 'unknown';
try {
  currentBranch = execSync('git rev-parse --abbrev-ref HEAD', {
    encoding: 'utf-8',
  }).trim();
} catch {
  console.warn('Could not detect git branch, defaulting to unknown');
}

const buildInfoPath = path.join(__dirname, `buildinfo-${currentBranch}.json`);
let appVersion = currentBranch === 'main' ? '0.1.0' : '0.0.1';

if (fs.existsSync(buildInfoPath)) {
  try {
    const buildInfo = JSON.parse(fs.readFileSync(buildInfoPath, 'utf8'));
    appVersion = buildInfo.versionName || appVersion;
    console.log(
      `Next.js config: version ${appVersion} from buildinfo-${currentBranch}.json`
    );
  } catch {
    console.warn(`Could not read buildinfo-${currentBranch}.json`);
  }
} else {
  console.log(
    `buildinfo-${currentBranch}.json not found (created on first build)`
  );
}

process.env.NEXT_PUBLIC_APP_VERSION = appVersion;

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
