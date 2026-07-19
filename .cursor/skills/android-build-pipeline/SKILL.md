---
name: android-build-pipeline
description: >-
  Chandra Darshan Android dev/prod flavors, package isolation, artifact naming,
  and build env wiring. Use when changing npm run build, CAPACITOR_FLAVOR,
  devDebug vs prodRelease, .env.development, package IDs, or Gradle variants.
---

# Android build pipeline (Chandra Darshan)

## Read this first: two axes

| Axis | Values | What it controls |
|------|--------|------------------|
| **Flavor** | `dev` \| `prod` | JS env file for `next build`, Gradle variant |
| **Package mode** | `auto` \| `shared` \| `isolate` | Dev **applicationId** only (prod is always `com.sathish.utilites.chandra_darshan`) |

Flavor and package are **independent**. Example: `develop` branch → flavor **dev** + package **`…chandra_darshan.dev`** (auto). Play Store bundle from `develop` uses **`CAPACITOR_FLAVOR=prod`** but can keep develop package mode.

Canonical source: [`scripts/lib/android-flavor.cjs`](scripts/lib/android-flavor.cjs). User-facing summary: [`docs/03-setup/04-android-build.md`](docs/03-setup/04-android-build.md).

---

## Determine current flavor and package

**Before changing Android config**, resolve what the repo thinks is active:

```bash
node scripts/resolve-android-package.cjs
```

Reads/writes [`android/.package-resolved.json`](android/.package-resolved.json). Key fields:

| Field | Meaning |
|-------|---------|
| `flavor` | `dev` or `prod` |
| `branch` | Current git branch |
| `packageMode` | `auto`, `shared`, or `isolate` |
| `applicationId` | Installed Android package for **selected flavor** |
| `devApplicationId` | Package used when building **dev** variant |
| `artifactTag` | Suffix in AAB/APK filename |
| `isCanonicalDev` | `true` if dev package is exactly `…chandra_darshan.dev` |

**Flavor resolution order** (first match wins):

1. CLI arg to `build-android.mjs` (`dev` / `prod`)
2. `CAPACITOR_FLAVOR` env var
3. Git branch: `main` / `master` → **prod**; everything else → **dev**

**Package mode** (dev applicationId):

| Mode | How set | Dev package on `develop` | Dev package on `feature/foo` |
|------|---------|--------------------------|------------------------------|
| `auto` (default) | branch rules | `com.sathish.utilites.chandra_darshan.dev` | `…chandra_darshan.dev.feature_foo` |
| `shared` | `npm run build:shared` or `.capacitor-package-mode` | `…chandra_darshan.dev` | `…chandra_darshan.dev` |
| `isolate` | `npm run build:isolated` | `…chandra_darshan.dev.develop` | `…chandra_darshan.dev.feature_foo` |

Override: `CAPACITOR_PACKAGE_MODE=shared|isolate|auto`

Constants:

- Prod base: `com.sathish.utilites.chandra_darshan`
- Canonical dev: `com.sathish.utilites.chandra_darshan.dev`

---

## Build sequence (`npm run build`)

```text
resolve-android-package.cjs  →  android/.package-resolved.json
increment-build.cjs          →  buildinfo-{branch}.json + src/config/buildinfo-generated.ts
next-build.mjs               →  apply-build-env + next build → out/
cap sync android
```

Full APK pipeline (`npm run build:android:dev`) adds Gradle `assembleDevDebug` or `assembleProdRelease` after sync.

### Per-branch build metadata (committed)

| File | In git? | Role |
|------|---------|------|
| `buildinfo-{branch}.json` | **Yes — commit after build** | Source of truth for `versionCode`, `versionName`, `buildNumber` on this branch |
| `src/config/buildinfo-generated.ts` | No (gitignored) | UI-facing snapshot regenerated each build from the JSON |

**Why branch in the filename:** so each branch commits its own counter (`buildinfo-develop.json`, `buildinfo-feature-foo.json`, …) instead of one shared `buildinfo.json` that would conflict on every merge. Do **not** gitignore `buildinfo-*.json`. Do **not** rename to a single file.

Gradle and `next.config.ts` read `buildinfo-{currentBranch}.json` via the same branch name from git.

---

## Naming conventions

### App display names (launcher)

| Context | Name |
|---------|------|
| prod flavor | `Chandra Darshan` |
| dev on `develop` / shared | `[Dev] Chandra Darshan` |
| dev isolated feature branch | `[feature-name] Chandra Darshan` |

### Artifact files

Pattern: `chandra_darshan_{versionName}_{versionCode}_{artifactTag}_v1.{aab|apk}`

