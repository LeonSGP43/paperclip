# Changelog

## [Unreleased]

### What changed
- Imported global locale support from `LeonSGP43/paperclip`, including Chinese UI translations, locale middleware and routes, locale persistence, and i18n validation.
- Added retry handling for transient adapter capacity failures so heartbeat runs can recover automatically from short-lived upstream overloads.

### Why
- Keeps this local development branch ready for Chinese operation while preserving upstream tracking on `master`.
- Makes temporary provider capacity failures less likely to strand agent work.

### Impact
- Adds a `user_preferences` table for locale storage.
- Adds UI locale selection and localized strings across the board experience.
- Adapter capacity, overload, and rate-limit failures can be retried automatically up to the configured limit.

### Verification
- `pnpm -r typecheck`
- `pnpm check:i18n`
- `pnpm build`
- Targeted Vitest suites for InviteLanding, IssuesList, heartbeat recovery, and flaked full-run files passed.
- Standard `pnpm test:run` still shows non-deterministic full-suite parallel flakes; failing files passed when rerun directly.

### Files
- `packages/i18n/src/index.ts`
- `packages/shared/src/i18n.ts`
- `server/src/middleware/locale.ts`
- `server/src/routes/i18n.ts`
- `server/src/routes/user-preferences.ts`
- `ui/src/context/LocaleContext.tsx`
- `ui/src/components/LocaleSwitcher.tsx`
- `server/src/services/heartbeat.ts`

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
