# Portable Ads Framework

Generic ad decision engine for Capacitor/React apps. Copy `src/lib/ads/` into another project and wire app-specific placement catalog and engagement adapter.

## Design

**Framework** (`lib/ads`) — reusable, no app routes or concepts:
- Decision engine with ordered rules (master toggle, consent, IVT pause, engagement gate, frequency cap, session rate limits, preload debounce)
- AdService orchestrator + AdMob provider + Mock provider
- Safeguards: Click limiter, frequency cap tracker
- Generic hooks: nav interstitial, session analytics, parallel interstitial, show-on-transition

**App** (`src/config/` + pages) — placement-specific, app decisions:
- Placement catalog + placement-to-RC-key mapping
- `resolveTransitionPlacement(toRoute)` → placement or null (route eligibility for nav ads)
- Engagement adapter: `getClothingItemCount()` for wardrobe readiness (replace with any business logic)
- Save handlers: fire ads in parallel with `router.push`

## Key changes from v1

- **No global sensitive routes guard** — route eligibility determined by `resolveTransitionPlacement` (app layer) or explicit skip in trigger
- **Parallel post-save ads** — `showInterstitialOnTransition` fires ad and navigates concurrently; no deferred queue
- **Decision engine** — centralized rule pipeline with logging; all show/preload decisions flow through single path
- **Engagement generic** — `minWardrobeItems` → `minEngagementCount` in framework; provider injection for app customization
- **No blind preload on init** — `warmInterstitialIfAllowed()` respects master/consent/IVT before loading

## Components

| Module | Role |
|--------|------|
| `decision/engine.ts` | Placement decision pipeline (master, consent, IVT, engagement, freq cap, rate limits, preload debounce) |
| `decision/log.ts` | Ring buffer of last 50 decisions for diagnostics |
| `safeguards/ivt-guard.ts` | Click limiter + freq cap tracker; no routing logic |
| `core/AdService.ts` | Delegates show/preload to engine; manages consent, caching, state |
| `core/providers/AdMobProvider.ts` | Plugin wrapper; init no longer preloads |
| `hooks/useNavigationInterstitial.ts` | Detects route transitions; checks block reason before show |
| `hooks/showInterstitialOnTransition.ts` | Fire ad and navigate in parallel for post-save, backup, etc. |
| `lifecycle/wardrobe-readiness.ts` | Generic min-count resolver (renamed to engagement-readiness) |

## App integration checklist

1. **Placement catalog** — Define `Placement` enum + `PLACEMENT_CATALOG` in app config
2. **RC mapping** — Wire Firebase keys via app RC config (Firebase remote-config.json or equivalent)
3. **Route resolver** — Implement `resolveTransitionPlacement(toRoute)` returning placement or null
4. **Engagement** — Provide `getEngagementItemCount()` or equivalent in `AdServiceInitOptions`
5. **AdService init** — Call `adService.init({ config, getEngagementItemCount })`; pass nav/session hooks
6. **Hooks** — Wire `useNavigationInterstitial`, `useAdSessionAnalytics` in root layout
7. **Save handlers** — Call `showInterstitialOnTransition(adService, placement, () => router.push(...))` on success
8. **Optional diagnostics** — Wire `evaluateDecision()` + `getDecisionLog()` to debug UI

## Remote Config keys

| Firebase key | App key | Default |
|--------------|---------|---------|
| `ivt_enabled` | `ivt.enabled` | `true` |
| `ivt_maxClicksPerSession` | `ivt.maxClicksPerSession` | `1` |
| `ivt_maxClicksPerDay` | `ivt.maxClicksPerDay` | `3` |
| `ivt_pauseDurationMs` | `ivt.pauseDurationMs` | `86400000` |
| `ivt_navigationDelayMs` | `ivt.navigationDelayMs` | `800` |
| `freqCap_*` | `freqCap.<placement>.perHour/perDay` | See `ivt-defaults.ts` |
| `interstitial_minIntervalMs` | `interstitial.minIntervalMs` | `300000` |
| `interstitial_maxPerSession` | `interstitial.maxPerSession` | `2` |
| `engagement_minWardrobeItems` | `engagement.minWardrobeItems` | `0` |

## Analytics events

- `ad_requested`, `ad_loaded`, `ad_impression`, `ad_clicked` — standard impressions
- `ad_skipped` (with `rule_id` field) — any blocked show (includes reason)
- `ad_preload_skipped` (with `rule_id`) — blocked preload with decision log entry
- `ad_ivt_pause` / `ad_ivt_resume` — click limit triggered/cleared
- `ad_frequency_cap_hit` — hourly/daily cap hit
- `ad_navigation_delay_applied` — nav interstitial delayed to avoid rapid fires
- `ad_session_summary` — session stats on app background
- `ad_test_mode_warning` — dev build with `testMode=false`

