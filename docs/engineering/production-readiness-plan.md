# SparkEd production-readiness roadmap

## Release rule

No release may proceed until full and production dependency audits report zero
known vulnerabilities. Advisories must be fixed, not suppressed or excepted.

## Delivery protocol

Each phase is one mergeable pull request. On completion, add a handoff at
`docs/engineering/phase-<phase>.md` containing its purpose, changed contracts,
migration status, exact verification commands and results, rollback notes, and
the next-phase context. Resume work by reading only the preceding handoff, the
active phase below, its affected tests, and the relevant subsystem code.

Do not start a phase until the preceding phase’s acceptance gate is green.
Staging data must be disposable synthetic multi-tenant data. Managed TLS Redis
is assumed for Phase 4. Phase 1 intentionally invalidates existing sessions.

## Phase 0A — Dependency vulnerability remediation

Update supported parent dependencies and use pnpm-native overrides only where a
parent cannot yet select a patched version. Add full and production audit CI
gates, retain a CI SBOM artifact, and keep Dependabot as the sole automated
dependency updater.

Acceptance: both audits are clean; type-check, unit tests, E2E, and production
build pass; compatibility notes are recorded.

Status: implemented in PR #487. See [Phase 0A handoff](./phase-0a.md).

## Phase 0B — Deterministic build and test baseline

- Record clean and warm timings for install, type-check, unit tests, production
  build, and E2E.
- Ensure build/module import never connects to MongoDB or Redis.
- Provide non-mutating `lint`, `format:check`, `type-check`, `test`,
  `test:coverage`, `test:e2e`, and `build` commands; reserve `*:fix` commands
  for explicit local use.
- Pin CI tooling, remove `npx ...@latest`, and make Husky invoke existing pnpm
  scripts.
- Add disposable synthetic fixtures for two organizations and every supported
  role.
- Add current API contract tests for URLs, methods, successful response shapes,
  and expected errors.
- Cache the pnpm store and Next build cache; run lint, type-check, tests, and
  build in parallel.

Acceptance: a clean build passes, warm CI build is at most 90 seconds, required
PR checks are at most eight minutes, and baseline metrics are recorded.

## Phase 1 — Authentication, authorization, and tenant isolation

- Replace browser-provided identity/JWT handoff with server-side credential
  verification and rotate authentication secrets to invalidate all sessions.
- Introduce one trusted server authorization context with identity, role, and
  organization; add shared `requireAuth`, `requireRole`, and
  `requireOrganizationAccess` guards.
- Apply guards to every protected read, write, upload, and delete route; retain
  only a small explicit public-route allowlist.
- Eliminate unauthenticated user enumeration and filter user fields by role.
- Validate request bodies, ObjectIds, pagination, and search input before use.
- Define rate-limit interfaces; implement Redis storage in Phase 4.

Compatibility: protected endpoints may newly return `401` or `403`; successful
response shapes and URLs remain compatible.

Acceptance: forged sessions, anonymous users, ordinary users, and other-tenant
users cannot read or mutate protected data; critical E2E journeys pass.

## Phase 2 — Explicit migrations and typed data access

- Replace startup backfills/default writes with versioned migration commands:
  `status`, `dry-run`, and `apply`.
- Add migration ledger, backup-confirmation requirement, idempotent indexes for
  tenant scope, identity, relationships, search, sorting, and uniqueness.
- Introduce shared Zod request/response schemas, error envelopes, ObjectId
  helpers, and pagination policy.
- Add typed services and repositories so route handlers stop duplicating raw
  MongoDB queries.

Acceptance: migrations dry-run safely on legacy synthetic data, repeated applies
are safe, required indexes are verified, and contract tests remain green.

## Phase 3A — Users, roles, and institutions

Migrate users, role mappings, and institutions to typed services; consistently
enforce organization checks and field-level filtering; preserve successful admin
flows and API responses.

Acceptance: user CRUD, role assignment, membership, and cross-tenant rejection
have integration coverage; no raw database query remains in these handlers.

## Phase 3B — Taxonomy and admin CRUD

Migrate grades, subjects, schools, programs, courses, units, topics, pages, and
categories one entity family at a time. Replace duplicate CRUD hooks with domain
hooks backed by a shared typed fetcher, and enforce parent/child integrity plus
tenant scope on every mutation.

Acceptance: every migrated family has contract, integration, role, and tenant
tests before the next family begins.

## Phase 3C — Media, uploads, and library

Migrate media list/search/detail/reactions/related content to typed services;
validate file metadata, type, and size server-side; use private storage and
presigned access where authorization applies; and add pagination and indexes.

Acceptance: media upload/view/search/reaction flows pass for every role; invalid
and cross-tenant file access is rejected.

## Phase 4 — Managed Redis cache and rate limiting

- Add a typed Redis/cache client through `REDIS_URL`, with timeouts, health
  checks, metrics, and safe MongoDB fallback.
- Use tenant-safe versioned keys:
  `sparked:v1:{environment}:{organizationId}:{resourceVersion}:{queryHash}`.
- Cache only verified read-heavy data: configuration, taxonomy, library
  lists/searches, and permitted media metadata.
- Never cache sessions, credentials, password resets, unverified requests, or
  tenant HTTP responses as public.
- Replace process-memory caches and invalidate by incrementing tenant/resource
  version keys after mutation; never wildcard-scan keys.
- Add Redis-backed limits for login, password reset, and uploads behind
  `CACHE_ENABLED`, rolling out local fixture, staging, then production.

Acceptance: cache isolation/invalidation tests pass, outages fall back safely,
and hit rate, latency, eviction, and fallback metrics are visible.

## Phase 5 — Next.js, React, accessibility, and performance

Keep pages/layouts server-first, reduce client boundaries, add route loading and
recovery UIs, remove waterfalls, dynamically load PDF/video/chart dependencies,
and use bundle analysis on demand. Add complete metadata, robots, sitemap, Open
Graph, optimized fonts/images, and resolve keyboard, focus, dialog, label,
status, and contrast issues.

Acceptance: critical E2E remains unchanged, bundle/Lighthouse metrics improve
over Phase 0, and no unnecessary client boundary is added.

## Phase 6 — Deployment, observability, and open-source release

Deploy immutable tested artifacts rather than mutable branch pulls. Add
health/readiness checks, structured non-PII logging, error tracking,
Redis/Mongo metrics, uptime monitoring, backups, rollback procedures, synthetic
multi-tenant staging verification, and staging soak/backup-restore/rollback
drills. Refresh project documentation, issue forms, PR template, governance,
maintainer/release guidance, and private security disclosure policy.

Acceptance: staging verification, backup/restore drill, rollback drill, clean
vulnerability audits, and new-contributor onboarding all pass.

## Required test gates

- Full and production audits: zero vulnerabilities.
- Unit: schemas, authorization guards, cache keys, invalidation, and rate
  limits.
- Integration: disposable MongoDB/Redis with role and tenant matrix.
- Contract: endpoint URLs, methods, statuses, and successful response fields.
- E2E: production authentication, password reset, admin CRUD, library
  search/view, uploads, and cross-tenant denial.
- Migration: empty, legacy synthetic, dry-run, apply, repeated apply, and
  rollback verification.
- Performance: clean/warm build, CI duration, bundle size, Core Web Vitals,
  cache hit rate, and database latency.
