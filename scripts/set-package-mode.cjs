#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { PACKAGE_MODE_FILE } = require('./lib/android-flavor.cjs');

const mode = (process.argv[2] || 'auto').toLowerCase();
const modeFile = path.join(__dirname, '..', PACKAGE_MODE_FILE);

if (mode === 'auto') {
  if (fs.existsSync(modeFile)) {
    fs.unlinkSync(modeFile);
  }
  console.log('Package mode: auto (branch rules)');
} else if (mode === 'shared' || mode === 'isolate') {
  fs.writeFileSync(modeFile, `${mode}\n`);
  console.log(`Package mode: ${mode} (persists until npm run build:reset-package)`);
} else {
  console.error(`Invalid package mode "${mode}". Use auto, shared, or isolate.`);
  process.exit(1);
}