## Skip reasons (`ad_skipped` reason field)

- `master_disabled` — ads.master toggle off
- `placement_disabled` — placement-specific toggle off
- `consent_blocked` — user has not given consent
- `ivt_pause` — click limit exceeded; ads paused
- `engagement_gate` — wardrobe/engagement count below required
- `frequency_cap` — hourly/daily impression cap hit
- `rate_limit` — session max or min-interval reached (interstitials only)
- `preload_debounce` — preload debounce window active
- `disabled` — catch-all for unknown reasons

## Customization for multi-app reuse

- **Engagement logic** — Replace `getClothingItemCount` with any business metric (days, premium status, etc.); pass as provider to engine
- **Placement names** — Define app catalog; leave framework generic (no hardcoded placement IDs)
- **Route triggers** — Implement `resolveTransitionPlacement` per app; nav hook remains generic
- **RC keys** — Map Firebase names to app keys in config; merge helpers handle translation
- **No breaking changes for future enhancements** — Decision engine is extensible; new rules can be added without app-layer updates

## Portable Diagnostics

All diagnostics logic (`lib/ads/diagnostics/`) is reusable across apps. No app-specific concepts, just data and policy state.

### Data structures (no app dependencies)

- **SessionAttemptLog** — ring buffer of last 50 ad decisions + provider events
- **RuleHints** — map rule IDs to short labels + actionable hints
- **SimulationOverrides** — session-only test overrides (engagement count, consent, IVT pause, placement toggles)
- **DiagnosticsSnapshot** — frozen view: status, per-placement blocks, limits, toggles, rule IDs

### Using in another app

1. Copy `src/lib/ads/diagnostics/` to target app
2. Create `src/config/ads-diagnostics.ts`:
   ```typescript
   export const DEBUG_PLACEMENT_MATRIX = [/* your placements */];
   export function getPlacementLabel(placement) { /* app-specific labels */ }
   ```
3. Wire debug UI:
   ```typescript
   import { useAdDiagnostics } from '@/lib/ads';
   const { snapshot, sessionLog, setSimulationOverrides, ... } = useAdDiagnostics(DEBUG_PLACEMENT_MATRIX);
   // Render snapshot, provide test buttons
   ```
4. AdService automatically wires session log on init; no additional setup needed

### Public AdService methods

- `getSessionAttemptLog()` — returns all 50 entries for timeline display
- `getPlacementDiagnostics(placements)` — per-placement block status + hints
- `buildDiagnosticsSnapshot(placements)` — full snapshot for UI rendering
- `setSimulationOverrides(overrides)` — apply test overrides (e.g., `engagementCount=0`)
- `clearSimulationOverrides()` — reset to prod state
- `testShowInterstitial(placement, { policyMode })` — test show with optional bypass
- `testPreloadInterstitial(placement)` — test preload path

### React hook: `useAdDiagnostics(placements)`

Polls snapshot + session log every 2s. Returns:
- `snapshot` — frozen diagnostics view
- `sessionLog` — last 20 attempts (skips, shows, preloads, provider events, nav evaluations)
- `decisionLog` — last 20 engine evaluations with `ruleId`
- `policyMode` / `setPolicyMode` — toggle 'production' | 'admob_only'
- `simulationOverrides` / `setSimulationOverrides` / `clearSimulation` — test controls
- `simulateNavigation`, `simulateSettingsBackup`, `simulateSettingsRestore` — flow simulators
- `testShowInterstitial`, `testPreloadInterstitial` — manual test buttons
- `exportReport()` — copy-paste debug text

### Navigation model (important for debugging)

Ads fire on **route transition** (`fromRoute → toRoute`), not when a page mounts.

| Transition | Ad behavior |
|------------|-------------|
| Home → Settings | No ad (`resolveTransitionPlacement` returns null); timeline logs "no transition placement" |
| Settings → Home | `interstitial.toHome` evaluated and shown if allowed |
| Settings backup/restore | `interstitial.postBackup` / `postRestore` (action-triggered, not nav) |

Use **Simulate flows** on the Tests page to test without real navigation.

### Simulation overrides reference

| Field | Effect |
|-------|--------|
| `engagementCount` | Bypass real wardrobe count for engine |
| `engagementMin` | Override global min engagement |
| `interstitial.maxPerSession` / `minIntervalMs` | Session rate limits |
| `interstitialShownCount` / `lastInterstitialAt` | Simulate cap/cooldown hit |
| `ivt.maxClicksPerSession` / `maxClicksPerDay` | IVT click limits |
| `consentGranted` / `ivtPaused` | Force consent or IVT pause |
| `placementToggles` | Per-placement ON/OFF |
| `freqCap[placement].perHour` / `perDay` | Override cap values |
| `freqCap[placement].hourUsed` / `dayUsed` | Simulate usage at cap |

