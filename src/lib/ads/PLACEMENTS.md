Ad Placements & UX Rules
=========================

This document lists the exact pages, placements, and UX rules for ads in WardrobeWise.
Follow these rules when adding or updating ad placements, and keep privacy/consent requirements in mind.

Principles
----------
- Non-intrusive by default: banners and native ads should not block primary user tasks.
- Clear labelling: all native and sponsored content must be visibly labelled as "Ad" or "Sponsored".
- Frequency caps: interstitials are rate-limited to avoid disrupting the user experience.
- Opt-in rewarded ads only: rewards are always user-initiated and grant immediate visible benefits.
- Sensitive screens must be ad-free (onboarding, critical forms, settings).

Placement catalog (15 toggles + master)
---------------------------------------

| Key | Trigger | Preload | Default |
|-----|---------|---------|---------|
| `ads.master` | Global emergency pause | — | `true` |
| `banner.home` | Home / Dashboard footer | — | `true` |
| `banner.itemDetail` | Item detail bottom | — | `false` |
| `banner.cardFeed` | Card feed between items | — | `false` |
| `native.feed` | Wardrobe list/grid | — | `true` |
| `interstitial.postItemSave` | After saving clothing item | On enter `/add-item` | `true` |
| `interstitial.postOutfitSave` | After saving outfit | On enter `/outfits/create` | `true` |
| `interstitial.postBackup` | During backup (parallel) | On backup button tap | `true` |
| `interstitial.postRestore` | During restore (parallel) | On restore confirm | `true` |
| `interstitial.toHome` | Nav to Home (`/`) | Per-destination session key | `false` |
| `interstitial.toPlanner` | Nav to `/planner` | Per-destination session key | `false` |
| `interstitial.toInsights` | Nav to `/insights` | Per-destination session key | `true` |
| `interstitial.toOutfits` | Nav to `/outfits` | Per-destination session key | `false` |
| `rewarded.addItem` | Opt-in during add item | — | `true` |
| `rewarded.unlockFeature` | Opt-in feature unlock | — | `true` |

**Deprecated RC keys** (still accepted; fan out to granular keys when new keys absent):

- `interstitial.postSave` → `postItemSave` + `postOutfitSave`
- `interstitial.postAction` → `postBackup` + `postRestore`
- `interstitial.transitions` → `toHome` + `toPlanner` + `toInsights` + `toOutfits`

Physical AdMob units are unchanged — one interstitial unit serves all interstitial placements.

Interstitial details
--------------------

- **Post save**: shown after successful save on the **destination page** (item/outfit detail), not on the sensitive form route. Preload via `maybePreloadInterstitial` on flow entry; queue with `queuePostSaveInterstitial` before `router.push`.
- **Backup / restore**: `runWithParallelInterstitial` with `allowSensitiveRoute` on `/settings`.
- **Navigation**: app provides `resolvePlacement` to `useNavigationInterstitial` (see `src/config/placements.ts`); 800ms delay before show; does NOT fire on in-page tab switches.
- **Global limits**: `minIntervalMs` (5 min) and `maxPerSession` (2) apply across all interstitial placements.

Where NOT to show ads
---------------------
- Onboarding screens (first-run flows)
- Settings UI (banners/transitions blocked); backup/restore may show `interstitial.postBackup` / `interstitial.postRestore` with explicit user action only
- While the user is actively filling or editing forms (e.g., Add Item form)
- During critical confirmations (delete, irreversible actions)

Frequency & Rate-limiting
-------------------------
- Interstitials: default min interval 5 minutes, max 2 per session (`interstitial_minIntervalMs`, `interstitial_maxPerSession` in Remote Config).
- **Wardrobe readiness**: ads unlock by wardrobe item count, not session count.
  - Global floor: `engagement.minWardrobeItems` (RC `engagement_minWardrobeItems`, `0` = off).
  - Per-placement mins in `placementNewUserPolicy` / placement definitions (e.g. native `3`, post-save `5`, nav transitions `8`).
  - Effective requirement = `max(global, placement min)` for each placement.
- Per-placement hourly/daily caps via Remote Config (`freqCap_*` keys).
- Native: 1 per 8–12 items; do not cluster multiple native ads close together.
- Banner: persistent; avoid stacking banners (only one banner visible per screen).

Labeling & Policy
-----------------
- Always label native ads with a visible marker: "Ad", "Sponsored", or local language equivalent.
- Follow AdMob and platform policies for ad placement near interactive elements.

Implementation notes
--------------------
- Catalog source of truth: `src/config/placements.ts`
- Per-placement toggles in `src/config/ads.ts` (`settings` map) and persisted overrides via `adService`.
- Settings UI (`AdsSettings.tsx`) renders from `PLACEMENT_CATALOG`.
- Remote Config merged at startup via `getRemoteConfigAdsSettings()` + `applyRemoteConfigToAds()`.

QA checklist before release
-------------------------
1. Verify `testMode: true` and test ad unit IDs are set during development.
2. Confirm `ads.master` works and immediately stops all ad requests.
3. Toggle each interstitial placement independently in Ads Settings / Remote Config.
4. Ensure native ads show the "Ad" badge and do not duplicate layout of item tiles.
5. Verify rewarded flow grants the reward only after ad success.
6. Test rate-limits: interstitials obey min interval, per-session caps, and per-placement freq caps.

Preload policy
--------------
- No interstitial preload at app startup.
- `maybePreloadInterstitial` only when placement enabled, not IVT-paused, not rate-limited, debounced 5 min unless an interstitial was shown since last preload.
- High-intent triggers: create flows, backup/restore buttons, navigation toward enabled transition destinations.

IVT safeguards (invalid traffic prevention)
------------------------------------------
All limits are configurable via Firebase Remote Config (see `IVT_FRAMEWORK.md`).

- **Click limits**: max 1 click/session, 3/day (defaults). Exceeding triggers a 24h ad pause.
- **Frequency caps**: per-placement hourly/daily impression limits (native feed, each interstitial, rewarded).
- **Sensitive routes**: no ads on `/add-item`, `/settings`, `/outfits/create`, and paths matching `/edit`.
- **Navigation delay**: 800ms before transition interstitials to avoid accidental taps.
- **Labelling**: banners show an "Ad" strip; native ads use "Sponsored" + explicit CTA click tracking.

Analytics: `ad_ivt_pause`, `ad_frequency_cap_hit`, `ad_sensitive_route_blocked`, `ad_navigation_delay_applied`, `ad_session_summary`.
