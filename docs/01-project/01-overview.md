# Chandra Darshan — Overview

## Purpose

A daily Indian lunar calendar app. When users open it, they see the moon phase and Panchang elements: tithi, paksha, maasa, and samvatsara — in English, Hindi, Sanskrit, Telugu, or Tamil. A **Jyotish** tab adds personal birth-chart insights and daily relevance.

## Phase 1 status (complete)

- Next.js 16 with static export (`out/`)
- Capacitor 8 Android project (`android/`)
- Branch-driven Android build pipeline (dev/prod flavors, `android/.package-resolved.json`)
- Placeholder home and settings screens (night-sky theme)

## Phase 2 status (complete)

- Offline Panchang via `panchang-ts` on the home screen
- Moon phase disc from current tithi progress
- Settings: language (EN / HI / SA / TE / TA), city picker, GPS location, Amanta / Purnimanta maasa
- Preferences and daily cache in `@capacitor/preferences` (no database, per ADR-003)
- Samvatsara name lookup from Vikram Samvat year

## Phase 3 status (complete)

- Bottom tab navigation: Today | Jyotish
- Birth profile (optional birth time) in preferences v2
- Jyotish page: Chandra Balam, Tarabala, Vimshottari dasha, Sade Sati
- Natal chart (lagna + planets in houses) when birth time is known
- Beginner glossary tooltips and templated daily guidance
- Home teaser link when birth profile exists

## Phase 4 status (partial)

- Firebase Analytics + Crashlytics wiring (prod flavor only) — see [02-firebase.md](../03-setup/02-firebase.md)
- Page tracking, preference/Jyotish custom events, Crashlytics on native Android
- Firebase project + `google-services.json` — you add in Console when ready

## Not yet implemented

- i18n polish beyond core labels — ongoing
- Remote Config, AdMob — later
- Kundli wheel, Navamsa, doshas, matching — deferred per ADR-004

## Key paths

| Path | Role |
|------|------|
| `src/app/page.tsx` | Home (via `HomeClient`) |
| `src/app/jyotish/page.tsx` | Jyotish (via `JyotishClient`) |
| `src/app/settings/page.tsx` | Settings (via `SettingsClient`) |
| `src/lib/panchang/service.ts` | Panchang computation |
| `src/lib/jyotish/` | Natal + personal today |
| `src/lib/preferences.ts` | User settings persistence |
| `src/lib/analytics/` | Firebase Analytics + Crashlytics bridge |
| `capacitor.config.ts` | Native app ID / name (from package manifest) |
| `scripts/` | Build pipeline: flavor resolve, env, version increment |
| `docs/00-index.md` | Documentation hub |