Examples:

- `chandra_darshan_0.1.0_5_prod_v1.aab`
- `chandra_darshan_0.0.1_3_dev_v1.aab`
- `chandra_darshan_0.0.1_2_dev_feature_auth_v1.aab`

### Android Studio variants

| Variant | Typical use |
|---------|-------------|
| **devDebug** | Day-to-day on `develop` |
| **devRelease** | Signed dev build |
| **prodRelease** | Play Store |
| **prodDebug** | Rare; prod package, debuggable |

Default Gradle tasks from scripts: dev → `assembleDevDebug`, prod → `assembleProdRelease`.

---

## Build env (web bundle)

| Build | Env source | Applied by |
|-------|------------|------------|
| **dev** | [`.env.development`](.env.development) | [`scripts/apply-build-env.cjs`](scripts/apply-build-env.cjs) → [`scripts/next-build.mjs`](scripts/next-build.mjs) |
| **prod** | `.env.production` + Next.js defaults | same |
| **`next dev`** | `.env.development` | Next.js automatic |

Build log must include:

```text
Build env: dev — loaded .env.development (N keys)
```

**Critical:** Android Studio **Run** does not rebuild the web bundle. Always run `npm run build` (or `npm run build:android:dev`) first so `out/` → `cap sync` → native assets are current.

---

## Build commands (quick reference)

| Command | Flavor | Package | Env |
|---------|--------|---------|-----|
| `npm run build` | branch-based | branch-based (`auto`) | dev or prod per flavor |
| `npm run build:android:dev` | dev | per branch/mode | `.env.development` |
| `npm run build:android:prod` | prod | prod id | `.env.production` |
| `npm run build:shared` | — | forces `…chandra_darshan.dev` | then `npm run build` |
| `npm run build:isolated` | — | branch-specific dev package | then `npm run build` |
| `CAPACITOR_FLAVOR=prod npm run build` | prod on any branch | per branch/mode | prod env |

Play Store from `develop`:

```powershell
$env:CAPACITOR_FLAVOR='prod'
npm run build
# Android Studio → prodRelease → Generate Signed Bundle
```

---

## Firebase (prod Analytics + Crashlytics)

Configured for **prod flavor only**. See [docs/03-setup/02-firebase.md](../../docs/03-setup/02-firebase.md).

| Item | Location |
|------|----------|
| `google-services.json` | `android/app/src/prod/` (committed; prod flavor only) |
| Web Firebase keys | `.env.production` or `.env.local` |
| Enable flag | `NEXT_PUBLIC_ANALYTICS_ENABLED=true` in prod env only |
| Dev flavor | No Firebase file; telemetry suppressed in JS |

Gradle applies `google-services` and Crashlytics plugins when `android/app/src/prod/google-services.json` exists, but **disables** `process*GoogleServices` for the **dev** flavor so devDebug/devRelease builds do not require a dev `google-services.json`.

`capacitor.config.ts` sets `FirebaseAnalytics.enabled` from `NEXT_PUBLIC_ANALYTICS_ENABLED` at build time.

Not in scope: Auth, App Check, Remote Config, dev/staging Firebase project.

---

## Key files

| File | Role |
|------|------|
| `scripts/lib/android-flavor.cjs` | Flavor, package, artifact tag resolution |
| `scripts/resolve-android-package.cjs` | Writes `.package-resolved.json` |
| `scripts/apply-build-env.cjs` | Loads env before `next build` |
| `scripts/next-build.mjs` | Env + `next build` |
| `scripts/build-android.mjs` | Full web + sync + Gradle APK |
| `scripts/increment-build.cjs` | Per-branch version increment; updates committed `buildinfo-{branch}.json` |
| `buildinfo-{branch}.json` | Committed per-branch version counter (not gitignored) |
| `capacitor.config.ts` | `appId` / `appName` from manifest |
| `android/app/build.gradle` | Flavors, versions, artifact naming |

---

## Branding assets

Source artwork lives in `assets/` (`icon-only.svg`, `icon-background.svg`, `icon-foreground.svg`, `splash.svg`). Regenerate Android mipmaps and splash drawables with:

```bash
npm run assets:generate
```

Do **not** hand-edit `android/app/src/main/res/mipmap-*` or splash PNGs under `drawable-*` — they are overwritten on generate. Moon shape for adaptive icons: `drawable/ic_launcher_moon.xml` (rewritten by `patch-android-adaptive-icon.cjs`; edit the script’s `MOON_VECTOR_XML` or the file directly). Web favicon: `src/app/icon.svg`.
