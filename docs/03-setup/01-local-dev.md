# Local development

## Prerequisites

- Node.js 20+
- npm
- Android Studio (for device/emulator builds only)

## Install

```bash
npm install
```

## Run in browser

```bash
npm run dev
```

Open [http://localhost:3002](http://localhost:3002).

## Typecheck & lint

```bash
npm run typecheck
npm run lint
```

## Environment

Copy `.env.local.example` to `.env.local` for machine-only overrides. Dev and prod build env templates are `.env.development` and `.env.production` (see [android build](04-android-build.md)).

## Android builds

See [04-android-build.md](04-android-build.md) for flavor rules, `npm run build` sequence, and Gradle variants.

## Project layout

```
src/app/          Next.js App Router pages
src/lib/          Shared utilities
capacitor.config.ts
next.config.ts    static export for Capacitor
scripts/          Build version increment
```

## Next steps

- Phase 3+: Firebase setup — `02-firebase.md` (planned)
- Architecture: [panchang data flow](../04-architecture/01-panchang-data-flow.md)
