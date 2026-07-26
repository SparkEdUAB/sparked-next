# Phase 0B — Deterministic build and test baseline

## Purpose

Make local and CI quality commands deterministic, keep build-time imports free
of infrastructure connections, and establish disposable tenant fixtures and
initial API contracts.

## Changed contracts

- `lint`, `format:check`, `type-check`, `test`, `test:coverage`, `test:e2e`,
  and `build` are non-mutating commands. `format:fix` is the explicit local
  formatting command.
- Oxfmt 0.60.0 replaces Prettier as the direct formatter dependency. The
  repository configuration lives in `.oxfmtrc.json` and the editor default is
  `oxc.oxc-vscode`.
- Production builds use Next's webpack builder with its build worker disabled.
  This avoids the Turbopack worker hang observed on the current local runtime
  and exposes build-time module initialization errors.
- Importing the MongoDB client no longer constructs or connects a client.
  Database initialization remains on the first `dbClient()` call; Phase 2 will
  replace its startup writes with explicit migrations.
- Resend clients are created inside signup and password-reset request handlers,
  so a missing email key cannot fail module import or production builds.
- Husky invokes existing pnpm scripts. CI uses pinned local tooling, restores
  the pnpm and Next caches, and runs formatting, lint, type-check, tests, and
  build in parallel.

## Fixtures and contracts

`tests/fixtures/tenants.ts` supplies two disposable synthetic organizations,
with one fixture user per supported role (`Admin`, `Content Manager`, `Editor`,
and `student`) in each organization.

`tests/contracts/api-contracts.test.ts` preserves the configuration endpoint's
URL, method, successful response shape, and unknown-operation error envelope.
The fixture matrix is also verified by the contract suite.

## Migration status

No database migration is required.

## Verification

Passed in an isolated Node 22.14.0 copy of the current source on 2026-07-26:

```sh
pnpm format:check
pnpm lint
pnpm type-check
pnpm test
pnpm test:coverage
pnpm build
```

- Oxfmt check passed across 540 files.
- Unit tests passed: 48 files and 210 tests.
- Coverage completed: 59.07% statements, 57.58% branches, 47.53% functions,
  and 62.45% lines.
- The production webpack build passed without MongoDB, Redis, or Resend
  credentials. It emitted existing warnings about `metadataBase`.
- Warm timing baseline: type-check 5.8s, unit tests 12.0s, and production build
  19.3s.

The following two checks remain environment-blocked and must be completed in
CI or a local environment with package-registry and loopback access:

- A disposable clean `pnpm install --frozen-lockfile` cannot fetch several
  tarballs because registry DNS returns `ENOTFOUND` in this sandbox.
- `pnpm test:e2e` builds successfully but cannot start Next on port 3000 because
  this sandbox rejects `listen` with `EPERM`.

Do not treat Phase 0B as accepted until those two checks pass and clean timing
metrics are recorded.

## Rollback

Revert this phase's commit and restore the preceding CI scripts and formatter.
Do not reintroduce module-scope infrastructure connections to bypass build
failures.

## Next phase

Phase 1 remains blocked until the clean-install and E2E acceptance checks above
are green.
