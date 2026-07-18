# Android build

Branch-driven dev/prod flavors, package isolation, and artifact naming for Capacitor Android builds.

## Prerequisites

- Node.js 20+, npm
- Android Studio, JDK 17+, Android SDK
- Git (branch detection is required for flavor and version resolution)

## Default workflow

1. **Build web assets and sync:**

   ```bash
   npm run build
   ```

2. **Open Android Studio** (pick the right variant):

   ```bash
   npx cap open android
   ```

   - Day-to-day on `develop`: **devDebug**
   - Play Store: **prodRelease**

3. **Or full pipeline including Gradle APK:**

   ```bash
   npm run build:android:dev
   ```

Run `npm run build` before Gradle/Android Studio so `android/.package-resolved.json` and `out/` match the current branch.

## Branch → flavor (automatic)

| Git branch | Default flavor |
|------------|----------------|
| `main`, `master` | prod |
| `develop`, feature branches, etc. | dev |

Override flavor:

```powershell
$env:CAPACITOR_FLAVOR='prod'
npm run build
```

Or: `npm run build:android:prod`

## Branch → package (`auto` mode)

| Git branch | Dev package | Installs alongside canonical dev? |
|------------|-------------|-----------------------------------|
| `main` / `master` | prod: `com.sathish.utilites.chandra_darshan` | N/A |
| `develop` | `…chandra_darshan.dev` | Updates shared dev app |
| `feature/*`, etc. | `…chandra_darshan.dev.<branch>` | Yes — separate install |

## Package mode overrides

| Command | Effect |
|---------|--------|
| `npm run build` | `auto` (table above) |
| `npm run build:shared` | Always `…chandra_darshan.dev` |
| `npm run build:isolated` | Always branch-specific package |
| `npm run build:reset-package` | Back to `auto` |

Mode persists in `.capacitor-package-mode` until `build:reset-package`.

Env override: `CAPACITOR_PACKAGE_MODE=shared|isolate|auto`

## Build numbers (per branch)

Each branch maintains its own counter in `buildinfo-{branch}.json` (gitignored). Every `npm run build` increments `versionCode` and writes `src/config/buildinfo-generated.ts` for the UI.

Gradle reads the same file for APK/AAB `versionCode` and `versionName`.

## Environment files

| File | When used |
|------|-----------|
| `.env.development` | Dev flavor builds (committed template) |
| `.env.production` | Prod flavor builds (committed template) |
| `.env.local` | Machine-only overrides (gitignored) |

Build log should show which env was loaded, e.g. `Build env: dev — loaded .env.development`.

## npm scripts reference

| Script | Description |
|--------|-------------|
| `npm run build` | Resolve package → increment version → env-aware `next build` → `cap sync` |
| `npm run build:android` | Full pipeline + Gradle (flavor from branch) |
| `npm run build:android:dev` | Dev flavor, `assembleDevDebug` |
| `npm run build:android:prod` | Prod flavor, `assembleProdRelease` |
| `npm run build:android:dev:release` | Dev release APK |
| `npm run build:android:prod:debug` | Prod debug APK |

## Play Store bundle from `develop`

```powershell
$env:CAPACITOR_FLAVOR='prod'
npm run build
```

Then Android Studio: **prodRelease** → Generate Signed Bundle.

## Artifact naming

AAB/APK names include version and tag:

- `chandra_darshan_0.1.0_5_prod_v1.aab`
- `chandra_darshan_0.0.1_3_dev_debug.apk`
- `chandra_darshan_0.0.1_2_dev_feature_auth_v1.aab`

Output under `android/app/build/outputs/`.

## Inspect resolved config

```bash
node scripts/resolve-android-package.cjs
cat android/.package-resolved.json
```

## Firebase (Phase 3)

Flavor source sets and `google-services.json` are not configured yet. See planned `02-firebase.md`. The dev/prod Gradle flavors are ready for when Firebase is added.

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Wrong app name or package on device | Run `npm run build` first; check `.package-resolved.json` |
| Stale web content in APK | Full `npm run build`, not Studio-only Run |
| Feature branch overwrote dev app | Expected on `develop`; use isolated branch package or `build:isolated` |
| `Missing .env.development` | Ensure `.env.development` exists (committed in repo) |

Agent skill: [`.cursor/skills/android-build-pipeline/SKILL.md`](../../.cursor/skills/android-build-pipeline/SKILL.md)
