# Phase 0A — Dependency vulnerability remediation

## Purpose

Block releases unless the complete dependency graph and production dependency
graph have no known vulnerabilities.

## Baseline

The npm advisory audit on 2026-07-26 found 11 vulnerabilities: 1 critical, 8
high, and 2 moderate. The affected packages were `@auth/core`, `postcss`,
`sharp`, and `brace-expansion` via the legacy ESLint tree.

## Changed contracts

There are no application API or runtime behavior changes. The lint command now
uses the repository-pinned Oxlint binary and does not modify files. ESLint and
its configuration were removed.

`pnpm.overrides` replaces the ineffective package-manager-agnostic
`resolutions` setting. The `postcss` and `sharp` overrides protect the nested
versions still selected by Next.js; they can be removed when Next.js updates
those transitive constraints. The existing `undici` resolution is retained as a
pnpm-native override.

## Compatibility notes

- `@auth/mongodb-adapter` is updated to 3.11.3, which pins patched
  `@auth/core` 0.41.3 without changing the application’s NextAuth v4 API.
- Next.js, Sharp, and PostCSS are updated within their existing supported major
  versions. The lockfile also forces patched Sharp and PostCSS versions for the
  versions nested by Next.js.
- Oxlint replaces the unused ESLint toolchain. Existing `eslint-disable`
  comments are inert and can be migrated to Oxlint-specific suppressions only
  when a lint result requires it.

## Migration status

No database migration is required.

## Verification

Run the following from the repository root:

```sh
pnpm install --frozen-lockfile
pnpm audit
pnpm audit:prod
pnpm lint
pnpm type-check
pnpm test
pnpm build
```

The `Dependency Security` workflow runs both audits and uploads the generated
CycloneDX `sbom.cdx.json` as a retained CI artifact on pull requests, main, and
releases. The generator has no third-party runtime dependencies; it reads the
production graph reported by pnpm.

## Verification results

Recorded on 2026-07-26:

- `pnpm install --frozen-lockfile`: passed.
- `pnpm audit` and `pnpm audit:prod`: zero known vulnerabilities.
- `pnpm sbom`: generated a CycloneDX 1.6 SBOM with 531 production components.
- `pnpm lint`, `pnpm type-check`, and `pnpm build`: passed.
- `pnpm test`: 46 files and 206 tests passed.
- Playwright was intentionally not run for this handoff at the requester’s
  direction. The current suite has four active homepage tests and one skipped
  library suite.
Dependabot remains the only automated dependency updater.

## Rollback

Revert this phase’s commit and redeploy the previous immutable release
artifact. Do not suppress an advisory to bypass the audit gate.

## Next phase

Phase 0B establishes deterministic build/test commands, fixtures, contract
tests, and timing baselines after this phase’s verification gate is green.
