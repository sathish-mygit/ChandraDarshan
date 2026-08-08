# Firebase Analytics and Crashlytics (prod only)

Production telemetry for Chandra Darshan: **Firebase Analytics** (page views, custom events) and **Crashlytics** (native crashes and non-fatal errors). Dev flavor builds stay telemetry-free.

## Scope

| Included | Not included |
|----------|----------------|
| Prod Firebase project + `google-services.json` | Dev/staging Firebase project |
| Page / screen tracking (routes + Jyotish sub-tabs) | Firebase Auth |
| Custom preference, Jyotish, Match, and navigation events | App Check |
| Page visit + duration events | |
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

6. Rebuild: `npm run build:android:prod`

Automatic Android `MainActivity` screen reporting is **disabled** in `AndroidManifest.xml` so only manual `screen_view` events are logged (required for Capacitor WebView apps).

## 2. Web / JS Firebase config

Copy the Firebase **web app** config into `.env.production`:

```env
NEXT_PUBLIC_ANALYTICS_ENABLED=true
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
```

**Dev builds** (`.env.development`) keep `NEXT_PUBLIC_ANALYTICS_ENABLED=false`.

## 3. What gets tracked

### Screen and time

| Mechanism | When | Notes |
|-----------|------|-------|
| `screen_view` | Route or Jyotish sub-tab change | Native: `setCurrentScreen`; web: `logEvent` |
| `page_duration` | Leave screen (>500 ms) | Custom event with `page_name`, `duration_seconds` |
| `*_page_visited` | Top-level tab entry only | Home, Astro (`/jyotish`), Match, Settings |

**Virtual Astro screens** (tracked by `JyotishClient`, not URL routes):

- `/jyotish` — onboarding (no birth profile)
- `/jyotish/today`, `/jyotish/chart`, `/jyotish/timeline`, `/jyotish/learn`

`screen_view` uses `screen_name` = normalized path and `screen_class` = `route_segment` (`home`, `astro`, `match`, `settings`).

### User actions (no PII)

| Event | When | Params |
|-------|------|--------|
| `preference_changed` | Language, masa, location, reminder | `setting`, `value` |
| `birth_profile_saved` / `birth_profile_cleared` | Birth profile changes | `has_birth_time` |
| `partner_profile_saved` / `partner_profile_cleared` | Partner profile changes | `has_birth_time` |
| `glossary_opened` | Glossary tooltip opened | `term_id` |
| `nav_tapped` | Bottom nav tap | `destination` |
| `panchang_refreshed` | Panchang retry on home | — |
| `insight_expanded` | Insight card toggled | `insight_key`, `expanded` |
| `match_viewed` | Match results shown | `quality_band`, dosha flags, `synastry_unlocked` |
| `birth_edit_opened` | Edit birth/partner form opened | `variant` |
| `learn_search_used` | Glossary search (debounced) | `query_length` |
| `learn_article_viewed` | Learn article rendered | `article_id` |
| `gps_location_used` | GPS location button | `result` |

Never logged: birth date/time, coordinates, names, city labels, or search query text.

### User properties

`app_language`, `masa_system`, `has_birth_profile`, `location_source`, `platform`

### Ads (separate module)

`ad_requested`, `ad_loaded`, `ad_impression`, `ad_clicked`, `ad_skipped`, and related `ad_*` events — see [AdMob setup](03-admob.md).

## 4. GA4 Console checklist (manual)

Register these as **custom dimensions** in Admin → Custom definitions:

| Parameter | Scope |
|-----------|-------|
| `route_segment` | Event |
| `duration_seconds` | Event |
| `destination` | Event |
| `insight_key` | Event |
| `quality_band` | Event |
| `article_id` | Event |

## 5. Verify

```powershell
adb shell setprop debug.firebase.analytics.app com.sathish.utilites.chandra_darshan
```

Navigate **Today → Astro (switch tabs) → Match → Settings**. In Firebase **DebugView** confirm:

- `screen_view` per route and Jyotish sub-tab
- `page_duration` when leaving screens
- `nav_tapped`, `match_viewed` (when match data loads)
- No spurious `MainActivity`-only `screen_view`

```bash
npm run typecheck
npm run lint
```

## 6. Key files

| File | Role |
|------|------|
| `src/lib/analytics/analytics.service.ts` | Native `setCurrentScreen` + web `screen_view` |
| `src/lib/analytics/route-metadata.ts` | Path normalization and screen titles |
| `src/hooks/useScreenTracking.ts` | Screen + duration tracking hook |
| `src/components/AnalyticsTracker.tsx` | Top-level route tracking |
| `src/app/jyotish/JyotishClient.tsx` | Astro sub-tab virtual screens |
| `src/lib/analytics/app-analytics.ts` | User-action event helpers |
| `android/app/src/main/AndroidManifest.xml` | Disables auto Activity screen reporting |

## Related

- [AdMob setup](03-admob.md)
- [Android build pipeline](04-android-build.md)
