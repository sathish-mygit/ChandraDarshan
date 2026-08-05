# ADR-005: Approximate location via IP geolocation

## Status

Accepted

## Context

New users default to New Delhi until they open Settings. GPS gives accurate coordinates but requires a runtime permission prompt, which many users skip. The app already ships 12 preset Indian cities and offline Panchang via `panchang-ts`; we need a permission-free way to set a reasonable default location on first launch.

## Options considered

1. **GPS on first launch** — accurate, but requires location permission and feels intrusive.
2. **Timezone-only (`Asia/Kolkata`)** — no permission, but cannot distinguish cities within India.
3. **IP geolocation (one HTTPS call)** — city-level accuracy, no permission, works globally for NRIs.
4. **Bundled offline geolocation database** — no network after install, but large asset and maintenance burden.

## Decision

On first launch (when `locationAutoDetected` is false), call a keyless IP geolocation endpoint (`ipwho.is`) once with a 5 s timeout. If coordinates fall inside an India bounding box, map to the nearest of the 12 preset cities and store `source: 'approx'`. Outside India, store IP lat/lon with the IP-derived city label and the device IANA timezone so Panchang remains accurate for NRIs. On failure or offline, keep New Delhi and still set `locationAutoDetected` to avoid retry loops. GPS via the existing Settings button remains the optional precise path.

## Consequences

- Positive: No location permission needed for the default experience.
- Positive: Indian users get a relevant metro city without manual setup.
- Positive: Abroad users get correct Panchang timings from IP coordinates.
- Negative: One-time network required on first launch; offline first open stays on New Delhi.
- Negative: VPN or carrier routing can misplace users; city label is nearest metro, not exact town.
- Negative: Third-party IP lookup may see the user's IP address (disclosed in privacy policy).
