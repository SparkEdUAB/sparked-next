import { Db } from 'mongodb';
import { addDefaultRoles, countMissingDefaultRoles } from './addDefaultRoles';
import {
  addDefaultOrganizationAndTenantData,
  previewDefaultOrganizationAndTenantData,
} from './addDefaultOrganizationAndTenantData';
import { createRequiredIndexes, requiredIndexes, verifyRequiredIndexes } from './indexes';

const migrationLedger = 'schema_migrations';

type MigrationResult = Record<string, number | boolean>;

type Migration = {
  id: string;
  description: string;
  apply: (db: Db) => Promise<MigrationResult>;
  dryRun: (db: Db) => Promise<MigrationResult>;
};

const migrations: Migration[] = [
  {
    id: '20260726.001-legacy-tenant-data',
    description: 'Create default roles and backfill legacy organization ownership.',
    async apply(db) {
      const roles = await addDefaultRoles(db);
      await addDefaultOrganizationAndTenantData(db);
      return { ...roles, applied: true };
    },
    async dryRun(db) {
      const [missingRoles, tenantData] = await Promise.all([
        countMissingDefaultRoles(db),
        previewDefaultOrganizationAndTenantData(db),
      ]);
      return { missingRoles, ...tenantData };
    },
  },
  {
    id: '20260726.002-required-indexes',
    description: 'Create tenant, identity, relationship, search, sort, and uniqueness indexes.',
    apply: createRequiredIndexes,
    async dryRun(db) {
      const verification = await verifyRequiredIndexes(db);
      return { requiredIndexes: requiredIndexes.length, missingIndexes: verification.missing.length };
    },
  },
];

export type MigrationStatus = {
  id: string;
  description: string;
  applied: boolean;
};

export async function migrationStatus(db: Db) {
  const ledger = db.collection<{ _id: string }>(migrationLedger);
  const applied = new Set((await ledger.find({}, { projection: { _id: 1 } }).toArray()).map((entry) => entry._id));
  const indexes = await verifyRequiredIndexes(db);

  return {
    migrations: migrations.map(({ id, description }) => ({ id, description, applied: applied.has(id) })),
    indexes,
  };
}

export async function dryRunMigrations(db: Db) {
  const status = await migrationStatus(db);
  const pending = status.migrations.filter((migration) => !migration.applied);
  const results = await Promise.all(
    pending.map(async ({ id }) => ({
      id,
      result: await migrations.find((migration) => migration.id === id)!.dryRun(db),
    })),
  );

  return { ...status, dryRun: true, results };
}

export async function applyMigrations(db: Db) {
  const status = await migrationStatus(db);
  const pending = new Set(status.migrations.filter((migration) => !migration.applied).map((migration) => migration.id));
  const ledger = db.collection<{ _id: string; applied_at: Date; description: string }>(migrationLedger);
  const results: Array<{ id: string; result: MigrationResult }> = [];

  for (const migration of migrations) {
    if (!pending.has(migration.id)) {
      continue;
    }
    const result = await migration.apply(db);
    await ledger.updateOne(
      { _id: migration.id },
      { $setOnInsert: { applied_at: new Date(), description: migration.description } },
      { upsert: true },
    );
    results.push({ id: migration.id, result });
  }

  const indexes = await verifyRequiredIndexes(db);
  if (!indexes.verified) {
    await createRequiredIndexes(db);
  }

  return { applied: results, indexes: await verifyRequiredIndexes(db) };
}
