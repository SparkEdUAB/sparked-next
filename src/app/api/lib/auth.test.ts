import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getServerSession } = vi.hoisted(() => ({ getServerSession: vi.fn() }));

vi.mock('next-auth/next', () => ({ getServerSession }));
vi.mock('../auth/authOptions', () => ({ authOptions: {} }));

import { getAuthorizationContext, requireAuth, requireOrganizationAccess, requireRole } from './auth';

describe('server authorization guards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects a missing or incomplete server session', async () => {
    getServerSession.mockResolvedValue(null);
    expect(await getAuthorizationContext()).toBeNull();

    const response = await requireAuth();
    expect(response).toBeInstanceOf(Response);
    expect((response as Response).status).toBe(401);
    await expect((response as Response).json()).resolves.toMatchObject({ isError: true, code: 401 });
  });

  it('builds authorization context from the signed server session', async () => {
    getServerSession.mockResolvedValue({
      user: {
        id: 'user-1',
        role: 'Editor',
        organizationId: 'organization-1',
        isPlatformAdmin: false,
      },
    });

    await expect(getAuthorizationContext()).resolves.toMatchObject({
      userId: 'user-1',
      role: 'Editor',
      organizationId: 'organization-1',
    });
  });

  it('enforces roles and organization boundaries', () => {
    const context = {
      userId: 'user-1',
      role: 'Editor',
      organizationId: 'organization-1',
      isPlatformAdmin: false,
      session: {} as never,
    };

    expect(requireRole(context, ['Admin'])).toMatchObject({ status: 403 });
    expect(requireRole(context, ['Editor'])).toBeNull();
    expect(requireOrganizationAccess(context, 'organization-2')).toMatchObject({ status: 403 });
    expect(requireOrganizationAccess(context, 'organization-1')).toBeNull();
  });
});
