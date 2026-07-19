import type { CapacitorConfig } from '@capacitor/cli';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

interface PackageManifest {
  applicationId: string;
  appName: string;
  packageMode: string;
  branch: string;
  flavor: string;
}

function loadPackageManifest(): PackageManifest {
  const manifestPath = path.join(__dirname, 'android', '.package-resolved.json');
  if (!fs.existsSync(manifestPath)) {
    execSync('node scripts/resolve-android-package.cjs', {
      cwd: __dirname,
      stdio: 'inherit',
    });
  }
  return JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as PackageManifest;
}

const manifest = loadPackageManifest();
const analyticsEnabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true';

console.log(
  `Capacitor Config - Branch: ${manifest.branch}, Flavor: ${manifest.flavor}, ` +
    `Package: ${manifest.applicationId} (${manifest.packageMode}), App Name: ${manifest.appName}, ` +
    `Analytics: ${analyticsEnabled ? 'enabled' : 'disabled'}`,
);

const config: CapacitorConfig = {
  appId: manifest.applicationId,
  appName: manifest.appName,
  webDir: 'out',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      backgroundColor: '#020617',
      androidSplashResourceName: 'splash',
      showSpinner: false,
    },
    FirebaseAnalytics: {
      logEvents: analyticsEnabled,
      enabled: analyticsEnabled,
    },
  },
};

export default config;
