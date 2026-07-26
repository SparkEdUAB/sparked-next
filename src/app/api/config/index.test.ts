import { describe, expect, it } from 'vitest';
import { getDbFieldNamesConfigStatus } from './index';

describe('metadata projection configuration', () => {
  it('adds only enabled optional fields to an inclusion projection', async () => {
    await expect(
      getDbFieldNamesConfigStatus({
        dbConfigData: [
          { key: 'schools', fieldName: 'school.name' },
          { key: 'programs', fieldName: 'program.name' },
        ],
      }),
    ).resolves.toEqual({});
  });
});
