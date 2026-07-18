# Chandra Darshan

Daily Indian lunar calendar — moon phase, tithi, paksha, maasa, and samvatsara. English, Hindi, and Sanskrit.

## Documentation

All project docs: **[docs/00-index.md](docs/00-index.md)**

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3002](http://localhost:3002).

## Android (after first web build)

```bash
npm run build
npx cap run android
```

Or open Android Studio:

```bash
npm run cap:android
```

## Stack

- Next.js 16 (static export) + Capacitor 8
- Offline Panchang: `panchang-ts` (Phase 2 — live on home screen)
- Package: `com.sathish.utilites.chandra_darshan`

See [ADR-001](docs/02-decisions/adr-001-nextjs-capacitor.md) for architecture decisions.
