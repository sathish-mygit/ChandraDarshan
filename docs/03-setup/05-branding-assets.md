# Branding assets

App icon, splash screen, and web favicon for Chandra Darshan — aligned with the in-app moon disc visual.

## Brand colors

| Token | Hex | Usage |
|-------|-----|-------|
| Background | `#020617` | Icon background, splash, status bar |
| Moon lit | `#fef3c7` | Lit surface of the moon disc |
| Accent | `#f59e0b` | Glow ring (15–20% opacity) |
| Shadow | `#020617` | Moon terminator shadow |

The launcher icon uses a **static** waxing gibbous phase (~70% illumination). The in-app `MoonPhaseDisc` component remains dynamic.

## Source files (`assets/`)

Edit these SVGs — they are the source of truth. Do not hand-edit generated files under `android/app/src/main/res/mipmap-*` or `drawable-*`.

| File | Size | Purpose |
|------|------|---------|
| `assets/icon-only.svg` | 1024×1024 | Full launcher icon (legacy `ic_launcher.png` + round) |
| `assets/icon-background.svg` | 1024×1024 | Adaptive icon background layer |
| `assets/icon-foreground.svg` | 1024×1024 | Moon graphic (keep inside center ~66% safe zone) |
| `assets/splash.svg` | 2732×2732 | Splash screen — moon centered on dark background |

Web favicon: [`src/app/icon.svg`](../src/app/icon.svg) — background + moon combined for browser tab visibility.

## Regenerate native assets

After editing any file in `assets/`:

```bash
npm run assets:generate
```

This runs `@capacitor/assets` and a post-step (`scripts/patch-android-adaptive-icon.cjs`) that writes `drawable/ic_launcher_moon.xml` (vector) and wires API 26+ adaptive icons to it — avoiding blurry scaled PNG mipmaps on home screens.

- `android/app/src/main/res/mipmap-*` — launcher icons
- `android/app/src/main/res/drawable-*` — splash drawables

Then rebuild the app:

```bash
npm run build:android:dev
```

**Do not** wire `assets:generate` into `npm run build` — only run it when source artwork changes.

## Splash behavior

Configured in [`capacitor.config.ts`](../capacitor.config.ts):

- `backgroundColor`: `#020617` (must match splash drawable)
- `launchShowDuration`: 1500 ms
- `androidSplashResourceName`: `splash`

Android 12+ shows a centered icon on a solid background during cold start — the minimal splash design matches this system behavior.

## Verification

1. **Launcher icon** — moon on dark background (not the default Capacitor robot)
2. **Cold start** — brief dark splash with centered moon, smooth transition to app
3. **Web favicon** — moon icon in browser tab when running `npm run dev`

## Related

- Android build pipeline: [04-android-build.md](04-android-build.md)
- In-app moon visual: [`src/components/MoonPhaseDisc.tsx`](../src/components/MoonPhaseDisc.tsx)
