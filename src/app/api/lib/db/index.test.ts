import { beforeEach, describe, expect, it, vi } from 'vitest';

const { connect, mongoClient } = vi.hoisted(() => ({
  connect: vi.fn(),
  mongoClient: vi.fn(),
}));

vi.mock('mongodb', () => ({
  MongoClient: mongoClient,
}));

describe('database client', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    delete global._mongoClientPromise;
    mongoClient.mockImplementation(() => ({ connect }));
  });

  it('does not construct or connect a MongoDB client when imported', async () => {
    await import('./index');

    expect(mongoClient).not.toHaveBeenCalled();
    expect(connect).not.toHaveBeenCalled();
  });
});
