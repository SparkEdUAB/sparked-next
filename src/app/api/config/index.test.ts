import { describe, expect, it } from 'vitest';
import { UNIT_FIELD_NAMES_CONFIG } from '../unit/constants';
import { getDbFieldNamesConfigStatus } from './index';

describe('getDbFieldNamesConfigStatus', () => {
  it('returns an empty projection when optional fields are disabled', async () => {
    await expect(getDbFieldNamesConfigStatus({ dbConfigData: UNIT_FIELD_NAMES_CONFIG })).resolves.toEqual({});
  });
});
