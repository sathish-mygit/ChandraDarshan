# AdMob interstitials (native Android)

Navigation interstitials for the **Astro** tab (`/jyotish/`) with optional Home/Settings fallback placements. Runtime toggles and caps are controlled via **Firebase Remote Config** (handcricketpro-style modular framework).

## Prerequisites

1. Firebase project with Remote Config enabled (same prod project as Analytics).
2. AdMob app registered for prod package `com.sathish.utilites.chandra_darshan`.
3. `@capacitor-community/admob` installed and synced (`npx cap sync android`).

## Build-time env

Set in `.env.production` or `.env.local`:

```env
NEXT_PUBLIC_ADS_ENABLED=true
NEXT_PUBLIC_AD_USE_GOOGLE_SAMPLE_UNITS=true   # dev/testing only
NEXT_PUBLIC_ADMOB_APP_ID_ANDROID=ca-app-pub-...
NEXT_PUBLIC_ADMOB_INTERSTITIAL_AD_UNIT_ID_ANDROID=ca-app-pub-.../...
```

Optional fallback defaults (overridable via Remote Config):

```env
NEXT_PUBLIC_ADS_FALLBACK_WHEN_NO_JYOTISH=false
NEXT_PUBLIC_ADS_FALLBACK_HOME=false
NEXT_PUBLIC_ADS_FALLBACK_SETTINGS=false
```

`NEXT_PUBLIC_ADS_ENABLED=false` skips the entire ad stack (no RC fetch, no AdMob init).

## Native Android

1. **App ID** — [`android/app/src/main/res/values/strings.xml`](../../android/app/src/main/res/values/strings.xml) `admob_app_id` (Google sample ID by default).
2. **Manifest** — [`AndroidManifest.xml`](../../android/app/src/main/AndroidManifest.xml) `com.google.android.gms.ads.APPLICATION_ID` meta-data.
3. Rebuild: `npm run build:android:prod` (user-run).

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
| `interstitial_toHome` / `interstitial_toSettings` | Fallback placements |
| `ads_fallback_when_no_jyotish` | Enable fallback when Astro not visited this session |
| `ads_fallback_home` / `ads_fallback_settings` | Per-route fallback toggles |
| `interstitial_minIntervalMs` / `interstitial_maxPerSession` | Global caps |
| `freqCap_interstitial_*` | Per-placement daily/hourly caps |
| `ivt_navigationDelayMs` | Delay before show after navigation (~800ms) |
| `engagement_minAppSessions` | Min sessions before ads unlock |

RC values override `src/config/ads.ts` defaults at runtime on native.

## Behavior

- **Primary:** navigating to `/jyotish/` → `interstitial.toJyotish` after IVT delay.
- **Fallback:** when RC enables fallback and user has **not** opened Astro this session, Home or Settings navigation can show their placements.
- Central hook: [`AdNavigationBridge.tsx`](../../src/components/AdNavigationBridge.tsx) + [`placement-resolver.ts`](../../src/lib/ads/placement-resolver.ts).
- Init: [`AppLifecycleManager.tsx`](../../src/components/AppLifecycleManager.tsx) fetches RC then `adService.init()`.

## Diagnostics

When `NEXT_PUBLIC_TEST_MODE=true`, Settings shows **Ad diagnostics** (native only): placement matrix, RC fallback state, test show/preload, Ad Inspector.

## Analytics

Page visits: `home_page_visited`, `astro_page_visited`, `settings_page_visited` (see [firebase setup](02-firebase.md)).

Ad events: `ad_interstitial_evaluated` via ported framework when analytics enabled.

## Related

- [Firebase setup](02-firebase.md)
- [Android build](04-android-build.md)
