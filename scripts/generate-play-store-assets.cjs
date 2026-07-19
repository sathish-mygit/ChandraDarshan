#!/usr/bin/env node
/**
 * Export Play Store listing assets from SVG sources in assets/.
 * - play-store/icon-512.png — 512×512 high-res icon (max 1 MB)
 * - play-store/feature-graphic.png — 1024×500 feature graphic (max 15 MB)
 */
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const root = path.join(__dirname, '..');
const outDir = path.join(root, 'play-store');

const exports_ = [
  {
    source: path.join(root, 'assets', 'icon-only.svg'),
    output: path.join(outDir, 'icon-512.png'),
    width: 512,
    height: 512,
    label: 'icon-512.png',
  },
  {
    source: path.join(root, 'assets', 'feature-graphic.svg'),
    output: path.join(outDir, 'feature-graphic.png'),
    width: 1024,
    height: 500,
    label: 'feature-graphic.png',
  },
];

async function exportPng({ source, output, width, height, label }) {
  if (!fs.existsSync(source)) {
    console.error(`missing source: ${path.relative(root, source)}`);
    process.exit(1);
  }

  await sharp(source)
    .resize(width, height)
    .png({ compressionLevel: 9 })
    .toFile(output);

  const { size: bytes } = fs.statSync(output);
  const kb = (bytes / 1024).toFixed(1);
  console.log(`wrote play-store/${label} (${width}×${height}, ${kb} KB)`);
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  for (const item of exports_) {
    await exportPng(item);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
