import { describe, expect, it } from 'vitest';
import { SUPPORTED_ROLES, SYNTHETIC_TENANTS, SYNTHETIC_USERS } from '../fixtures/tenants';
import { GET as getConfig } from '../../src/app/api/config/[slug]/route';
import SPARKED_PROCESS_CODES from '../../src/app/shared/processCodes';

const request = (path: string) => new Request(`http://localhost${path}`);
const params = (slug: string) => ({ params: Promise.resolve({ slug }) });

describe('API contracts', () => {
  it('keeps the public configuration URL, method, and success response shape', async () => {
    const response = await getConfig(request('/api/config/readConfigFile') as never, params('readConfigFile'));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      isError: false,
      configData: expect.any(Object),
      code: expect.any(Number),
    });
  });

  it('returns the established error envelope for an unknown configuration operation', async () => {
    const response = await getConfig(
      request('/api/config/not-a-real-operation') as never,
      params('not-a-real-operation'),
    );
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toEqual({
      isError: true,
      code: SPARKED_PROCESS_CODES.METHOD_NOT_FOUND,
    });
  });

  it('provides disposable two-tenant fixtures for every supported role', () => {
    expect(SYNTHETIC_TENANTS).toHaveLength(2);
    expect(SYNTHETIC_USERS).toHaveLength(SYNTHETIC_TENANTS.length * SUPPORTED_ROLES.length);

    for (const organization of SYNTHETIC_TENANTS) {
      expect(
        SYNTHETIC_USERS.filter((user) => user.organizationId === organization.id).map((user) => user.role),
      ).toEqual(SUPPORTED_ROLES);
    }
  });
});
