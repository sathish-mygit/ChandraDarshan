# AdMob interstitials + Meta mediation (native Android)

Navigation interstitials for the **Astro** tab (`/jyotish/`) and **Match** tab (`/match/`), with optional Home/Settings fallback placements. Ads may fill from **Google AdMob** and **Meta Audience Network** (via AdMob mediation). Runtime toggles and caps are controlled via **Firebase Remote Config**.

## Prerequisites

1. Firebase project with Remote Config enabled (same prod project as Analytics).
2. AdMob app registered for prod package `com.sathish.utilites.chandra_darshan`.
3. `@capacitor-community/admob` installed and synced (`npx cap sync android`).
4. Meta Business Manager property + AdMob mediation groups configured (see [Meta mediation setup](#meta-mediation-setup)).

## Build-time env

Set in `.env.production` or `.env.local`:

```env
NEXT_PUBLIC_ADS_ENABLED=true
NEXT_PUBLIC_ADMOB_APP_ID_ANDROID=ca-app-pub-...
NEXT_PUBLIC_ADMOB_INTERSTITIAL_AD_UNIT_ID_ANDROID=ca-app-pub-.../...
```

Optional fallback defaults (overridable via Remote Config):

```env
NEXT_PUBLIC_ADS_FALLBACK_WHEN_NO_JYOTISH=false
NEXT_PUBLIC_ADS_FALLBACK_HOME=false
NEXT_PUBLIC_ADS_FALLBACK_SETTINGS=false
```

**Production ad units (default):** required for AdMob mediation / Meta fill. Do **not** set `NEXT_PUBLIC_AD_USE_GOOGLE_SAMPLE_UNITS` for mediation testing.

**Google sample units (optional):** set only for quick AdMob smoke tests without mediation:

```env
NEXT_PUBLIC_AD_USE_GOOGLE_SAMPLE_UNITS=true
```

`NEXT_PUBLIC_ADS_ENABLED=false` skips the entire ad stack (no RC fetch, no AdMob init).

## Native Android

1. **App ID** — [`android/app/src/main/res/values/strings.xml`](../../android/app/src/main/res/values/strings.xml) `admob_app_id`.
2. **Manifest** — [`AndroidManifest.xml`](../../android/app/src/main/AndroidManifest.xml) `com.google.android.gms.ads.APPLICATION_ID` meta-data.
3. **Meta mediation adapter** — [`android/app/build.gradle`](../../android/app/build.gradle):
   ```groovy
   implementation 'com.google.ads.mediation:facebook:6.18.0.0'
   ```
   The adapter transitively pulls Meta Audience Network SDK 6.18.0. No separate Facebook Login SDK is used.
4. **Play Services Ads pin** — [`android/variables.gradle`](../../android/variables.gradle) `playServicesAdsVersion = '23.2.0'` (used by `@capacitor-community/admob`).
5. **Ad Inspector** — [`AdInspectorPlugin.java`](../../android/app/src/main/java/com/sathish/utilites/chandra_darshan/AdInspectorPlugin.java) registered in `MainActivity`.
6. Rebuild: `npm run build:android:prod` then `npx cap sync android` (user-run).

## Meta mediation setup

Manual steps in AdMob and Meta consoles (required before Meta ads fill):

| Step | Where | Action |
|------|--------|--------|
| 1 | [Meta Business Manager](https://business.facebook.com/) | Create property for `com.sathish.utilites.chandra_darshan`, add Android app, create interstitial placements |
| 2 | [AdMob Console](https://apps.admob.com/) | On interstitial unit `ca-app-pub-7828121987315128/5637523373`, add **Meta Audience Network** as **bidding** source with Placement IDs |
| 3 | AdMob UI | Add Meta to GDPR / US state regulations ad partners lists |
| 4 | Meta + AdMob | Enable test mode on both; register physical test device ID |
| 5 | Test device | Meta recommends Facebook app installed and logged in |
| 6 | Release | Disable test modes; keep production ad units |

Prod IDs (also in `.env.production`):

| Item | ID |
|------|-----|
| AdMob app (Android) | `ca-app-pub-7828121987315128~9576768387` |
| Interstitial | `ca-app-pub-7828121987315128/5637523373` |

No app-level Meta init code is required — mediation is handled natively by the AdMob SDK and adapter.

## Firebase Remote Config

Template: [`firebase-remote-config.json`](../../firebase-remote-config.json)

Deploy:

```bash
firebase deploy --only remoteconfig
```

### Key parameters

| RC key | Effect |
|--------|--------|
| `ads_master` | Global kill switch |
| `interstitial_toJyotish` | Astro tab navigation interstitial |
| `interstitial_toMatch` | Match tab navigation interstitial |
| `interstitial_toHome` / `interstitial_toSettings` | Fallback placements |
| `ads_fallback_when_no_jyotish` | Enable fallback when Astro not visited this session |
| `ads_fallback_home` / `ads_fallback_settings` | Per-route fallback toggles |
| `interstitial_minIntervalMs` / `interstitial_maxPerSession` | Global caps |
| `freqCap_interstitial_*` | Per-placement daily/hourly caps |
| `ivt_navigationDelayMs` | Delay before show after navigation (~800ms) |
| `engagement_minAppSessions` | Min sessions before ads unlock |

RC values override `src/config/ads.ts` defaults at runtime on native.

## Behavior

- **Primary:** navigating to `/jyotish/` → `interstitial.toJyotish`; navigating to `/match/` → `interstitial.toMatch` (after IVT delay).
- **Fallback:** when RC enables fallback and user has **not** opened Astro this session, Home or Settings navigation can show their placements.
- Central hook: [`AdNavigationBridge.tsx`](../../src/components/AdNavigationBridge.tsx) + [`placement-resolver.ts`](../../src/lib/ads/placement-resolver.ts).
- Init: [`AppLifecycleManager.tsx`](../../src/components/AppLifecycleManager.tsx) fetches RC then `adService.init()`.

## Diagnostics

When `NEXT_PUBLIC_TEST_MODE=true`, Settings shows **Ad diagnostics** (native only): placement matrix, RC fallback state, test show/preload, Ad Inspector.

### Ad Inspector (mediation verification)

Requirements:

- Native Android build with `AdInspectorPlugin` in `MainActivity`
- `NEXT_PUBLIC_ADS_ENABLED=true` and production ad units (not sample units)
- Device registered as AdMob test device
- Load at least one ad before opening Inspector

From Settings → Ad diagnostics → **Open Ad Inspector** → **Verify adapter integrations** → **Single ad source testing** → Meta Audience Network (Bidding).

Logcat filter: `AdMob|AdService|AdMobProvider|Facebook|AudienceNetwork`

## Analytics

Page visits: `home_page_visited`, `astro_page_visited`, `settings_page_visited` (see [firebase setup](02-firebase.md)).

Ad events: `ad_interstitial_evaluated` via ported framework when analytics enabled.

## Related

- [Firebase setup](02-firebase.md)
- [Android build](04-android-build.md)
