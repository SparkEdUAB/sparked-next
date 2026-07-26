import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
import { dbClient } from '../src/app/api/lib/db';
import { applyMigrations, dryRunMigrations, migrationStatus } from '../src/app/api/lib/db/migrations/runner';

if (existsSync('.env')) {
  loadEnvFile('.env');
}

const [command] = process.argv.slice(2);

async function main() {
  if (!['status', 'dry-run', 'apply'].includes(command)) {
    throw new Error('Usage: pnpm migrate <status|dry-run|apply> [--confirm-backup]');
  }

  if (command === 'apply' && !process.argv.includes('--confirm-backup')) {
    throw new Error('Refusing to apply migrations without --confirm-backup. Confirm a restorable backup first.');
  }

  const db = await dbClient();
  const result =
    command === 'status'
      ? await migrationStatus(db)
      : command === 'dry-run'
        ? await dryRunMigrations(db)
        : await applyMigrations(db);
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
