#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { resolvePackageManifest } = require('./lib/android-flavor.cjs');

const manifest = resolvePackageManifest();
const outPath = path.join(__dirname, '..', 'android', '.package-resolved.json');

fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2));

console.log(
  `Package: ${manifest.applicationId} (${manifest.packageMode}, branch ${manifest.branch}, flavor ${manifest.flavor})`,
);
