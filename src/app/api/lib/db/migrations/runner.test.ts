import { Db } from 'mongodb';
import { describe, expect, it, vi } from 'vitest';
import { requiredIndexes, verifyRequiredIndexes } from './indexes';
import { applyMigrations, dryRunMigrations } from './runner';

function createDatabase({ applied = [], indexes = [] }: { applied?: string[]; indexes?: string[] } = {}) {
  const mutations = {
    createIndex: vi.fn(async (_key: unknown, options: { name?: string }) => options.name),
    updateOne: vi.fn(async () => ({ acknowledged: true })),
    insertMany: vi.fn(async () => ({ acknowledged: true })),
    insertOne: vi.fn(async () => ({ acknowledged: true })),
    updateMany: vi.fn(async () => ({ acknowledged: true })),
  };

  const db = {
    collection(name: string) {
      return {
        find: () => ({ toArray: async () => (name === 'schema_migrations' ? applied.map((_id) => ({ _id })) : []) }),
        findOne: async () => (name === 'institutions' ? { _id: { equals: () => true }, slug: 'default' } : null),
        countDocuments: async () => 2,
        listIndexes: () => ({ toArray: async () => indexes.map((index) => ({ name: index })) }),
        ...mutations,
      };
    },
  };

  return { db: db as unknown as Db, mutations };
}

describe('database migrations', () => {
  it('reports legacy data work during dry-run without making database writes', async () => {
    const { db, mutations } = createDatabase();

    const result = await dryRunMigrations(db);

    expect(result.dryRun).toBe(true);
    expect(result.results.map(({ id }) => id)).toEqual([
      '20260726.001-legacy-tenant-data',
      '20260726.002-required-indexes',
    ]);
    expect(mutations.createIndex).not.toHaveBeenCalled();
    expect(mutations.updateOne).not.toHaveBeenCalled();
    expect(mutations.insertMany).not.toHaveBeenCalled();
    expect(mutations.insertOne).not.toHaveBeenCalled();
    expect(mutations.updateMany).not.toHaveBeenCalled();
  });

  it('verifies each required index by name', async () => {
    const { db } = createDatabase({ indexes: requiredIndexes.map(({ index }) => index.name as string) });

    await expect(verifyRequiredIndexes(db)).resolves.toEqual({ verified: true, missing: [] });
  });

  it('treats collections that do not exist yet as missing indexes', async () => {
    const db = {
      collection: () => ({
        listIndexes: () => ({
          toArray: async () => {
            throw { code: 26, codeName: 'NamespaceNotFound' };
          },
        }),
      }),
    } as unknown as Db;

    await expect(verifyRequiredIndexes(db)).resolves.toEqual({
      verified: false,
      missing: requiredIndexes.map(({ collection, index }) => `${collection}.${index.name}`),
    });
  });

  it('is safe to apply again once the migration ledger and indexes are complete', async () => {
    const { db, mutations } = createDatabase({
      applied: ['20260726.001-legacy-tenant-data', '20260726.002-required-indexes'],
      indexes: requiredIndexes.map(({ index }) => index.name as string),
    });

    await expect(applyMigrations(db)).resolves.toMatchObject({ applied: [], indexes: { verified: true } });
    expect(mutations.createIndex).not.toHaveBeenCalled();
    expect(mutations.updateOne).not.toHaveBeenCalled();
  });
});
