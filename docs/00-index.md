# Documentation index

Read in order: **01-project** → **02-decisions** → **03-setup** → **04-architecture**

## 01-project

| # | Document | Status | Purpose |
|---|----------|--------|---------|
| 01 | [overview](01-project/01-overview.md) | Active | Product summary and phase status |

## 02-decisions (ADRs)

| ADR | Title | Status |
|-----|-------|--------|
| [001](02-decisions/adr-001-nextjs-capacitor.md) | Next.js + Capacitor (Android first) | Accepted |
| [002](02-decisions/adr-002-offline-panchang.md) | Offline Panchang via panchang-ts | Accepted |
| [003](02-decisions/adr-003-no-database-v1.md) | No local database in v1 | Accepted |
| [004](02-decisions/adr-004-jyotish-scope.md) | Offline personal Jyotish scope | Accepted |

## 03-setup

| # | Document | Status | Purpose |
|---|----------|--------|---------|
| 01 | [local dev](03-setup/01-local-dev.md) | Active | npm install, dev server |
| 02 | `02-firebase.md` | Planned | Firebase project setup |
| 03 | `03-admob.md` | Planned | AdMob registration |
| 04 | [android build](03-setup/04-android-build.md) | Active | Capacitor Android flavors, branch pipeline |

## 04-architecture

| # | Document | Status | Purpose |
|---|----------|--------|---------|
| 01 | [panchang data flow](04-architecture/01-panchang-data-flow.md) | Active | Preferences → cache → panchang-ts → home UI |
| 02 | [jyotish data flow](04-architecture/02-jyotish-data-flow.md) | Active | Birth profile → natal + personal today → Jyotish tab |
