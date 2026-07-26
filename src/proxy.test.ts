import { describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const { getToken } = vi.hoisted(() => ({ getToken: vi.fn() }));

vi.mock('next-auth/jwt', () => ({ getToken }));

import { proxy } from './proxy';

const request = (path: string, method = 'GET') => new NextRequest(`http://localhost${path}`, { method });

describe('API authorization proxy', () => {
  it('allows only explicit public API paths without a session', async () => {
    getToken.mockResolvedValue(null);

    expect((await proxy(request('/api/config/readConfigFile'))).status).toBe(200);
    expect((await proxy(request('/api/users/fetchUsers'))).status).toBe(401);
  });

  it('rejects sessions from an older authentication-secret rotation', async () => {
    getToken.mockResolvedValue({
      sub: 'user-1',
      role: 'Admin',
      organizationId: 'organization-1',
      authSessionVersion: '1',
    });

    expect((await proxy(request('/api/users/fetchUsers'))).status).toBe(401);
  });

  it('rejects ordinary users from protected mutations', async () => {
    getToken.mockResolvedValue({
      sub: 'user-1',
      role: 'student',
      organizationId: 'organization-1',
      authSessionVersion: '2',
    });

    expect((await proxy(request('/api/users/createUser', 'POST'))).status).toBe(403);
  });

  it('allows authorized role and platform-admin mutations', async () => {
    getToken.mockResolvedValue({
      sub: 'user-1',
      role: 'Content Manager',
      organizationId: 'organization-1',
      authSessionVersion: '2',
    });
    expect((await proxy(request('/api/users/createUser', 'POST'))).status).toBe(200);

    getToken.mockResolvedValue({
      sub: 'user-2',
      role: 'Editor',
      organizationId: 'organization-1',
      isPlatformAdmin: true,
      authSessionVersion: '2',
    });
    expect((await proxy(request('/api/users/createUser', 'POST'))).status).toBe(200);
  });
});
