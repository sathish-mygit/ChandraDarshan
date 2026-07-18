#!/usr/bin/env node
/**
 * After @capacitor/assets generate, write a vector moon foreground and wire
 * adaptive icons to it. Raster mipmap PNGs blur when scaled on launcher grids.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const resDir = path.join(root, 'android', 'app', 'src', 'main', 'res');
const drawableDir = path.join(resDir, 'drawable');

const MOON_VECTOR_XML = `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path
        android:fillColor="#FEF3C7"
        android:pathData="M54,54m-26,0a26,26,0,1,1,52,0a26,26,0,1,1,-52,0" />
    <path
        android:fillColor="#020617"
        android:pathData="M70,54m-26,0a26,26,0,1,1,52,0a26,26,0,1,1,-52,0" />
</vector>
`;

const ADAPTIVE_ICON_XML = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background" />
    <foreground android:drawable="@drawable/ic_launcher_moon" />
</adaptive-icon>
`;

fs.mkdirSync(drawableDir, { recursive: true });
fs.writeFileSync(path.join(drawableDir, 'ic_launcher_moon.xml'), MOON_VECTOR_XML);
console.log('wrote drawable/ic_launcher_moon.xml');

const legacyForeground = path.join(drawableDir, 'ic_launcher_foreground.xml');
if (fs.existsSync(legacyForeground)) {
  fs.unlinkSync(legacyForeground);
  console.log('removed legacy drawable/ic_launcher_foreground.xml');
}

for (const name of ['ic_launcher.xml', 'ic_launcher_round.xml']) {
  const filePath = path.join(resDir, 'mipmap-anydpi-v26', name);
  fs.writeFileSync(filePath, ADAPTIVE_ICON_XML);
  console.log(`patched adaptive icon: mipmap-anydpi-v26/${name}`);
}
