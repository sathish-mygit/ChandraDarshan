# Firebase Analytics and Crashlytics (prod only)

Production telemetry for Chandra Darshan: **Firebase Analytics** (page views, custom events) and **Crashlytics** (native crashes and non-fatal errors). Dev flavor builds stay telemetry-free.

## Scope

| Included | Not included |
|----------|----------------|
| Prod Firebase project + `google-services.json` | Dev/staging Firebase project |
| Page / screen tracking | Firebase Auth |
| Custom preference and Jyotish events | App Check |
| Page visit events (`home_page_visited`, `astro_page_visited`, `settings_page_visited`) | |
| Crashlytics on native Android | |

## Prerequisites

1. A Firebase project (e.g. `chandra-darshan`).
2. Google Analytics enabled for that project.
3. Crashlytics enabled in Firebase Console (add the Android SDK when prompted).

## 1. Register the Android app (prod only)

1. Open [Firebase Console](https://console.firebase.google.com/) → your project.
2. **Add app** → Android.
3. Package name: **`com.sathish.utilites.chandra_darshan`** (must match prod flavor).
4. Download `google-services.json`.
5. Place it at:

   ```
   android/app/src/prod/google-services.json
   ```

   This path is gitignored. Do not commit it.

6. Rebuild so Gradle applies the Google Services and Crashlytics plugins:

   ```bash
   npm run build:android:prod
   ```

   Until this file exists, Android builds still succeed — Firebase Gradle plugins are skipped.

   When the prod file exists, **dev** flavor builds still work: Gradle skips `processDev*GoogleServices` (dev is not registered in Firebase).

## 2. Web / JS Firebase config

Copy the Firebase **web app** config into `.env.production` (or `.env.local` for machine-only overrides):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
```

When ready to collect telemetry on prod builds:

```env
NEXT_PUBLIC_ANALYTICS_ENABLED=true
```

**Dev builds** (`.env.development`) keep `NEXT_PUBLIC_ANALYTICS_ENABLED=false`.

## 3. Build and env flow

```text
main branch + CAPACITOR_FLAVOR=prod
    → apply-build-env loads .env.production
    → NEXT_PUBLIC_ANALYTICS_ENABLED baked into out/
    → cap sync → prodRelease APK/AAB with google-services.json
```

Dev branch builds load `.env.development` and never send events.

## 4. What gets tracked

### Automatic

| Event | Source |
|-------|--------|
| `screen_view` | `AnalyticsTracker` on route change |
| `page_duration` | Time on previous page (>500 ms) |
| Unhandled errors | `AppTelemetry` → Crashlytics (native) or Analytics `exception` (web) |

### Custom (no PII)

| Event | When | Params |
|-------|------|--------|
| `preference_changed` | Language, maasa, or location update | `setting`, `value` (enum / `city` \| `gps`) |
| `birth_profile_saved` | Birth profile saved | `has_birth_time` |
| `birth_profile_cleared` | Birth profile removed | — |
| `glossary_opened` | Glossary tooltip opened | `term_id` |
| `home_page_visited` | User navigates to Today / home | `route_path` |
| `astro_page_visited` | User navigates to Astro tab (`/jyotish/`) | `route_path` |
| `settings_page_visited` | User navigates to Settings | `route_path` |

`screen_view` uses `route_segment: astro` for the Astro tab (URL remains `/jyotish/`).

User properties (segmentation): `app_language`, `masa_system`, `has_birth_profile`, `location_source`, `platform`.

Never logged: birth date/time, coordinates, names, or city labels.

## 5. Verify

### Dev build (telemetry off)

```bash
npm run build:android:dev
```

Build log should show: `Analytics: disabled`.

### Prod build (after Firebase config)

```bash
npm run build:android:prod
```

Build log should show: `Analytics: enabled` when `NEXT_PUBLIC_ANALYTICS_ENABLED=true`.

On device:

```powershell
adb shell setprop debug.firebase.analytics.app com.sathish.utilites.chandra_darshan
```

Open the app, navigate **Today → Jyotish → Settings**. Check **Firebase Console → Analytics → DebugView** for `screen_view` and `preference_changed`.

Crashlytics: open **Settings** on a prod debug APK with analytics enabled. Tap **Test fatal crash** once to enable Crashlytics in Console (app will close). Use **Test non-fatal error** to verify reporting without killing the app. Reports appear within ~15 minutes.

**Note:** Set `NEXT_PUBLIC_ANALYTICS_ENABLED=true` in `.env.production` (or your prod debug env) before building so Crashlytics initializes.

### Typecheck / lint

```bash
npm run typecheck
npm run lint
```

## 6. Key files

| File | Role |
|------|------|
| `src/config/analytics.ts` | `isAnalyticsEnabled()` gate |
| `src/lib/firebase/client.ts` | Minimal Firebase init for web Analytics |
| `src/lib/analytics/analytics.service.ts` | Native + web event bridge |
| `src/lib/analytics/crashlytics.service.ts` | Native Crashlytics + web exception events |
| `src/components/CrashlyticsTestPanel.tsx` | Settings buttons for fatal / non-fatal Crashlytics tests |
| `src/components/AnalyticsTracker.tsx` | Route tracking |
| `src/components/AppTelemetry.tsx` | Build metadata, user properties, global errors |
| `capacitor.config.ts` | `FirebaseAnalytics.enabled` at build time |
| `android/app/build.gradle` | Conditional `google-services` + Crashlytics plugins |

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| No events in DebugView | Confirm `NEXT_PUBLIC_ANALYTICS_ENABLED=true` in prod env; full `npm run build`, not Studio-only Run |
| Gradle fails on google-services | Package in json must match `com.sathish.utilites.chandra_darshan`; dev flavor should skip processing automatically — rebuild after pulling latest `android/app/build.gradle` |
| Crashlytics empty | Enable Crashlytics in Console; use prod flavor with `google-services.json` |
| Events in dev APK | Expected if flag is true — use dev env with `ANALYTICS_ENABLED=false` |

## Related

- [Android build pipeline](04-android-build.md)
- Agent skill: [`.cursor/skills/android-build-pipeline/SKILL.md`](../../.cursor/skills/android-build-pipeline/SKILL.md)
