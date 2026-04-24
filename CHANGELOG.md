# Changelog

## [Unreleased]

### What changed
- Imported global locale support from `LeonSGP43/paperclip`, including Chinese UI translations, locale middleware and routes, locale persistence, and i18n validation.
- Added retry handling for transient adapter capacity failures so heartbeat runs can recover automatically from short-lived upstream overloads.
- Rebranded the user-facing product surface from Paperclip to BossFlow, including the README, auth experience, navigation labels, exported org-chart watermark, and a new minimalist `B` plus paperclip logo system with refreshed app icons.

### Why
- Keeps this local development branch ready for Chinese operation while preserving upstream tracking on `master`.
- Makes temporary provider capacity failures less likely to strand agent work.
- Establishes a distinct BossFlow product identity without destabilizing the underlying Paperclip runtime and package internals.

### Impact
- Adds a `user_preferences` table for locale storage.
- Adds UI locale selection and localized strings across the board experience.
- Adapter capacity, overload, and rate-limit failures can be retried automatically up to the configured limit.
- Operators now see BossFlow branding consistently across login, settings, invites, company skills, browser titles, manifests, exported org charts, and installed icons.

### Verification
- `pnpm -r typecheck`
- `pnpm check:i18n`
- `pnpm build`
- Targeted Vitest suites for InviteLanding, IssuesList, heartbeat recovery, and flaked full-run files passed.
- Standard `pnpm test:run` still shows non-deterministic full-suite parallel flakes; failing files passed when rerun directly.
- Verified updated BossFlow branding assets and entrypoints compile in the UI build.

### Files
- `packages/i18n/src/index.ts`
- `packages/shared/src/i18n.ts`
- `server/src/middleware/locale.ts`
- `server/src/routes/i18n.ts`
- `server/src/routes/user-preferences.ts`
- `ui/src/context/LocaleContext.tsx`
- `ui/src/components/LocaleSwitcher.tsx`
- `server/src/services/heartbeat.ts`
- `ui/src/components/BossFlowBrand.tsx`
- `ui/src/pages/Auth.tsx`
- `server/src/routes/org-chart-svg.ts`
- `ui/public/*`
- `doc/assets/bossflow-*`

## [0.3.1] - 2026-04-23

### What changed
- Bootstrapped repository-level version tracking for this development branch.

### Why
- Enables the required pre-push version gate for local development branches.

### Impact
- No runtime behavior change.

### Verification
- Confirmed `VERSION` is SemVer.
- Confirmed this changelog includes `Unreleased` and a released version heading.

### Files
- `VERSION`
- `CHANGELOG.md`
- `README.md`
