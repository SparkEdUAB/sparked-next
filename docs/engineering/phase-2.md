# Phase 2 — Explicit migrations and typed data access

## Purpose

Move database initialization and legacy tenant backfills out of application
startup. Establish an explicit, versioned migration workflow and the shared
data-access primitives that Phase 3 handlers will adopt.

## Changed contracts

- Application database access no longer creates default roles, organizations,
  tenant ownership fields, or indexes. A missing default organization now fails
  clearly and instructs the operator to run the explicit migration command.
- `pnpm migrate:status` reports the migration ledger and required-index state.
  `pnpm migrate:dry-run` inspects pending work without writes.
  `pnpm migrate:apply -- --confirm-backup` is the only apply command and
  requires an explicit restorable-backup confirmation.
- Migration records are stored in the `schema_migrations` collection. Existing
  records are not reapplied; the required index set is verified on every apply.
- Shared Zod ObjectId, pagination, and API error-envelope contracts now live in
  `src/app/api/lib/contracts.ts`. Authentication now uses a typed user
  repository and service instead of placing its MongoDB queries in the route
  support module.

## Migration status

The migration set contains:

1. `20260726.001-legacy-tenant-data`: creates missing default roles and
   backfills the default organization, organization metadata, and legacy tenant
   ownership.
2. `20260726.002-required-indexes`: creates named, idempotent indexes covering
   tenant scope, identity, parent/child relationships, media/search sorting,
   and required uniqueness constraints.

No migration has been applied from this workspace. Production and staging data
must be backed up and verified before an operator runs the apply command.

## Verification

Passed locally on 2026-07-26:

```sh
pnpm format:check
pnpm lint
pnpm type-check
pnpm test
pnpm build
```

- Formatting, linting, and type-checking passed.
- Unit and contract tests passed: 54 files, 227 tests.
- The migration tests cover dry-run with legacy-shaped synthetic data, no writes
  during dry-run, empty-collection index verification, and repeated apply after
  the ledger and indexes are complete.
- Production webpack build passed.

The apply safety check was exercised without connecting to MongoDB:

```sh
pnpm migrate:apply
```

It exits with the expected backup-confirmation error. Before release, verify a
disposable legacy multi-tenant database with:

```sh
pnpm migrate:status
pnpm migrate:dry-run
pnpm migrate:apply -- --confirm-backup
pnpm migrate:status
pnpm migrate:apply -- --confirm-backup
```

The second apply must report no newly applied migrations and no missing
indexes. The live commands were not run here because this workspace is not an
authorized disposable database environment.

## Rollback

Restore the confirmed MongoDB backup before rolling back an applied migration.
Then revert this phase's code. Do not restore startup initialization writes:
they would make release behavior depend on application traffic and hide
migration failures.

## Next phase

Phase 3A should move users, role mappings, and institutions onto typed
repositories/services, replace their remaining raw handler queries, and add
their organization and field-filter integration coverage.
